-- ─────────────────────────────────────────────────────────────────────────────
-- Allow an organization to have more than one admin (up to a max of 3), with
-- only the ORIGINAL/owning admin able to promote other members to admin or
-- demote them back.
--
-- Safe to run multiple times.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.organizations
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

-- Backfill: for any org with no owner yet, use its earliest-approved admin.
update public.organizations o
set owner_id = sub.user_id
from (
  select distinct on (organization_id) organization_id, user_id
  from public.organization_members
  where role = 'admin' and status = 'approved'
  order by organization_id, joined_at asc nulls last, approved_at asc nulls last
) sub
where o.id = sub.organization_id
  and o.owner_id is null;

-- ── ast_get_or_create_org: set owner_id on first creation, preserve after ───
create or replace function public.ast_get_or_create_org(input_user_id uuid, input_user_email text)
returns table (organization_id uuid, org jsonb, member jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := input_user_id;
  v_email text := lower(trim(coalesce(input_user_email, '')));
  v_domain text := lower(split_part(lower(trim(coalesce(input_user_email, ''))), '@', 2));
  v_org_id uuid;
  v_org_json jsonb;
  v_member_json jsonb;
  v_display_name text;
begin
  if v_user_id is null then
    raise exception 'Missing user id.';
  end if;
  if auth.uid() is null or auth.uid() <> v_user_id then
    raise exception 'Not authorized.';
  end if;

  if v_domain = '' then
    v_domain := 'gmail.com';
  end if;

  v_display_name := coalesce(nullif(split_part(v_email, '@', 1), ''), 'Admin');

  insert into public.organizations as o (name, domain, owner_id)
  values ('Organization Workspace', v_domain, v_user_id)
  on conflict (domain) do update set
    domain = excluded.domain,
    owner_id = coalesce(o.owner_id, excluded.owner_id)
  returning o.id, to_jsonb(o.*) into v_org_id, v_org_json;

  insert into public.profiles as p (
    id, email, original_email, auth_email, full_name,
    account_type, organization_id, role, requested_role,
    membership_status, access_status, subscription_status, plan_type
  ) values (
    v_user_id, v_email, v_email, v_email, v_display_name,
    'organization', v_org_id, 'admin', 'admin',
    'approved', 'active', 'free_access', 'organization'
  )
  on conflict (id) do update set
    account_type = 'organization',
    organization_id = v_org_id,
    role = 'admin',
    requested_role = 'admin',
    membership_status = 'approved',
    access_status = 'active',
    subscription_status = case
      when p.subscription_status in ('paid','free_access','trial') then p.subscription_status
      else 'free_access'
    end,
    plan_type = 'organization';

  insert into public.organization_members as m (
    organization_id, user_id, role, requested_role,
    display_name, username, email, status, is_active,
    joined_at, approved_at, approved_by
  ) values (
    v_org_id, v_user_id, 'admin', 'admin',
    v_display_name, 'admin', v_email, 'approved', true,
    now(), now(), v_user_id
  )
  on conflict (organization_id, user_id) do update set
    role = 'admin',
    requested_role = 'admin',
    status = 'approved',
    is_active = true,
    approved_at = coalesce(m.approved_at, now()),
    approved_by = coalesce(m.approved_by, v_user_id)
  returning to_jsonb(m.*) into v_member_json;

  return query select v_org_id, v_org_json, v_member_json;
end;
$$;

-- ── Trigger: block any non-RPC path from setting role -> 'admin' ────────────
create or replace function public.ast_protect_admin_promotion()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon') then
    if new.role = 'admin' and old.role is distinct from 'admin' then
      raise exception 'Admin role can only be assigned by the organization owner, via Make Admin.';
    end if;
    if old.role = 'admin' and new.role is distinct from 'admin' then
      raise exception 'Removing the admin role must go through Remove Admin, not a direct update.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists ast_protect_admin_promotion_trigger on public.organization_members;
create trigger ast_protect_admin_promotion_trigger
before update on public.organization_members
for each row execute function public.ast_protect_admin_promotion();

-- ── promote_organization_admin: owner-only, capped at 3 admins ──────────────
create or replace function public.promote_organization_admin(p_member_id uuid)
returns public.organization_members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target public.organization_members;
  v_org_owner uuid;
  v_admin_count int;
  v_result public.organization_members;
begin
  if auth.uid() is null then
    raise exception 'Not authorized.';
  end if;

  select * into v_target from public.organization_members where id = p_member_id;
  if v_target.id is null then
    raise exception 'Member not found.';
  end if;

  select owner_id into v_org_owner from public.organizations where id = v_target.organization_id;
  if v_org_owner is null or v_org_owner <> auth.uid() then
    raise exception 'Only the organization owner can assign new admins.';
  end if;

  if v_target.status <> 'approved' then
    raise exception 'Only approved members can be made admin.';
  end if;

  if v_target.role = 'admin' then
    raise exception 'This member is already an admin.';
  end if;

  select count(*) into v_admin_count
  from public.organization_members
  where organization_id = v_target.organization_id
    and role = 'admin'
    and status = 'approved';

  if v_admin_count >= 3 then
    raise exception 'This organization already has the maximum of 3 admins.';
  end if;

  update public.organization_members
  set role = 'admin', requested_role = 'admin'
  where id = p_member_id
  returning * into v_result;

  return v_result;
end;
$$;

grant execute on function public.promote_organization_admin(uuid) to authenticated;

-- ── demote_organization_admin: owner-only, cannot demote the owner ──────────
create or replace function public.demote_organization_admin(p_member_id uuid, p_new_role text default 'staff')
returns public.organization_members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target public.organization_members;
  v_org_owner uuid;
  v_clean_role text;
  v_result public.organization_members;
begin
  if auth.uid() is null then
    raise exception 'Not authorized.';
  end if;

  select * into v_target from public.organization_members where id = p_member_id;
  if v_target.id is null then
    raise exception 'Member not found.';
  end if;

  select owner_id into v_org_owner from public.organizations where id = v_target.organization_id;
  if v_org_owner is null or v_org_owner <> auth.uid() then
    raise exception 'Only the organization owner can remove an admin.';
  end if;

  if v_target.role <> 'admin' then
    raise exception 'This member is not an admin.';
  end if;

  if v_target.user_id = v_org_owner then
    raise exception 'The organization owner cannot be demoted.';
  end if;

  v_clean_role := lower(trim(coalesce(p_new_role, 'staff')));
  if v_clean_role not in ('manager','accountant','hr','secretary','senior_staff','staff') then
    v_clean_role := 'staff';
  end if;

  update public.organization_members
  set role = v_clean_role, requested_role = v_clean_role
  where id = p_member_id
  returning * into v_result;

  return v_result;
end;
$$;

grant execute on function public.demote_organization_admin(uuid, text) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Fix: three earlier protective triggers this session were declared SECURITY
-- DEFINER, which makes current_user inside them always equal the function's
-- own owner — never 'authenticated'/'anon' — so their guard could never fire
-- for anyone. Dropping SECURITY DEFINER (falls back to SECURITY INVOKER)
-- fixes it. Bodies are otherwise identical to the originals.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.ast_protect_org_member_role_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated','anon') then
    if coalesce(old.assigned_role,'') is distinct from coalesce(new.assigned_role,'')
      or coalesce(old.hierarchy_level, -1) is distinct from coalesce(new.hierarchy_level, -1)
      or old.approved_by is distinct from new.approved_by
      or old.approved_at is distinct from new.approved_at
    then
      raise exception 'Role/hierarchy changes must go through org_plus_assign_role(), not a direct update.';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.ast_protect_profile_access_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated','anon') then
    if coalesce(old.access_status,'') is distinct from coalesce(new.access_status,'')
      or coalesce(old.subscription_status,'') is distinct from coalesce(new.subscription_status,'')
      or coalesce(old.account_type,'') is distinct from coalesce(new.account_type,'')
      or old.organization_id is distinct from new.organization_id
      or coalesce(old.role,'') is distinct from coalesce(new.role,'')
      or coalesce(old.membership_status,'') is distinct from coalesce(new.membership_status,'')
      or old.approved_at is distinct from new.approved_at
      or old.approved_by is distinct from new.approved_by
      or coalesce(old.plan_type,'') is distinct from coalesce(new.plan_type,'')
      or coalesce(old.plan,'') is distinct from coalesce(new.plan,'')
      or coalesce(old.ai_addon_active, false) is distinct from coalesce(new.ai_addon_active, false)
      or old.ai_addon_expires_at is distinct from new.ai_addon_expires_at
      or old.subscription_expires_at is distinct from new.subscription_expires_at
      or old.trial_ends_at is distinct from new.trial_ends_at
      or old.payment_verified_at is distinct from new.payment_verified_at
      or coalesce(old.paystack_auth_code,'') is distinct from coalesce(new.paystack_auth_code,'')
      or coalesce(old.paystack_customer_code,'') is distinct from coalesce(new.paystack_customer_code,'')
      or coalesce(old.paystack_transaction_id,'') is distinct from coalesce(new.paystack_transaction_id,'')
    then
      raise exception 'Protected profile fields cannot be changed from the browser.';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.ast_protect_onboarding_task_pin()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated','anon') then
    if old.task_id is distinct from new.task_id
      or old.organization_id is distinct from new.organization_id
      or old.user_id is distinct from new.user_id
    then
      raise exception 'task_id/organization_id/user_id cannot be changed after creation.';
    end if;
  end if;
  return new;
end;
$$;

notify pgrst, 'reload schema';
