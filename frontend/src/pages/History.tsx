import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, FolderSearch, ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  formatRelativeTime,
  getTaskInfo,
  getStatusInfo,
  cn,
} from '@/lib/utils'
import { useHistory } from '@/hooks/useHistory'
import type { HistoryFilters } from '@/types'

export default function History() {
  const [filters, setFilters] = useState<HistoryFilters>({
    page: 1,
    pageSize: 10,
    search: undefined,
    task: 'all',
    status: 'all',
  })

  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useHistory(filters)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, search: searchInput || undefined, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const totalPages = data?.total ? Math.ceil(data.total / filters.pageSize) : 1

  return (
    <div className="flex-1 bg-slate-50 py-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Analysis History
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Browse previous remote-sensing queries, localized features, and change detection audits.
            </p>
          </div>

          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <span>New Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by query or ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>Task:</span>
              <select
                value={filters.task}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    task: e.target.value as HistoryFilters['task'],
                    page: 1,
                  }))
                }
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-600 font-medium"
              >
                <option value="all">All Tasks</option>
                <option value="vqa">Single-image VQA</option>
                <option value="grounding">Visual Grounding</option>
                <option value="change_detection">Change Analysis</option>
                <option value="optical_sar">Optical + SAR</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Status:</span>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value as HistoryFilters['status'],
                    page: 1,
                  }))
                }
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-600 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading history...
            </div>
          ) : !data?.items || data.items.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <FolderSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">No analyses found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search criteria or submit a new query.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Image</th>
                    <th className="px-5 py-3.5">Query</th>
                    <th className="px-5 py-3.5">Task</th>
                    <th className="px-5 py-3.5">Models</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Confidence</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items.map((item) => {
                    const taskInfo = getTaskInfo(item.task)
                    const statusInfo = getStatusInfo(item.status)

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Thumbnail */}
                        <td className="px-5 py-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                            <img
                              src={item.thumbnailUrl}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        {/* Query */}
                        <td className="px-5 py-3 max-w-xs">
                          <p className="font-semibold text-slate-900 truncate">
                            {item.query}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">
                            #{item.id.substring(0, 12)}
                          </span>
                        </td>

                        {/* Task */}
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded-full font-medium text-[11px] border',
                              taskInfo.bgColor,
                              taskInfo.color
                            )}
                          >
                            {taskInfo.label}
                          </span>
                        </td>

                        {/* Models */}
                        <td className="px-5 py-3 font-mono text-[11px] text-slate-600">
                          {item.modelNames.join(', ')}
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                          {formatRelativeTime(item.createdAt)}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full font-semibold text-[10px] border uppercase',
                              statusInfo.bgColor,
                              statusInfo.color
                            )}
                          >
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* Confidence */}
                        <td className="px-5 py-3 font-mono font-semibold text-blue-600">
                          {item.confidence ? `${(item.confidence / 100).toFixed(2)}` : '—'}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-3 text-right">
                          <Link
                            to={`/results/${item.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
                          >
                            <span>View</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page {filters.page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={filters.page >= totalPages}
                  onClick={() => handlePageChange(filters.page + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
