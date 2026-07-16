# Topologies of Ideas Universal

A standalone browser app that turns an Obsidian vault into a 3D idea graph — now with split provider support for **embeddings** and **annotation/chat**.

## What changed

The original build was tied to Gemini. This version lets you mix providers:

- one provider for **embeddings**
- another provider for **cluster naming / center nomination / edge labels**

That means you can do things like:
- OpenAI embeddings + Anthropic annotations
- Azure OpenAI embeddings + Groq annotations
- Ollama Cloud embeddings + OpenRouter annotations
- Gemini embeddings + xAI annotations

## Included provider presets

### Embedding side
- Gemini
- OpenAI
- OpenRouter
- Azure OpenAI
- Ollama Cloud
- Ollama Local
- Mistral
- Custom OpenAI-compatible endpoint

### Chat / annotation side
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

## Important notes

- **Azure OpenAI** uses `api-key` auth and requires an API version. In this app, set the base URL to your Azure resource root (for example `https://YOUR-RESOURCE.openai.azure.com`) and the model field to your deployment name.
- **Anthropic** is supported for the chat/annotation pipeline only. Use another embedding provider for vectors.
- **Ollama Cloud** uses the OpenAI-compatible endpoint at `https://ollama.com/v1`.
- **Ollama Local** uses `http://localhost:11434/v1`.
- Any provider that exposes OpenAI-style `/embeddings` and `/chat/completions` can be used through the custom preset.

## Quick start

1. Open `app.html` in Chrome or another Chromium browser.
2. Fill the **embedding pipeline** section.
3. Fill the **annotation pipeline** section.
4. Select your notes folder.
5. Wait for the graph to embed, cluster, annotate, and render.

## Browser requirement

This app uses the File System Access API for folder selection, so it needs Chrome / Edge / another Chromium-based browser.
