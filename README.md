# NxScript.Page

Official website for NxScript - a scripting language for Haxe.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Structure

- `src/components/` - React components (Header, Footer, TryEditor, ApiDoc, etc.)
- `src/pages/` - Page components (Home, Docs, Api, Try, Examples, Blog)
- `src/content/` - Markdown documentation and blog posts
- `public/` - Static assets (nxscript.js and api.xml copied during CI)

## CI/CD

The GitHub Action automatically:
1. Checks out NxScript repo
2. Builds `nxscript.js` via `haxe build_js.hxml`
3. Generates `api.xml` via `haxe doc.hxml`
4. Copies both to `public/`
5. Builds the React app
6. Deploys to GitHub Pages

## Features

- **Try Online**: Interactive REPL with Monaco Editor
- **Documentation**: Markdown-based docs with syntax highlighting
- **API Reference**: Auto-generated from Haxe XML docs
- **Examples**: Code snippets with expected output
- **Blog**: News and updates

## License

Apache 2.0
