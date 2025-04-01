
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-carewise-blue">Care<span className="text-carewise-green">Wise</span></span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition">
                  Dashboard
                </Link>
                <Link to="/health-form" className="text-foreground/80 hover:text-foreground transition">
                  Health Assessment
                </Link>
                <Link to="/analysis" className="text-foreground/80 hover:text-foreground transition">
                  Health Analysis
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-foreground/80 hover:text-foreground transition flex items-center">
                    <Shield size={16} className="mr-1" /> Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/" className="text-foreground/80 hover:text-foreground transition">
                  Home
                </Link>
                <Link to="/about" className="text-foreground/80 hover:text-foreground transition">
                  About
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="text-foreground/80 hover:text-foreground"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={`rounded-full ${isAdmin() ? 'bg-carewise-green' : 'bg-carewise-blue'} text-white`}>
                    {isAdmin() ? <Shield size={18} /> : <User size={18} />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin() && (
                    <DropdownMenuItem>
                      <Link to="/admin" className="w-full flex items-center">
                        <Shield size={16} className="mr-2" /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-carewise-blue hover:bg-carewise-blue/90">Login</Button>
              </Link>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-3 space-y-2">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-foreground/80 hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/health-form" 
                  className="block py-2 text-foreground/80 hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Health Assessment
                </Link>
                <Link 
                  to="/analysis" 
                  className="block py-2 text-foreground/80 hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Health Analysis
                </Link>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className="block py-2 text-foreground/80 hover:text-foreground flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield size={16} className="mr-1" /> Admin Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="block py-2 text-foreground/80 hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="block py-2 text-foreground/80 hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
