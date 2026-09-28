import {
  Satellite,
  Brain,
  GitBranch,
  Layers,
  MessageCircle,
  Server,
  CheckCircle2,
} from 'lucide-react'

export default function About() {
  const architectureSteps = [
    { label: 'User Query', icon: MessageCircle, desc: 'Natural language text' },
    { label: 'Query Agent', icon: Brain, desc: 'Intent classification' },
    { label: 'Task Router', icon: GitBranch, desc: 'Workflow selection' },
    { label: 'Model Serving', icon: Server, desc: 'GPU neural inference' },
    { label: 'Result Fusion', icon: Layers, desc: 'Spatial + semantic merge' },
    { label: 'Evidence Output', icon: Satellite, desc: 'Explainable dashboard' },
  ]

  const models = [
    {
      name: 'GeoChat',
      role: 'Remote-Sensing Vision-Language Model',
      description:
        'Fine-tuned on high-resolution Earth Observation imagery. Understands complex geographic context, multi-band spectral features, and generates natural-language reasoning.',
      strengths: ['Visual Question Answering', 'Land-Cover Captioning', 'Change Semantics Explanation'],
      tag: 'VLM Foundation',
    },
    {
      name: 'Grounding DINO',
      role: 'Open-Vocabulary Remote-Sensing Object Grounding',
      description:
        'Translates free-form text descriptions into geo-referenced bounding box proposals without requiring retraining on novel object categories.',
      strengths: ['Zero-Shot Localization', 'Water Bodies & Infrastructure', 'Sub-pixel Centroid Accuracy'],
      tag: 'Object Grounding',
    },
    {
      name: 'ChangeFormer',
      role: 'Transformer-Based Bi-Temporal Change Detection',
      description:
        'Employs Siamese Vision Transformers to capture long-range spatio-temporal dependencies between co-registered multi-date satellite scenes.',
      strengths: ['Urban Expansion Mapping', 'Deforestation Monitoring', 'Disaster Impact Assessment'],
      tag: 'Change Detection',
    },
  ]

  return (
    <div className="flex-1 bg-slate-50 py-10 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-14">
        {/* 1. Hero Section */}
        <section className="text-center space-y-4 pt-4">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-200 mb-4 shadow-sm">
            <Satellite className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950">
            About <span className="text-blue-600">SatQuery AI</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            An interactive vision-language assistant for remote sensing image analysis through natural-language queries.
            Built for Smart India Hackathon (SIH 2026).
          </p>
        </section>

        {/* 2. The Problem */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Why Remote Sensing Analysis is Challenging
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="font-semibold text-slate-900 mb-1">Steep Learning Curve</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Conventional GIS software (QGIS, ENVI) requires extensive training in multispectral indices, band arithmetic, and coordinate systems.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="font-semibold text-slate-900 mb-1">Time-Consuming Manual Tagging</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manually tracing water bodies, urban developments, or temporal changes across gigapixel rasters is labor-intensive and error-prone.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="font-semibold text-slate-900 mb-1">Disconnected Modalities</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Optical and SAR sensor streams require disparate preprocessing pipelines, making joint cross-sensor reasoning inaccessible.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="font-semibold text-slate-900 mb-1">Black-Box AI Decisions</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Many modern deep learning systems output numbers without explainable visual evidence, limiting adoption by governmental agencies.
              </p>
            </div>
          </div>
        </section>

        {/* 3. System Architecture (Flow diagram) */}
        <section id="how-it-works" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">System Architecture</h2>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end orchestration: From natural-language query to auditable remote-sensing output
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {architectureSteps.map((step, idx) => {
                const Icon = step.icon
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all relative group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-2 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">{step.label}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{step.desc}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 4. Specialized AI Models */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Specialized AI Foundations</h2>
            <p className="text-xs text-slate-500 mt-1">
              Task-specific models coordinated autonomously by our Query Understanding router
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-600 font-mono">{model.tag}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{model.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mb-3">{model.role}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{model.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Capabilities:
                  </span>
                  <ul className="mt-1 space-y-1">
                    {model.strengths.map((str, sIdx) => (
                      <li key={sIdx} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Technology Stack */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 text-center">
            Production Technology Stack
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-800 border border-slate-200">
              React 19 + TypeScript
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-800 border border-slate-200">
              Tailwind CSS v4
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-800 border border-slate-200">
              Vite 8
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-800 border border-slate-200">
              FastAPI (Python)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-800 border border-slate-200">
              PyTorch & HuggingFace
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-800 border border-slate-200">
              GDAL & Rasterio
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-800 border border-slate-200">
              Leaflet & GeoJSON
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-800 border border-slate-200">
              PostgreSQL + PostGIS
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
