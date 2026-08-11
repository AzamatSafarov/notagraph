# Obsidian Universe

Neural Cartography of Ideas - visualize your notes as a 3D knowledge graph with AI embeddings and LLM annotations.

**Live:** https://topologies-of-ideas-universal.vercel.app

## How to use

1. Choose a provider (Azure, Gemini, OpenAI, OpenRouter, Mistral, Groq, or Ollama)
2. Paste your API key (click "GET API KEY" link if you need one)
3. Enter model names (pre-filled with recommended defaults)
4. Click **SELECT NOTES FOLDER** and choose a folder with `.md` or `.txt` files
5. Wait for the pipeline to complete (embeddings, clustering, LLM annotations)
6. Explore your knowledge graph in 4 topology modes:
   - **CORE** - medoid at center, notes radiate outward
   - **CLUSTERS** - thematic hubs with orbiting notes
   - **NEURAL** - UMAP projection, semantic proximity
   - **PLANET** - clusters as continents on a sphere

## Features

- 7 AI providers with smart field visibility
- 3D force-directed graph with CSS2D labels and bloom post-processing
- KMeans clustering with k-means++ initialization
- PCA, UMAP, k-NN for layout computation
- LLM-powered: cluster naming, edge labeling, center nomination
- Planet topology with surface arcs connecting nodes
- Parallel edge labeling (150 pairs per round)
- Rate limit retry with backoff (Azure 429/503)
- IndexedDB cache with session resume
- Export graph as standalone HTML
- Copy link to restore graph state
- VFX control panel (node size, link opacity, bloom, particles)
- Light/dark theme toggle
- Firefox fallback (webkitdirectory when showDirectoryPicker unavailable)
- No tracking, no telemetry. API keys stored in localStorage only.

## Browser support

- Chrome / Edge (full support - showDirectoryPicker)
- Firefox (fallback to webkitdirectory folder picker)
- Safari (use webkitdirectory fallback)

## Privacy

All processing happens in your browser. Notes are read locally and never uploaded. API keys are stored in localStorage and sent only to the chosen AI provider. No analytics, no cookies, no third-party tracking.

## Providers

| Provider | Chat | Embeddings | Get Key |
|---|---|---|---|
| Azure OpenAI | gpt-5.4 | text-embedding-3-small | [portal.azure.com](https://portal.azure.com) |
| Gemini | gemini-2.5-flash | gemini-embedding-001 | [aistudio.google.com](https://aistudio.google.com/apikey) |
| OpenAI | gpt-4o-mini | text-embedding-3-small | [platform.openai.com](https://platform.openai.com/api-keys) |
| OpenRouter | openai/gpt-4o-mini | openai/text-embedding-3-small | [openrouter.ai](https://openrouter.ai/keys) |
| Mistral | mistral-small-latest | mistral-embed | [console.mistral.ai](https://console.mistral.ai/api-keys) |
| Groq | llama-3.3-70b-versatile | via Ollama fallback | [console.groq.com](https://console.groq.com/keys) |
| Ollama | llama3.1:8b | nomic-embed-text | Local only, no key needed |

## Tech

- Three.js + 3d-force-graph
- UMAP.js, PCA power iteration
- IndexedDB for session caching
- Single HTML file, no build step

Built for the open-source community.