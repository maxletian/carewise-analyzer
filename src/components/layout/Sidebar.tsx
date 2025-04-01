
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Gauge, 
  User, 
  ClipboardCheck, 
  Activity, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', to: '/dashboard', icon: <Gauge size={20} /> },
    { name: 'Health Form', to: '/health-form', icon: <ClipboardCheck size={20} /> },
    { name: 'Analysis', to: '/analysis', icon: <Activity size={20} /> },
    { name: 'Profile', to: '/profile', icon: <User size={20} /> },
    { name: 'Settings', to: '/settings', icon: <Settings size={20} /> },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
        <div className="flex justify-around items-center h-16">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 ${
                  isActive
                    ? 'text-carewise-blue'
                    : 'text-foreground/70 hover:text-foreground'
                }`
              }
            >
              <span>{link.icon}</span>
              <span className="text-xs mt-1">{link.name.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 ease-in-out overflow-y-auto ${
        collapsed ? 'w-16' : 'w-64'
      } hidden md:block`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex-1 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center p-3 mb-1 rounded-md ${
                  isActive
                    ? 'bg-carewise-blue text-white'
                    : 'text-foreground hover:bg-muted transition-colors'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <span className="mr-3">{link.icon}</span>
              {!collapsed && <span>{link.name}</span>}
            </NavLink>
          ))}
        </div>
        <div className="pt-4 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full p-2 rounded-md hover:bg-muted transition-colors"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <div className="flex items-center w-full">
                <ChevronLeft size={20} />
                <span className="ml-3">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
