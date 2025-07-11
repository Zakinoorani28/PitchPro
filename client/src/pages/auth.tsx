import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Phone, Mail, User, Lock, MapPin, Smartphone } from 'lucide-react';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await apiRequest('POST', '/api/auth/register', data);
      const result = await response.json();

      if (result.success) {
        localStorage.setItem('authToken', result.token);
        toast({
          title: "Registration Successful",
          description: `Welcome to ProtoLab, ${result.user.name}!`
        });
        window.location.href = '/';
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please check your details and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await apiRequest('POST', '/api/auth/login', data);
      const result = await response.json();

      if (result.success) {
        localStorage.setItem('authToken', result.token);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user.name}!`
        });
        window.location.href = '/';
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">ProtoLab</h1>
          <p className="text-slate-600">AI-Powered Business Solutions for Africa</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Get Started</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Sign In</TabsTrigger>
              </TabsList>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+254712345678"
                        required
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Supports: Kenya (+254), Nigeria (+234), South Africa (+27), Ghana (+233)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="login-phone"
                        name="phone"
                        type="tel"
                        placeholder="+254712345678"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-sm text-slate-900 mb-2">Payment Options Available:</h4>
              <div className="flex items-center space-x-4 text-xs text-slate-600">
                <div className="flex items-center space-x-1">
                  <Smartphone className="w-4 h-4" />
                  <span>M-Pesa</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Flutterwave</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>💳</span>
                  <span>Cards</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}