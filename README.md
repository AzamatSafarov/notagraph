# Topologies of Ideas Universal

Topologies of Ideas Universal is a standalone browser app that turns an Obsidian vault into a 3D graph of notes, clusters, and connections.

No build step. No backend. Open `app.html` and run it locally in the browser.

## What this version fixes

The original build was effectively tied to Gemini. This version removes that limitation.

You can now:

- use a normal **single-provider setup** for most cases
- paste **any supported API key**, not just Gemini
- keep one provider for both embeddings and annotation by default
- optionally enable a separate **annotation-only provider** for cluster names and edge labels
- pick a notes folder even in browsers that do not expose `showDirectoryPicker()` by falling back to `webkitdirectory`

## Quick start

1. Open `app.html` in a Chromium-based browser.
2. In **Main AI Provider**, choose your provider.
3. Paste your API key.
4. Leave the prefilled model values alone unless your provider uses custom deployment names.
5. Click **Select Notes Folder**.
6. Enable the advanced annotation override only if you really want a second provider just for naming/labeling.

## Best default choices

### Ollama Cloud

Use this if you want the easiest setup.

- Provider: `Ollama Cloud`
- Base URL: leave `https://ollama.com/v1`
- Chat model: keep the default or replace it with your preferred Ollama Cloud chat model
- Embedding model: usually keep the default

### Azure OpenAI

Use this if your models are deployed in Azure.

- Provider: `Azure OpenAI`
- Base URL: your Azure resource root, for example `https://YOUR-RESOURCE.openai.azure.com`
- API version: usually `2024-02-01`
- Chat model: your chat deployment name
- Embedding model: your embedding deployment name

## Supported providers

### Main provider mode

These providers can drive the whole pipeline in the simple one-provider setup:

- Ollama Cloud
- Azure OpenAI
- OpenRouter
- OpenAI
- Gemini
- Ollama Local
- Mistral
- Custom OpenAI-compatible endpoint

### Advanced annotation-only override

These providers can be used only for cluster naming and edge labeling when the advanced override is enabled:

- Gemini
- OpenAI
- OpenRouter
- Azure OpenAI
- Ollama Cloud
- Ollama Local
- Anthropic
- Groq
- Together AI
- DeepSeek
- xAI
- Mistral
- Fireworks AI
- Cerebras
- Perplexity
- Custom OpenAI-compatible endpoint

## Provider notes

- **Azure OpenAI:** use the Azure resource root as Base URL. Model fields should contain deployment names.
- **Anthropic:** available in the annotation override path, not as the main embedding provider in this UI.
- **Ollama Local:** expects a local Ollama server, usually at `http://localhost:11434/v1`.
- **Custom OpenAI-compatible:** should expose compatible `/embeddings` and `/chat/completions` endpoints.

## Browser compatibility

The app tries `window.showDirectoryPicker()` first.

If the browser does not expose that API, it falls back to a hidden folder input using `webkitdirectory`. This improves compatibility with Chromium-derived browsers that block or omit the File System Access API.

## Files

- `app.html` — the standalone application
- `verify-provider-support.js` — local verification script for provider config behavior and folder-picker fallback

## Local verification

Run:

```bash
node verify-provider-support.js
```

This checks:

- simple-mode provider defaults
- Azure default field mapping
- advanced annotation override wiring
- provider-specific request construction
- folder-picker fallback behavior
