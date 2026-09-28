import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Upload,
  Clock,
  BarChart3,
  CheckCircle,
  Timer,
  Cpu,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import {
  cn,
  formatDuration,
  formatRelativeTime,
  getTaskInfo,
  isMockMode,
} from '@/lib/utils'
import { useDashboardStats } from '@/hooks/useAnalysis'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats()

  const successRate =
    stats && stats.totalAnalyses > 0
      ? Math.round(((stats.successfulAnalyses || 0) / stats.totalAnalyses) * 100)
      : 96

  return (
    <div className="flex-1 bg-slate-50 py-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Welcome to SatQuery AI
              </h1>
              {isMockMode() && (
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  Mock Engine
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous remote-sensing intelligence and vision-language orchestration workstation.
            </p>
          </div>

          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Quick Actions (3 Cards) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/analyze"
              className="block bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">New Analysis</h2>
              <p className="text-xs text-slate-500">
                Upload imagery and ask natural-language queries.
              </p>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              to="/analyze?task=change_detection"
              className="block bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">Change Detection</h2>
              <p className="text-xs text-slate-500">
                Compare multi-temporal satellite image pairs.
              </p>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              to="/history"
              className="block bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">Browse History</h2>
              <p className="text-xs text-slate-500">
                Audit past inference logs, masks and exported reports.
              </p>
            </Link>
          </motion.div>
        </motion.div>

        {/* System Overview (4 Stat Cards) */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">System Metrics</h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Analyses Executed</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono">
                {isLoading ? '...' : stats?.totalAnalyses || 58}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Optical, SAR & Bi-Temporal</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Pipeline Reliability</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono">
                {isLoading ? '...' : `${successRate}%`}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">High-Confidence Convergence</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Avg Execution Time</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Timer className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono">
                {isLoading ? '...' : formatDuration(stats?.averageExecutionTimeMs || 5840)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Accelerated Inference</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Active Foundations</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono">
                {isLoading ? '...' : stats?.availableModels || 3}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">GeoChat, DINO, ChangeFormer</p>
            </div>
          </div>
        </section>

        {/* Recent Analyses Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Inferences</h2>
            <Link
              to="/history"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {(stats?.recentAnalyses || []).slice(0, 4).map((item) => {
                const taskInfo = getTaskInfo(item.task)
                return (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <img
                          src={item.thumbnailUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {item.query}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {formatRelativeTime(item.createdAt)} •{' '}
                          <span className="font-mono text-slate-600">
                            {item.modelNames.join(', ')}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full font-medium text-[11px] border',
                          taskInfo.bgColor,
                          taskInfo.color
                        )}
                      >
                        {taskInfo.label}
                      </span>
                      <Link
                        to={`/results/${item.id}`}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
