
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // If on auth pages, use a simpler layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className={`flex-1 p-3 md:p-6 ${user && !isMobile ? 'md:ml-16 lg:ml-64' : ''}`}>
          <div className={`${user ? 'pb-16 md:pb-0' : ''}`}>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
