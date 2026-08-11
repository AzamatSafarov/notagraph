# Obsidian Universe

Obsidian Universe is a standalone browser app that turns a folder of notes into an interactive 3D graph of ideas, clusters, and semantic connections.

No build step. No backend. Open `app.html` and run it in the browser.

## Features

- **3D force-directed graph** with three topology modes: Core, Clusters, Neural
- **Animated pointillism background** - colorful dots drift across the screen, connect with lines, and react to your cursor
- **Multi-provider support** - Azure OpenAI, Gemini, OpenAI, OpenRouter, Ollama Local
- **Automatic clustering** via KMeans with LLM-generated cluster names
- **Semantic edge labeling** - AI describes how each pair of notes relates
- **Light/dark theme toggle** with customizable VFX (colors, bloom, particles, link width)
- **Export snapshot** - save the current graph as a standalone HTML file
- **IndexedDB caching** - resume previous sessions without re-running the pipeline

## Quick start

1. Open `app.html` in a Chromium-based browser (Chrome, Edge, Brave)
2. Select your provider from the dropdown
3. Paste your API key
4. Click **Select Notes Folder** and choose a folder with `.md` or `.txt` files
5. The app will embed, cluster, and annotate your notes automatically

## Supported providers

| Provider | Chat | Embeddings | Notes |
|---|---|---|---|
| Azure OpenAI | Yes | Yes | Use deployment names as model names |
| Gemini | Yes | Yes | Native Google API |
| OpenAI | Yes | Yes | Standard OpenAI API |
| OpenRouter | Yes | Yes | OpenAI-compatible endpoint |
| Ollama Local | Yes | Yes | Requires local Ollama server |

## Topology modes

- **Core** - Spherical layout with the medoid at the center, all notes radiate outward
- **Clusters** - Fibonacci sphere of cluster hubs with notes orbiting their hub
- **Neural** - UMAP 3D projection where semantic similarity drives proximity

## Visual design

- Light cream background with animated colorful dot network (pointillism style)
- Cormorant Garamond serif for titles, JetBrains Mono for UI
- Bright playful cluster colors: coral, teal, purple, yellow, green
- Glassmorphism UI panels with soft shadows
- Dark mode toggle available

## Files

- `app.html` - the standalone application
- `index.html` - copy of app.html for static hosting
- `LICENSE` - MIT license

## Tech

- 3D Force Graph (three.js + 3d-force-graph)
- UMAP for dimensionality reduction
- KMeans++ for clustering
- PCA for layout computation
- CSS2DRenderer for constant-size node labels
- UnrealBloomPass for post-processing glow
- Canvas-based animated background

## Deployment

The app is deployed on Vercel as a static site:

https://topologies-of-ideas-universal.vercel.app