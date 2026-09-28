import { Outlet } from 'react-router-dom'
import GlobalHeader from './GlobalHeader'

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans">
      <GlobalHeader />
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
