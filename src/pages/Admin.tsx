
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Shield, User, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

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
    }
  }, [isAdmin, navigate]);

  const loadUsers = () => {
    // Get all users from local storage
    const storedUsers = localStorage.getItem('carewise_users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      const userData: UserData[] = parsedUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || 'user'
      }));
      
      setUsers(userData);
      setTotalUsers(userData.length);
    }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRoleToggle(user.id, user.role)}
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
      </Card>

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
