import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ImageIcon,
  Target,
  BarChart2,
  Layers,
  UploadCloud,
  MessageSquare,
  Cpu,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import GlobalHeader from '@/components/layout/GlobalHeader'

export default function Home() {
  const capabilities = [
    {
      title: 'Single Image VQA',
      description: 'Ask questions about optical or SAR images',
      icon: ImageIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100 hover:border-purple-300',
      query: 'Describe the land-cover and major objects visible in this image.',
      task: 'vqa',
    },
    {
      title: 'Visual Grounding',
      description: 'Find and highlight objects in the image',
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100 hover:border-emerald-300',
      query: 'Where is the water body?',
      task: 'grounding',
    },
    {
      title: 'Change Analysis',
      description: 'Compare two dates and detect changes',
      icon: BarChart2,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100 hover:border-rose-300',
      query: 'What changed between these two dates?',
      task: 'change_detection',
    },
    {
      title: 'Optical + SAR Analysis',
      description: 'Use optical and SAR images together',
      icon: Layers,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100 hover:border-amber-300',
      query: 'Use optical and SAR together to assess structural density.',
      task: 'optical_sar',
    },
  ]

  const featureStrip = [
    { icon: UploadCloud, label: 'Easy Upload' },
    { icon: MessageSquare, label: 'Natural Language Query' },
    { icon: Cpu, label: 'AI Analysis' },
    { icon: Eye, label: 'Visual Results' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <GlobalHeader showGetStarted={true} />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle satellite image backdrop with light gradient mask */}
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-slate-100 pointer-events-none" />

        <div className="container mx-auto px-6 pt-12 pb-10 z-10 flex flex-col items-center text-center max-w-5xl">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              Smart India Hackathon • Remote-Sensing VLM Platform
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Ask Questions to <br className="hidden sm:inline" />
              <span className="text-blue-600">Satellite Images</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed pt-1">
              An interactive vision-language assistant for multimodal remote sensing image
              analysis through natural language queries.
            </p>
          </motion.div>

          {/* 4 Capability Cards matching Reference Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full mt-10"
          >
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <Link
                  key={cap.title}
                  to={`/analyze?task=${cap.task}`}
                  className={`bg-white rounded-2xl p-6 border ${cap.borderColor} shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group hover:-translate-y-1 cursor-pointer`}
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl ${cap.bgColor} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${cap.color}`} />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mb-1.5">
                      {cap.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Try Query</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              )
            })}
          </motion.div>

          {/* Big Blue CTA Button matching Reference */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-full shadow-lg shadow-blue-500/25 transition-all text-base hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              to="/results/analysis-vqa-001"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-full shadow-sm transition-all text-base"
            >
              <span>Explore Demo</span>
            </Link>
          </motion.div>

          {/* Model tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Supported AI Foundations:</span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-slate-700">
              GeoChat (VLM)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-slate-700">
              Grounding DINO
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-slate-700">
              ChangeFormer
            </span>
          </div>
        </div>

        {/* Bottom Feature Strip matching Reference */}
        <div className="w-full bg-white border-t border-slate-200 py-6 z-10">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {featureStrip.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-3 text-slate-700"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SatQuery AI — Built for Smart India Hackathon (SIH 2026)</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Earth Observation System Active
            </span>
            <Link to="/about" className="hover:text-blue-600 font-medium">
              About & Architecture
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
