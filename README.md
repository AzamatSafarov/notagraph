# Topologies of Ideas Universal

A standalone browser app that turns an Obsidian vault into a 3D idea graph.

## What changed

The original build was locked to Gemini. This version keeps the extra provider support, but now the UI is simpler:

- **Simple mode by default**: one provider block for everything
- one API key field
- one base URL field
- one chat model field
- one embedding model field that you can usually leave as-is
- **advanced annotation override** only if you really want a different provider for cluster naming and edge labels

## Good defaults if you only have Ollama Cloud or Azure

### Ollama Cloud
- Provider: `Ollama Cloud`
- Base URL: `https://ollama.com/v1`
- Chat model: leave the default or pick your preferred Ollama Cloud chat model
- Embedding model: leave the default unless you know you want another embedding model

### Azure OpenAI
- Provider: `Azure OpenAI`
- Base URL: your Azure resource root, for example `https://YOUR-RESOURCE.openai.azure.com`
- API version: usually `2024-02-01`
- Chat model: your Azure chat deployment name
- Embedding model: your Azure embedding deployment name

## Included providers

### Simple mode (one provider for everything)
- Ollama Cloud
- Azure OpenAI
- OpenRouter
- OpenAI
- Gemini
- Ollama Local
- Mistral
- Custom OpenAI-compatible endpoint

### Advanced annotation-only override
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

## Browser compatibility

The app now tries `window.showDirectoryPicker()` first, but if your browser does not expose that API it falls back to a hidden folder input (`webkitdirectory`). That makes browsers like Zen much more likely to work.

## Quick start

1. Open `app.html` in a Chromium-based browser.
2. Fill the **Main AI Provider** block.
3. Leave the embedding model alone if you do not know what it is.
4. Click **Select Notes Folder**.
5. Only turn on the advanced annotation override if you truly want a different provider for cluster naming.
