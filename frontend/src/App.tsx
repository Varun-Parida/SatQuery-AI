import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '@/components/layout/MainLayout'

// Lazy-loaded pages
const Home = lazy(() => import('@/pages/Home'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Analyze = lazy(() => import('@/pages/Analyze'))
const Results = lazy(() => import('@/pages/Results'))
const ResultsTrace = lazy(() => import('@/pages/ResultsTrace'))
const History = lazy(() => import('@/pages/History'))
const About = lazy(() => import('@/pages/About'))

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-sm font-medium text-slate-500">Loading SatQuery AI…</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Home />} />

        {/* App pages with layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/results/:id/trace" element={<ResultsTrace />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
