
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Laptop, Bell, Shield, LogOut } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const saveNotificationSettings = () => {
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved"
    });
  };

  const savePrivacySettings = () => {
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Appearance</CardTitle>
            <CardDescription>Customize how CareWise looks on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div 
                className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition ${theme === 'light' ? 'border-carewise-blue bg-carewise-blue/10' : 'border-border'}`}
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                }}
              >
                <Sun className="h-6 w-6 mb-2" />
                <span>Light</span>
              </div>

              <div 
                className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition ${theme === 'dark' ? 'border-carewise-blue bg-carewise-blue/10' : 'border-border'}`}
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                }}
              >
                <Moon className="h-6 w-6 mb-2" />
                <span>Dark</span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border border-border rounded-md cursor-not-allowed opacity-50">
                <Laptop className="h-6 w-6 mb-2" />
                <span>System</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications about your health updates</p>
              </div>
              <Switch 
                id="notifications" 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled} 
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive emails about your health reports</p>
              </div>
              <Switch 
                id="emailNotifications" 
                disabled={!notificationsEnabled}
                checked={notificationsEnabled && emailNotifications} 
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Button 
              onClick={saveNotificationSettings}
              className="bg-carewise-blue hover:bg-carewise-blue/90 w-full"
            >
              Save Notification Preferences
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Privacy & Data</CardTitle>
            <CardDescription>Manage how your data is used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dataSharing">Anonymous Data Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anonymous data usage for improving health predictions
                </p>
              </div>
              <Switch 
                id="dataSharing" 
                checked={dataSharing} 
                onCheckedChange={setDataSharing} 
              />
            </div>

            <Button 
              onClick={savePrivacySettings}
              className="bg-carewise-blue hover:bg-carewise-blue/90 w-full"
            >
              Save Privacy Preferences
            </Button>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Shield className="h-5 w-5 mr-2" /> Data & Security
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your account data and security settings
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                  Update Profile Information
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download Your Data
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center text-destructive">
                <LogOut className="h-5 w-5 mr-2" /> Account Actions
              </h3>
              <div className="space-y-2">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={logout}
                >
                  Logout
                </Button>
                <Button variant="outline" className="w-full text-destructive">
                  Delete My Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
