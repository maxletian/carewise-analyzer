
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
  lastActive?: string;
  activityLog?: {
    timestamp: string;
    action: string;
  }[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isAdmin: () => boolean;
  logActivity: (action: string) => void;
  getAllUsers: () => StoredUser[];
  getMaxAdminCount: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Maximum number of admins allowed
const MAX_ADMIN_COUNT = 2;

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
        role: parsedUser.role || 'user'
      });
      
      // Log user activity on initial load
      if (parsedUser.id) {
        logActivity('app_accessed');
      }
    }
    setLoading(false);
  }, []);

  const getAllUsers = () => {
    const storedUsers = localStorage.getItem('carewise_users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  };

  const getMaxAdminCount = () => MAX_ADMIN_COUNT;

  const logActivity = (action: string) => {
    if (!user) return;

    // Get stored users
    const storedUsers = localStorage.getItem('carewise_users');
    const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Find current user and update activity
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        const newActivity = {
          timestamp: new Date().toISOString(),
          action
        };
        
        return {
          ...u,
          lastActive: new Date().toISOString(),
          activityLog: u.activityLog ? [...u.activityLog, newActivity] : [newActivity]
        };
      }
      return u;
    });
    
    // Update localStorage
    localStorage.setItem('carewise_users', JSON.stringify(updatedUsers));
    
    // Also update current user if it's stored
    const currentUser = localStorage.getItem('carewise_user');
    if (currentUser) {
      const parsedUser: StoredUser = JSON.parse(currentUser);
      if (parsedUser.id === user.id) {
        const newActivity = {
          timestamp: new Date().toISOString(),
          action
        };
        
        const updatedUser = {
          ...parsedUser,
          lastActive: new Date().toISOString(),
          activityLog: parsedUser.activityLog ? [...parsedUser.activityLog, newActivity] : [newActivity]
        };
        
        localStorage.setItem('carewise_user', JSON.stringify(updatedUser));
      }
    }
  };

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
      
      // Log the activity
      logActivity('logged_in');
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
      
      // Special case: if email is admin and password is pass123
      const isForceAdmin = email === 'admin' && password === 'pass123';
      
      // Check if we already have MAX_ADMIN_COUNT admins for non-special emails
      const currentAdminCount = users.filter(u => u.role === 'admin').length;
      
      // Create admin account if:
      // 1. It's the first user
      // 2. It's our special admin case
      // 3. We're below MAX_ADMIN_COUNT
      const isAdmin = users.length === 0 || isForceAdmin || currentAdminCount < MAX_ADMIN_COUNT;
      
      // If we're at max admins and this isn't a special case, make it a regular user
      const role = (currentAdminCount >= MAX_ADMIN_COUNT && !isForceAdmin && users.length > 0) ? 'user' : (isAdmin ? 'admin' : 'user');
      
      // Create new user with activity tracking
      const newUser: StoredUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        name,
        passwordHash: hashPassword(password),
        role,
        lastActive: new Date().toISOString(),
        activityLog: [{
          timestamp: new Date().toISOString(),
          action: 'account_created'
        }]
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
        description: role === 'admin'
          ? "Welcome to CareWise! You have been granted admin privileges."
          : "Welcome to CareWise!"
      });
      
      navigate('/dashboard');
      
      // Log the activity
      logActivity('account_created');
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
    // Log the activity before logging out
    if (user) {
      logActivity('logged_out');
    }
    
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
      
      // Log the activity
      logActivity('profile_updated');
      
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
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      isAdmin,
      logActivity, 
      getAllUsers,
      getMaxAdminCount
    }}>
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
