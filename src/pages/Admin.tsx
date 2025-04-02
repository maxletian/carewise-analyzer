
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Shield, 
  User, 
  AlertTriangle, 
  Clock,
  Activity,
  AlertCircle,
  Users
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  lastActive?: string;
  activityLog?: {
    timestamp: string;
    action: string;
  }[];
  isOnline?: boolean;
}

interface ActivityLogItem {
  userId: string;
  userName: string;
  timestamp: string;
  action: string;
}

const Admin = () => {
  const { user, isAdmin, getAllUsers, getMaxAdminCount, getActiveUserCount, getMaxActiveUsers } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [activeAdminCount, setActiveAdminCount] = useState(0);
  const [maxAdminCount, setMaxAdminCount] = useState(2);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [maxActiveUsers, setMaxActiveUsers] = useState(20);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get friendly name for activity
  const getActivityName = (action: string): string => {
    switch (action) {
      case 'logged_in': return 'Logged in';
      case 'logged_out': return 'Logged out';
      case 'account_created': return 'Created account';
      case 'profile_updated': return 'Updated profile';
      case 'form_submitted': return 'Submitted health form';
      case 'viewed_analysis': return 'Viewed health analysis';
      case 'app_accessed': return 'Accessed the app';
      case 'still_active': return 'Active in app';
      default: return action.replace(/_/g, ' ');
    }
  };

  // Check if user is admin, otherwise redirect
  useEffect(() => {
    if (!isAdmin()) {
      toast({
        title: "Access denied",
        description: "You don't have permission to view this page",
        variant: "destructive"
      });
      navigate('/dashboard');
    } else {
      loadUsers();
      setMaxAdminCount(getMaxAdminCount());
      setMaxActiveUsers(getMaxActiveUsers());
      
      // Set up interval to refresh user data every 30 seconds
      const interval = setInterval(() => {
        loadUsers();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAdmin, navigate]);

  const loadUsers = () => {
    // Get all users from local storage
    const storedUsers = getAllUsers();
    
    // Calculate the number of admins
    const adminCount = storedUsers.filter((u: UserData) => u.role === 'admin').length;
    setActiveAdminCount(adminCount);
    
    // Calculate active users
    const onlineUsers = storedUsers.filter((u: UserData) => u.isOnline);
    setActiveUserCount(onlineUsers.length);
    
    setUsers(storedUsers);
    setTotalUsers(storedUsers.length);
    
    // Create activity logs from all users
    const allLogs: ActivityLogItem[] = [];
    storedUsers.forEach((u: UserData) => {
      if (u.activityLog && u.activityLog.length) {
        u.activityLog.forEach(log => {
          allLogs.push({
            userId: u.id,
            userName: u.name,
            timestamp: log.timestamp,
            action: log.action
          });
        });
      }
    });
    
    // Sort by timestamp, most recent first
    allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setActivityLogs(allLogs);
  };

  const handleRoleToggle = (userId: string, currentRole: 'user' | 'admin') => {
    // Don't allow changing your own role
    if (userId === user?.id) {
      toast({
        title: "Action not allowed",
        description: "You cannot change your own role",
        variant: "destructive"
      });
      return;
    }

    // If we're trying to promote to admin but we're already at the limit
    if (currentRole === 'user' && activeAdminCount >= maxAdminCount) {
      toast({
        title: "Admin limit reached",
        description: `You can only have a maximum of ${maxAdminCount} admins`,
        variant: "destructive"
      });
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    // Update user in localStorage
    const storedUsers = localStorage.getItem('carewise_users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      const updatedUsers = parsedUsers.map((u: any) => {
        if (u.id === userId) {
          return { ...u, role: newRole };
        }
        return u;
      });
      
      localStorage.setItem('carewise_users', JSON.stringify(updatedUsers));
      
      // Refresh users list
      loadUsers();
      
      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}`,
      });
    }
  };

  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!selectedUser) return;
    
    // Don't allow deleting yourself
    if (selectedUser.id === user?.id) {
      toast({
        title: "Action not allowed",
        description: "You cannot delete your own account",
        variant: "destructive"
      });
      setDialogOpen(false);
      return;
    }
    
    // Remove user from localStorage
    const storedUsers = localStorage.getItem('carewise_users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      const filteredUsers = parsedUsers.filter((u: any) => u.id !== selectedUser.id);
      
      localStorage.setItem('carewise_users', JSON.stringify(filteredUsers));
      
      // Refresh users list
      loadUsers();
      
      toast({
        title: "User deleted",
        description: "User has been deleted successfully",
      });
      
      setDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="bg-carewise-blue text-white p-2 rounded-full">
          <Shield size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Users</CardTitle>
            <CardDescription>Number of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="mr-2" size={24} />
              <span className="text-2xl font-bold">{totalUsers}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Admin Users</CardTitle>
            <CardDescription>Limited to {maxAdminCount} users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="mr-2" size={24} />
              <span className="text-2xl font-bold">{activeAdminCount}/{maxAdminCount}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active Users</CardTitle>
            <CardDescription>Limited to {maxActiveUsers} concurrent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2" size={24} />
              <span className="text-2xl font-bold">{activeUserCount}/{maxActiveUsers}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="mr-2" size={24} />
              <span className="text-2xl font-bold">
                {activityLogs.filter(log => 
                  new Date(log.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
                ).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="online">Online Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions (maximum {maxAdminCount} admins allowed)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-carewise-green text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isOnline ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {user.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="cursor-help flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{formatDate(user.lastActive).split(',')[0]}</span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            Last active: {formatDate(user.lastActive)}
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRoleToggle(user.id, user.role)}
                            disabled={user.role === 'user' && activeAdminCount >= maxAdminCount}
                          >
                            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              {activeAdminCount >= maxAdminCount && (
                <div className="flex items-center text-amber-500">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Maximum admin limit reached ({maxAdminCount})
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
              <CardDescription>Track what users are doing in the application</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.slice(0, 50).map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>{getActivityName(log.action)}</TableCell>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                  {activityLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No activity recorded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {activityLogs.length > 50 && (
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Showing the most recent 50 activities out of {activityLogs.length} total
                </p>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="online">
          <Card>
            <CardHeader>
              <CardTitle>Online Users</CardTitle>
              <CardDescription>Currently active users ({activeUserCount} of {maxActiveUsers} max)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.filter(u => u.isOnline).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-carewise-green text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(user.lastActive)}</TableCell>
                    </TableRow>
                  ))}
                  {users.filter(u => u.isOnline).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No users currently online
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              {activeUserCount >= maxActiveUsers && (
                <div className="flex items-center text-amber-500">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Maximum concurrent user limit reached ({maxActiveUsers})
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm User Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user: {selectedUser?.name} ({selectedUser?.email})?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
