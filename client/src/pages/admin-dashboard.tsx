import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  DollarSign, 
  FileText, 
  Building2, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  BarChart3,
  Shield,
  Activity
} from "lucide-react";

interface AdminStats {
  users: {
    total: number;
    active: number;
    byPlan: Record<string, number>;
    newThisMonth: number;
  };
  revenue: {
    monthly: number;
    yearly: number;
    byPlan: Record<string, number>;
  };
  usage: {
    totalDecks: number;
    totalCreditsUsed: number;
    avgCreditsPerUser: number;
  };
  corporate: {
    totalAccounts: number;
    totalTeamMembers: number;
  };
  system: {
    errorRate: number;
    avgResponseTime: number;
    uptime: string;
  };
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    enabled: true,
  });

  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: selectedTab === "users",
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/admin/analytics/overview'],
    enabled: selectedTab === "analytics",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const adminStats = stats?.stats as AdminStats;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-red-600" />
                  ProtoLab Super Admin
                </h1>
                <p className="text-gray-600 mt-1">
                  Complete system oversight and user management
                </p>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Super Admin Access
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="corporate">Corporate</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminStats?.users.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{adminStats?.users.newThisMonth} new this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${adminStats?.revenue.monthly.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${adminStats?.revenue.yearly.toLocaleString()} yearly
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pitch Decks Created</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStats?.usage.totalDecks.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {adminStats?.usage.avgCreditsPerUser} avg credits/user
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Corporate Accounts</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStats?.corporate.totalAccounts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {adminStats?.corporate.totalTeamMembers} team members
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">System Uptime</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {adminStats?.system.uptime}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Error Rate</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {adminStats?.system.errorRate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg Response Time</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {adminStats?.system.avgResponseTime}ms
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {adminStats?.users.byPlan && Object.entries(adminStats.users.byPlan).map(([plan, count]) => (
                    <div key={plan} className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{plan}</span>
                      <Badge variant="outline">
                        {count} users
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage individual and corporate user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">Total Users</h4>
                      <p className="text-sm text-muted-foreground">
                        {adminStats?.users.total} registered users
                      </p>
                    </div>
                    <Button variant="outline">
                      Export Users
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{adminStats?.users.active}</div>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{adminStats?.users.newThisMonth}</div>
                        <p className="text-sm text-muted-foreground">New This Month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                          {adminStats?.users.total - adminStats?.users.active}
                        </div>
                        <p className="text-sm text-muted-foreground">Inactive Users</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  System Analytics
                </CardTitle>
                <CardDescription>
                  Comprehensive insights into platform usage and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Revenue Analytics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monthly Revenue</span>
                        <span className="font-bold">${adminStats?.revenue.monthly.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Yearly Revenue</span>
                        <span className="font-bold">${adminStats?.revenue.yearly.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Usage Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Pitch Decks</span>
                        <span className="font-bold">{adminStats?.usage.totalDecks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credits Used</span>
                        <span className="font-bold">{adminStats?.usage.totalCreditsUsed.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="corporate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Corporate Account Management
                </CardTitle>
                <CardDescription>
                  Oversee corporate accounts and team management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">{adminStats?.corporate.totalAccounts}</div>
                      <p className="text-sm text-muted-foreground">Corporate Accounts</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">{adminStats?.corporate.totalTeamMembers}</div>
                      <p className="text-sm text-muted-foreground">Total Team Members</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Administration
                </CardTitle>
                <CardDescription>
                  System settings, monitoring, and configuration management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-green-600">{adminStats?.system.uptime}</div>
                        <p className="text-sm text-muted-foreground">System Uptime</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {adminStats?.system.errorRate}%
                        </div>
                        <p className="text-sm text-muted-foreground">Error Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {adminStats?.system.avgResponseTime}ms
                        </div>
                        <p className="text-sm text-muted-foreground">Response Time</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">System Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline">Export Analytics</Button>
                      <Button variant="outline">System Backup</Button>
                      <Button variant="outline">Clear Cache</Button>
                      <Button variant="outline">Update Settings</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}