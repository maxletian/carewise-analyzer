
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface StoredUser extends User {
  passwordHash: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash function for demo purposes (NOT for production use)
const hashPassword = (password: string): string => {
  let hash = 0;
  if (password.length === 0) return hash.toString();
  
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString();
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('carewise_user');
    if (storedUser) {
      const parsedUser: StoredUser = JSON.parse(storedUser);
      // Only set the public user info (omit passwordHash)
      setUser({
        id: parsedUser.id,
        email: parsedUser.email,
        name: parsedUser.name,
        role: parsedUser.role || 'user' // Default to 'user' for existing users
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Get stored users
      const storedUsers = localStorage.getItem('carewise_users');
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Find user by email
      const userFound = users.find(u => u.email === email);
      
      if (!userFound) {
        throw new Error('User not found. Please check your email or sign up.');
      }
      
      // Check password
      if (userFound.passwordHash !== hashPassword(password)) {
        throw new Error('Incorrect password. Please try again.');
      }
      
      // Create a public user object (without the password hash)
      const publicUser = {
        id: userFound.id,
        email: userFound.email,
        name: userFound.name,
        role: userFound.role || 'user'
      };
      
      // Store the current logged in user
      localStorage.setItem('carewise_user', JSON.stringify(userFound));
      setUser(publicUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${publicUser.name}!`
      });
      
      navigate('/dashboard');
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
      // Get stored users or initialize an empty array
      const storedUsers = localStorage.getItem('carewise_users');
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        throw new Error('An account with this email already exists');
      }
      
      // Create admin account if it's the first user or use special admin email
      const isAdmin = users.length === 0 || email === 'admin@carewise.com';
      
      // Create new user
      const newUser: StoredUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        name,
        passwordHash: hashPassword(password),
        role: isAdmin ? 'admin' : 'user'
      };
      
      // Add to users array
      users.push(newUser);
      localStorage.setItem('carewise_users', JSON.stringify(users));
      
      // Create a public user object (without the password hash)
      const publicUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      };
      
      // Set as current user
      localStorage.setItem('carewise_user', JSON.stringify(newUser));
      setUser(publicUser);
      
      toast({
        title: "Account created",
        description: isAdmin 
          ? "Welcome to CareWise! You have been granted admin privileges."
          : "Welcome to CareWise!"
      });
      
      navigate('/dashboard');
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
      // Get the current full user data (including password hash)
      const storedUserJson = localStorage.getItem('carewise_user');
      if (!storedUserJson) return;
      
      const storedUser: StoredUser = JSON.parse(storedUserJson);
      const updatedUser = { ...storedUser, ...userData };
      
      // Update in localStorage
      localStorage.setItem('carewise_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const storedUsersJson = localStorage.getItem('carewise_users');
      if (storedUsersJson) {
        const users: StoredUser[] = JSON.parse(storedUsersJson);
        const updatedUsers = users.map(u => 
          u.id === user.id ? updatedUser : u
        );
        localStorage.setItem('carewise_users', JSON.stringify(updatedUsers));
      }
      
      // Update state (public user info only)
      const updatedPublicUser = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      };
      setUser(updatedPublicUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated"
      });
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, isAdmin }}>
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
