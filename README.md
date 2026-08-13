# Obsidian Universe

<div align="center">

```
Notes -> Embeddings -> Clusters -> LLM Labels -> 3D Graph -> Export
  md/txt     PCA/UMAP    KMeans+     naming,      Force      HTML
             k-NN        k-means++   labels       directed
```

[![Live](https://img.shields.io/badge/LIVE-topologies--of--ideas--universal.vercel.app-4dabf7?style=flat-square&logo=vercel)](https://topologies-of-ideas-universal.vercel.app)
[![Status](https://img.shields.io/badge/status-active-success?style=flat-square)](#)
[![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](#)

> Load your `.md` and `.txt` notes and watch AI build an explorable 3D universe of your knowledge. All local, no tracking.

</div>

## What it does

Picks up your note folder, sends text through an embedding model, clusters by semantic similarity, names clusters with LLM, labels connections, then drops everything into an interactive 3D graph with 4 topology modes. Export as standalone HTML, share with a link.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Notes Folder   │───→│  Embeddings     │───→│  PCA / UMAP     │
│  .md / .txt     │    │  7 providers    │    │  Dim reduction  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                           ↑
                           │    ┌─────────────────┐
                           └───→│  LLM Assistant  │
                                │  Cluster names  │
                                │  Edge labels    │
                                └─────────────────┘
                                                       │
                                                       ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Export HTML    │←───│  3D Force Graph │←───│  KMeans + k-NN  │
│  Embedded data  │    │  Three.js       │    │  Clusters       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Structure

```
topologies-of-ideas-universal/
├── 📖 README.md              ← you are here
├── 📜 CHANGELOG.md           ← history of changes
│
├── 🌐 app.html               ← single-file application (143K)
│   ├── 7 AI providers        ← Azure, Gemini, OpenAI, OR, Mistral, Groq, Ollama
│   ├── 4 topology modes      ← Core, Clusters, Neural, Planet
│   ├── VFX panel             ← bloom, particles, node size, link opacity
│   └── Export snapshot       ← standalone HTML with embedded graph data
│
├── 🎨 assets/
│   ├── logo-mark.svg         ← cosmic node cluster mark
│   └── hero-banner.svg       ← 3D knowledge constellation banner
│
├── 🔧 index.html             ← sync of app.html for Vercel root
├── 🔑 api/                   ← optional FastAPI RAG backend
│   ├── main.py               ← chat endpoint
│   └── requirements.txt      ← dependencies
│
└── 📦 .github/               ← topics set via GitHub API
```

## Providers

| Provider | Chat | Embeddings | Status |
|----------|------|-----------|--------|
| Azure OpenAI | GPT | text-embedding | ✅ Active |
| Gemini | Flash | embedding-001 | ✅ Active |
| OpenAI | GPT-4o-mini | text-embedding | ✅ Active |
| OpenRouter | Various | text-embedding | ✅ Active |
| Mistral | Small-latest | mistral-embed | ✅ Active |
| Groq | Llama-70B | Via Ollama fallback | ✅ Active |
| Ollama | Local models | nomic-embed-text | ✅ Local only |

## Status

| Feature | State |
|---------|-------|
| Multi-provider AI | ✅ Done |
| 3D force graph with bloom | ✅ Done |
| 4 topology modes | ✅ Done |
| LLM cluster naming | ✅ Done |
| LLM edge labeling | ✅ Done |
| Planet surface arcs | ✅ Done |
| Parallel labeling (150/round) | ✅ Done |
| Rate limit retry | ✅ Done |
| IndexedDB cache | ✅ Done |
| Export HTML snapshot | ✅ Done |
| Share link | ✅ Done |
| Search/filter | 🟡 Next |
| WebVR | 🟡 Next |
| Multi-folder colors | 🟡 Next |

## Where everything lives

| Layer | What | Where |
|-------|------|-------|
| Frontend | Single HTML app | `app.html` |
| 3D Engine | Three.js + force-graph | CDN (esm.sh) |
| AI | Your chosen provider | Browser -> API |
| Cache | IndexedDB | Browser local |
| Deploy | Static hosting | Vercel |
| Optional RAG | FastAPI + ChromaDB | `api/` |
| Optional backup | Git | This repo |

## Tech

| Component | Library |
|-----------|---------|
| 3D Graph | Three.js + 3d-force-graph + CSS2DRenderer |
| Dim Reduction | UMAP.js + power iteration PCA |
| Clustering | KMeans++ |
| Layout | Force-directed 3D + k-NN |
| Bloom | Three.js postprocessing |
| Cache | IndexedDB |
| Deploy | Vercel (single static file) |

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge | Full (File System Access API) |
| Firefox | webkitdirectory fallback |
| Safari | webkitdirectory fallback |

## License

MIT

---

**Built by [Azamat Safarov](https://github.com/AzamatSafarov)**

Also see:
- [github-repo-beautifier](https://github.com/AzamatSafarov/github-repo-beautifier.git) - premium GitHub README templates
