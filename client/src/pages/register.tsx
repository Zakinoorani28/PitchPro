import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Building2, User, Shield, Crown } from "lucide-react";

const individualSchema = z.object({
  email: z.string().email("Valid email required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  plan: z.enum(["free", "hustler_plus", "founder"]).default("free"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const corporateSchema = z.object({
  // Admin user details
  email: z.string().email("Valid email required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  // Corporate details
  companyName: z.string().min(2, "Company name required"),
  domain: z.string().min(3, "Company domain required"),
  industry: z.string().min(1, "Industry is required"),
  companySize: z.enum(["startup", "small", "medium", "large", "enterprise"]),
  country: z.string().min(1, "Country is required"),
  jobTitle: z.string().min(1, "Job title required"),
  department: z.string().optional(),
  plan: z.enum(["corporate", "enterprise"]).default("corporate"),
  maxUsers: z.number().min(5).max(1000).default(10),
  billingEmail: z.string().email("Valid billing email required"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const adminSchema = z.object({
  email: z.string().email("Valid email required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(12, "Admin password must be at least 12 characters"),
  confirmPassword: z.string(),
  adminKey: z.string().min(1, "Admin access key required"),
  permissions: z.array(z.string()).default([]),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("individual");
  const [isLoading, setIsLoading] = useState(false);

  const individualForm = useForm({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      plan: "free" as const,
      country: "",
    }
  });

  const corporateForm = useForm({
    resolver: zodResolver(corporateSchema),
    defaultValues: {
      companySize: "startup" as const,
      plan: "corporate" as const,
      maxUsers: 10,
    }
  });

  const adminForm = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      permissions: [],
    }
  });

  const handleIndividualSubmit = async (data: z.infer<typeof individualSchema>) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register/individual", {
        ...data,
        role: "user",
        subscriptionTier: data.plan,
      });

      if (response.ok) {
        toast({
          title: "Account Created Successfully",
          description: "Welcome to ProtoLab! You can now start creating amazing pitch decks.",
        });
        setLocation("/dashboard");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorporateSubmit = async (data: z.infer<typeof corporateSchema>) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register/corporate", data);

      if (response.ok) {
        toast({
          title: "Corporate Account Created",
          description: "Your corporate account is ready. Team invitations will be sent shortly.",
        });
        setLocation("/dashboard");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Corporate registration failed");
      }
    } catch (error) {
      toast({
        title: "Corporate Registration Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSubmit = async (data: z.infer<typeof adminSchema>) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register/admin", data);

      if (response.ok) {
        toast({
          title: "Super Admin Account Created",
          description: "You now have full system access with analytics and user management.",
        });
        setLocation("/admin/dashboard");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Admin registration failed");
      }
    } catch (error) {
      toast({
        title: "Admin Registration Failed",
        description: error instanceof Error ? error.message : "Invalid admin key or credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const countries = [
    "Nigeria", "South Africa", "Kenya", "Ghana", "Egypt", "Morocco", "Uganda", "Tanzania",
    "Ethiopia", "Rwanda", "Botswana", "Zambia", "Zimbabwe", "Malawi", "Cameroon", "Senegal",
    "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Other"
  ];

  const industries = [
    "Technology", "Finance", "Healthcare", "Education", "Agriculture", "Manufacturing",
    "Energy", "Retail", "Consulting", "Media", "Real Estate", "Transportation", "Other"
  ];

  const adminPermissions = [
    "user_management", "analytics_access", "system_settings", "billing_management",
    "content_moderation", "feature_flags", "export_data", "audit_logs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join ProtoLab
          </CardTitle>
          <CardDescription>
            Create your account and start building professional pitch decks with AI
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="individual" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Individual
              </TabsTrigger>
              <TabsTrigger value="corporate" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Corporate
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Super Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="space-y-4">
              <form onSubmit={individualForm.handleSubmit(handleIndividualSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...individualForm.register("email")}
                      className={individualForm.formState.errors.email ? "border-red-500" : ""}
                    />
                    {individualForm.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">{individualForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...individualForm.register("username")}
                      className={individualForm.formState.errors.username ? "border-red-500" : ""}
                    />
                    {individualForm.formState.errors.username && (
                      <p className="text-sm text-red-500 mt-1">{individualForm.formState.errors.username.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...individualForm.register("password")}
                      className={individualForm.formState.errors.password ? "border-red-500" : ""}
                    />
                    {individualForm.formState.errors.password && (
                      <p className="text-sm text-red-500 mt-1">{individualForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...individualForm.register("confirmPassword")}
                      className={individualForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {individualForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">{individualForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+234 xxx xxx xxxx"
                      {...individualForm.register("phone")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select onValueChange={(value) => individualForm.setValue("country", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {individualForm.formState.errors.country && (
                      <p className="text-sm text-red-500 mt-1">{individualForm.formState.errors.country.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="plan">Subscription Plan</Label>
                  <Select onValueChange={(value) => individualForm.setValue("plan", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free - 3 pitch decks/month</SelectItem>
                      <SelectItem value="hustler_plus">Hustler+ - $4.99/month</SelectItem>
                      <SelectItem value="founder">Founder - $9.99/month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Individual Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="corporate" className="space-y-4">
              <form onSubmit={corporateForm.handleSubmit(handleCorporateSubmit)} className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Corporate Account Benefits</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Team collaboration and user management</li>
                    <li>• Custom branding and white-label options</li>
                    <li>• Advanced analytics and reporting</li>
                    <li>• Priority support and dedicated account manager</li>
                    <li>• Bulk credit packages and volume discounts</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Admin User Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="corp-email">Admin Email</Label>
                      <Input
                        id="corp-email"
                        type="email"
                        {...corporateForm.register("email")}
                        className={corporateForm.formState.errors.email ? "border-red-500" : ""}
                      />
                      {corporateForm.formState.errors.email && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="corp-username">Admin Username</Label>
                      <Input
                        id="corp-username"
                        {...corporateForm.register("username")}
                        className={corporateForm.formState.errors.username ? "border-red-500" : ""}
                      />
                      {corporateForm.formState.errors.username && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.username.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="corp-password">Password</Label>
                      <Input
                        id="corp-password"
                        type="password"
                        {...corporateForm.register("password")}
                        className={corporateForm.formState.errors.password ? "border-red-500" : ""}
                      />
                      {corporateForm.formState.errors.password && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="corp-confirmPassword">Confirm Password</Label>
                      <Input
                        id="corp-confirmPassword"
                        type="password"
                        {...corporateForm.register("confirmPassword")}
                        className={corporateForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                      />
                      {corporateForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Company Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        {...corporateForm.register("companyName")}
                        className={corporateForm.formState.errors.companyName ? "border-red-500" : ""}
                      />
                      {corporateForm.formState.errors.companyName && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.companyName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="domain">Company Domain</Label>
                      <Input
                        id="domain"
                        placeholder="company.com"
                        {...corporateForm.register("domain")}
                        className={corporateForm.formState.errors.domain ? "border-red-500" : ""}
                      />
                      {corporateForm.formState.errors.domain && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.domain.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="corp-industry">Industry</Label>
                      <Select onValueChange={(value) => corporateForm.setValue("industry", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {corporateForm.formState.errors.industry && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.industry.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select onValueChange={(value) => corporateForm.setValue("companySize", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                          <SelectItem value="small">Small (11-50 employees)</SelectItem>
                          <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                          <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">Your Job Title</Label>
                      <Input
                        id="jobTitle"
                        {...corporateForm.register("jobTitle")}
                        className={corporateForm.formState.errors.jobTitle ? "border-red-500" : ""}
                      />
                      {corporateForm.formState.errors.jobTitle && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.jobTitle.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="department">Department (Optional)</Label>
                      <Input
                        id="department"
                        {...corporateForm.register("department")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="corp-country">Country</Label>
                      <Select onValueChange={(value) => corporateForm.setValue("country", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {corporateForm.formState.errors.country && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.country.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billingEmail">Billing Email</Label>
                      <Input
                        id="billingEmail"
                        type="email"
                        {...corporateForm.register("billingEmail")}
                        className={corporateForm.formState.errors.billingEmail ? "border-red-500" : ""}
                      />
                      {corporateForm.formState.errors.billingEmail && (
                        <p className="text-sm text-red-500 mt-1">{corporateForm.formState.errors.billingEmail.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="corp-plan">Corporate Plan</Label>
                      <Select onValueChange={(value) => corporateForm.setValue("plan", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate - $49.99/month</SelectItem>
                          <SelectItem value="enterprise">Enterprise - Custom pricing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maxUsers">Max Users</Label>
                      <Input
                        id="maxUsers"
                        type="number"
                        min="5"
                        max="1000"
                        {...corporateForm.register("maxUsers", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Corporate Account..." : "Create Corporate Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <Shield className="w-5 h-5" />
                  <h4 className="font-semibold">Super Admin Access</h4>
                </div>
                <p className="text-sm text-red-700">
                  This account type provides full system access including user management, 
                  analytics, billing oversight, and system configuration. Requires admin access key.
                </p>
              </div>

              <form onSubmit={adminForm.handleSubmit(handleAdminSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      {...adminForm.register("email")}
                      className={adminForm.formState.errors.email ? "border-red-500" : ""}
                    />
                    {adminForm.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">{adminForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="admin-username">Admin Username</Label>
                    <Input
                      id="admin-username"
                      {...adminForm.register("username")}
                      className={adminForm.formState.errors.username ? "border-red-500" : ""}
                    />
                    {adminForm.formState.errors.username && (
                      <p className="text-sm text-red-500 mt-1">{adminForm.formState.errors.username.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admin-password">Secure Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      {...adminForm.register("password")}
                      className={adminForm.formState.errors.password ? "border-red-500" : ""}
                    />
                    {adminForm.formState.errors.password && (
                      <p className="text-sm text-red-500 mt-1">{adminForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="admin-confirmPassword">Confirm Password</Label>
                    <Input
                      id="admin-confirmPassword"
                      type="password"
                      {...adminForm.register("confirmPassword")}
                      className={adminForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {adminForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">{adminForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="adminKey">Admin Access Key</Label>
                  <Input
                    id="adminKey"
                    type="password"
                    placeholder="Enter super admin access key"
                    {...adminForm.register("adminKey")}
                    className={adminForm.formState.errors.adminKey ? "border-red-500" : ""}
                  />
                  {adminForm.formState.errors.adminKey && (
                    <p className="text-sm text-red-500 mt-1">{adminForm.formState.errors.adminKey.message}</p>
                  )}
                </div>

                <div>
                  <Label>Admin Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {adminPermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          onCheckedChange={(checked) => {
                            const current = adminForm.getValues("permissions");
                            if (checked) {
                              adminForm.setValue("permissions", [...current, permission]);
                            } else {
                              adminForm.setValue("permissions", current.filter(p => p !== permission));
                            }
                          }}
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {permission.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                  {isLoading ? "Creating Super Admin..." : "Create Super Admin Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}