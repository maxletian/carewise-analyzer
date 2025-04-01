
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { UserCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setName(user.name || '');
    setEmail(user.email || '');
  }, [user, navigate]);

  if (!user) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      updateProfile({ name, email });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update your profile information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-carewise-blue hover:bg-carewise-blue/90 w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-muted p-6 rounded-full mb-4">
              <UserCircle className="h-16 w-16 text-carewise-blue" />
            </div>
            <h3 className="text-lg font-medium">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/settings')}
            >
              Settings
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
            >
              Change Password
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
