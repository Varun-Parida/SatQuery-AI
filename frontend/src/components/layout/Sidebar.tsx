import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Sparkles, 
  Clock, 
  FileText, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  Satellite
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';

const navItems = [
  { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { name: 'New Analysis', to: '/analyze', icon: Sparkles },
  { name: 'History', to: '/history', icon: Clock },
  { name: 'Reports', to: '/history', icon: FileText },
  { name: 'About', to: '/about', icon: Info },
];

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-slate-900/50 border-r border-slate-700/30 overflow-hidden flex-shrink-0"
    >
      <div className="h-14 flex items-center px-4 border-b border-slate-700/30 flex-shrink-0">
        <Satellite className="w-6 h-6 text-cyan-500 flex-shrink-0" />
        <motion.span
          animate={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto' }}
          className="ml-3 font-semibold text-slate-100 whitespace-nowrap overflow-hidden tracking-wider"
        >
          SATQUERY AI
        </motion.span>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2.5 transition-colors relative group",
                  isActive 
                    ? "text-cyan-500 bg-cyan-500/10" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )
              }
              title={sidebarCollapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"
                    />
                  )}
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-cyan-500" : "text-slate-400 group-hover:text-slate-200")} />
                  <motion.span
                    animate={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto' }}
                    className="ml-3 whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-700/30">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full h-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center w-full">
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-2 text-sm">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
