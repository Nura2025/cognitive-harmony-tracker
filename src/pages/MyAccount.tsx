
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AuthService from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, Clock, Shield } from 'lucide-react';

const MyAccount = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setEmail(currentUser.email || '');
      setName(currentUser.name || '');
    }
  }, []);
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for profile update
    setTimeout(() => {
      const updatedUser = { ...user, name };
      localStorage.setItem('neurocog_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setLoading(false);
      toast.success("Profile updated successfully");
    }, 500);
  };
  
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password update functionality would be implemented here");
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{name || "User"}</h2>
                  <p className="text-muted-foreground">{email}</p>
                  <p className="text-sm text-muted-foreground capitalize mt-1">
                    {user?.role || "Patient"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-2 rounded-md hover:bg-accent">
                  <User size={18} className="mr-2 text-muted-foreground" />
                  <span>Profile</span>
                </div>
                <div className="flex items-center p-2 rounded-md hover:bg-accent">
                  <KeyRound size={18} className="mr-2 text-muted-foreground" />
                  <span>Security</span>
                </div>
                <div className="flex items-center p-2 rounded-md hover:bg-accent">
                  <Clock size={18} className="mr-2 text-muted-foreground" />
                  <span>Session History</span>
                </div>
                <div className="flex items-center p-2 rounded-md hover:bg-accent">
                  <Shield size={18} className="mr-2 text-muted-foreground" />
                  <span>Privacy</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => AuthService.logout()}
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <form onSubmit={handleProfileUpdate} className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Email address cannot be changed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        placeholder="Your specialty or role (optional)"
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Save Changes"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="security">
                  <form onSubmit={handlePasswordUpdate} className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button type="submit">Update Password</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
