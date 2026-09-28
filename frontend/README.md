# SatQuery AI — Frontend

> **An Interactive Vision-Language Assistant for Remote Sensing Image Analysis through Text Queries**

Built for **Smart India Hackathon (SIH)**

---

## Overview

SatQuery AI allows users to upload satellite/remote-sensing images and ask natural-language questions. The system automatically determines the required analysis task, selects the appropriate AI model, executes the workflow, and returns visual + textual results with confidence scores, execution traces, and downloadable reports.

This repository contains the **complete React frontend** — designed as a premium AI analysis workstation with a dark satellite-intelligence aesthetic.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Server State | TanStack Query |
| Client State | Zustand |
| Maps | React-Leaflet / Leaflet |
| Charts | Recharts |
| Animation | Framer Motion |
| Notifications | Sonner |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (mock mode enabled by default)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will start at **http://localhost:5173**

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Backend API base URL |
| `VITE_USE_MOCK_API` | `true` | Enable mock mode (no backend needed) |
| `VITE_MAP_TILE_URL` | OpenStreetMap | Map tile provider URL |
| `VITE_MAX_FILE_SIZE_MB` | `50` | Maximum upload file size |
| `VITE_SUPPORTED_FORMATS` | `png,jpg,jpeg,tiff,tif,geotiff` | Allowed image formats |

## Mock Mode

When `VITE_USE_MOCK_API=true`, the frontend is **fully demonstrable without a backend**:

- Image uploads simulate progress and success
- Analysis runs through animated 7-stage workflow
- Three demo workflows return realistic results:
  - **VQA**: GeoChat answers natural-language questions
  - **Grounding**: Grounding DINO returns bounding boxes
  - **Change Detection**: ChangeFormer + GeoChat return change maps and explanations
- History and dashboard show mock data

To switch to real backend, set `VITE_USE_MOCK_API=false` and point `VITE_API_BASE_URL` to your FastAPI server.

## Application Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero + capabilities + models |
| `/dashboard` | Dashboard | Stats, quick actions, recent analyses |
| `/analyze` | Analysis Workspace | Upload, query, workflow, visualization |
| `/results/:id` | Results | Complete analysis report |
| `/history` | History | Browse previous analyses |
| `/about` | About | Architecture, models, technology |

## Project Structure

```
src/
├── api/                    # API layer (client, services, mock)
│   ├── client.ts           # Axios instance
│   ├── analysis.ts         # Analysis endpoints
│   ├── upload.ts           # Upload endpoints
│   ├── history.ts          # History endpoints
│   └── mock/               # Mock API service + data
├── components/
│   ├── layout/             # MainLayout, Sidebar, TopBar
│   ├── query/              # QueryInput, query chips
│   ├── results/            # AnswerCard, ConfidenceGauge, ModelCard, Timeline
│   ├── ui/                 # shadcn/ui components (Button, etc.)
│   ├── upload/             # ImageUploader, ImagePreview
│   ├── visualization/      # ImageViewer, BoundingBoxOverlay, ChangeComparison
│   └── workflow/           # WorkflowTracker, WorkflowStage
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities (cn, formatters)
├── pages/                  # Route pages
├── store/                  # Zustand stores
├── types/                  # TypeScript interfaces
└── utils/                  # Validation, error handling
```

## Backend Integration

The frontend expects a **FastAPI backend** with these endpoints:

```
POST /api/analyze           # Submit analysis
GET  /api/analysis/{id}     # Get analysis result
GET  /api/analysis/{id}/status  # Poll analysis status
GET  /api/analysis/history  # Paginated history
POST /api/upload            # Upload image
GET  /api/reports/{id}      # Download report
GET  /api/dashboard/stats   # Dashboard statistics
```

All API communication is isolated in `src/api/`. The mock service in `src/api/mock/` mirrors the exact same interfaces — switching from mock to real requires only changing the env variable.

## Key Features

- **Three-panel analysis workspace**: Upload panel, image viewer, workflow tracker
- **7-stage AI workflow visualization**: Input Validation → Query Understanding → Task ID → Model Selection → Execution → Result Fusion → Response
- **Interactive image viewer**: Zoom, pan, fit-to-screen, bounding box overlays
- **Change detection comparison**: Side-by-side, overlay, slider, and change map modes
- **Confidence gauge**: SVG arc visualization with color coding
- **Execution trace timeline**: Auditable workflow with timestamps and durations
- **Responsive design**: Desktop-first with tablet and mobile support

## Demo Flow (SIH)

1. Open **http://localhost:5173** → Landing page
2. Click **"Start Analysis"** → Analysis workspace
3. Switch to **"Two Images (Change)"** mode
4. Upload two satellite images
5. Type: **"What changed between these two dates?"**
6. Click **Analyze** → Watch 7-stage workflow animate
7. Click **"View Full Results"** → See change map, answer, confidence, execution trace
8. Visit **History** → See all past analyses

## Deployment

```bash
# Build
npm run build

# Output in dist/ — serve with any static file server
npx serve dist

# Or with Docker
# (Add your own Dockerfile)
```

## License

Built for Smart India Hackathon. Internal use.
