# Project Instructions

## ZIP Packaging Requirement

Whenever you build any app, website, bot, or project, you MUST package the complete project into one ZIP file when done.

### Rules

1. Put **all files and folders** inside the ZIP — no exceptions.
2. Include frontend, backend, assets, config files, package files (`package.json`, `requirements.txt`, etc.), and a `README.md`.
3. Do not deliver scattered code snippets as the final output. The ZIP is the deliverable.
4. The ZIP must be ready to download, extract, and run with no additional file hunting.
5. Always include a `README.md` at the root of the ZIP covering:
   - How to install dependencies
   - How to run the project locally
   - How to edit / customize it
   - How to deploy it

### How to create the ZIP

After writing all project files into a folder (e.g., `my-project/`), run:

```bash
zip -r my-project.zip my-project/
```

Then tell the user the exact path to the ZIP file so they can download it.

If `zip` is not available, provide the equivalent `tar` command:

```bash
tar -czf my-project.tar.gz my-project/
```
