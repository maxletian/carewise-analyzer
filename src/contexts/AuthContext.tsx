
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('carewise_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would make an API request
      // Simulating authentication for demo
      if (email && password) {
        const userData = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0]
        };
        
        localStorage.setItem('carewise_user', JSON.stringify(userData));
        setUser(userData);
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}!`
        });
        navigate('/dashboard');
        return;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // In a real app, this would make an API request
      // Simulating signup for demo
      if (name && email && password) {
        const userData = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          email,
          name
        };
        
        localStorage.setItem('carewise_user', JSON.stringify(userData));
        setUser(userData);
        toast({
          title: "Account created",
          description: "Welcome to CareWise!"
        });
        navigate('/dashboard');
        return;
      }
      throw new Error('Please fill all required fields');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: (error as Error).message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('carewise_user');
    localStorage.removeItem('health_data');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out"
    });
    navigate('/login');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('carewise_user', JSON.stringify(updatedUser));
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
