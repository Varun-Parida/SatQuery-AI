import { useLocation } from 'react-router-dom'
import { isMockMode } from '@/lib/utils';
import { Menu } from 'lucide-react';

const TopBar = () => {
  const location = useLocation();
  const isMock = isMockMode();

  // Create a simple breadcrumb from the pathname
  const path = location.pathname.split('/').filter(Boolean)[0] || 'dashboard';
  const displayBreadcrumb = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <div className="h-14 flex items-center justify-between px-4 md:px-6 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/30 flex-shrink-0">
      <div className="flex items-center">
        <div className="md:hidden mr-4">
          <Menu className="w-6 h-6 text-slate-400" />
        </div>
        <div className="text-slate-300 font-medium">
          {displayBreadcrumb}
        </div>
      </div>
      
      <div className="flex-1" />

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2">
          {isMock ? (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded">
              Mock Mode
            </span>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-sm text-slate-300 hidden md:inline-block">System Online</span>
            </>
          )}
        </div>
        
        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-sm font-semibold text-white shadow-sm border border-cyan-500/30 cursor-pointer hover:bg-cyan-500 transition-colors">
          SA
        </div>
      </div>
    </div>
  );
};

export default TopBar;
