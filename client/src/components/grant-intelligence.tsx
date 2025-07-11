import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  DollarSign, 
  Calendar, 
  Globe, 
  Building2, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  Bell,
  Target,
  Users,
  Lightbulb
} from 'lucide-react';

interface Grant {
  id: number;
  source: string;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  region: string;
  sectors: string[];
  eligibility: string[];
  applicationUrl: string;
  isActive: boolean;
}

interface GrantIntelligence {
  grants: Grant[];
  totalFunding: number;
  recommendations: string[];
  matchingScore: number;
}

export default function GrantIntelligence() {
  const [searchCriteria, setSearchCriteria] = useState({
    industry: '',
    country: '',
    businessType: ''
  });
  const [grantIntelligence, setGrantIntelligence] = useState<GrantIntelligence | null>(null);
  const { toast } = useToast();

  const { data: allGrants = [] } = useQuery({
    queryKey: ['/api/grants/all'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/grants/all');
      return response.json();
    }
  });

  const grantSearchMutation = useMutation({
    mutationFn: async (criteria: typeof searchCriteria) => {
      const params = new URLSearchParams(criteria as Record<string, string>);
      const response = await apiRequest('GET', `/api/grants/intelligence?${params}`);
      return response.json();
    },
    onSuccess: (data) => {
      setGrantIntelligence(data);
      toast({
        title: "Grant Intelligence Generated",
        description: `Found ${data.grants.length} matching opportunities`,
      });
    }
  });

  const whatsappNotifyMutation = useMutation({
    mutationFn: async (data: { phone: string; grantId: number }) => {
      const response = await apiRequest('POST', '/api/notifications/whatsapp', {
        phone: data.phone,
        message: `Grant opportunity alert: Check out the latest funding opportunity #${data.grantId}`,
        type: 'grant_alert'
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "WhatsApp Alert Sent",
        description: "You'll receive grant updates on WhatsApp",
      });
    }
  });

  const handleSearch = () => {
    if (!searchCriteria.industry || !searchCriteria.country) {
      toast({
        title: "Search Criteria Required",
        description: "Please select both industry and country",
        variant: "destructive",
      });
      return;
    }
    grantSearchMutation.mutate(searchCriteria);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 30) return 'text-red-600';
    if (days <= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatAmount = (amount: string) => {
    return amount.replace(/\$(\d+),?(\d+)? - \$(\d+),?(\d+)?/, (match, start1, start2, end1, end2) => {
      const startAmount = start2 ? `${start1}.${start2}M` : `${start1}K`;
      const endAmount = end2 ? `${end1}.${end2}M` : `${end1}K`;
      return `$${startAmount} - $${endAmount}`;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Grant Intelligence Engine
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          AI-powered grant matching with real-time opportunities from top African funders
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>10+ Major Funders</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>$50M+ Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>WhatsApp Alerts</span>
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Grant Opportunity Finder</span>
          </CardTitle>
          <CardDescription>
            Find grants tailored to your business and location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Industry</label>
              <Select onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agriculture">Agriculture & Agritech</SelectItem>
                  <SelectItem value="fintech">Fintech & Financial Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare & Medtech</SelectItem>
                  <SelectItem value="education">Education & Edtech</SelectItem>
                  <SelectItem value="energy">Energy & Clean Tech</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure & Construction</SelectItem>
                  <SelectItem value="technology">Technology & Software</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing & Industry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Country</label>
              <Select onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, country: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="kenya">Kenya</SelectItem>
                  <SelectItem value="south-africa">South Africa</SelectItem>
                  <SelectItem value="ghana">Ghana</SelectItem>
                  <SelectItem value="egypt">Egypt</SelectItem>
                  <SelectItem value="morocco">Morocco</SelectItem>
                  <SelectItem value="ethiopia">Ethiopia</SelectItem>
                  <SelectItem value="tanzania">Tanzania</SelectItem>
                  <SelectItem value="uganda">Uganda</SelectItem>
                  <SelectItem value="rwanda">Rwanda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Business Type</label>
              <Select onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, businessType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Early-stage Startup</SelectItem>
                  <SelectItem value="sme">Small & Medium Enterprise</SelectItem>
                  <SelectItem value="cooperative">Cooperative</SelectItem>
                  <SelectItem value="research">Research Institution</SelectItem>
                  <SelectItem value="ngo">Non-profit Organization</SelectItem>
                  <SelectItem value="enterprise">Large Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={grantSearchMutation.isPending}
          >
            {grantSearchMutation.isPending ? (
              <>
                <Search className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Grant Landscape...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Find Matching Grants
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Grant Intelligence Results */}
      {grantIntelligence && (
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="matches">Matches ({grantIntelligence.grants.length})</TabsTrigger>
            <TabsTrigger value="insights">Intelligence</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{grantIntelligence.grants.length}</p>
                      <p className="text-sm text-gray-600">Matching Grants</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">${(grantIntelligence.totalFunding / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-gray-600">Total Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{grantIntelligence.matchingScore}%</p>
                      <p className="text-sm text-gray-600">Match Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-4">
                {grantIntelligence.grants.map((grant) => {
                  const daysLeft = getDaysUntilDeadline(grant.deadline);
                  return (
                    <Card key={grant.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-lg">{grant.title}</h4>
                              <Badge variant="outline">{grant.source}</Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{grant.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="font-medium">{formatAmount(grant.amount)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className={`w-4 h-4 ${getUrgencyColor(daysLeft)}`} />
                                <span className={getUrgencyColor(daysLeft)}>
                                  {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Globe className="w-4 h-4 text-blue-600" />
                                <span>{grant.region}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4 text-purple-600" />
                                <span>{grant.eligibility.length} eligible types</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {grant.sectors.map((sector, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {sector}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={grant.applicationUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Apply Now
                            </a>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const phone = prompt("Enter your WhatsApp number for alerts:");
                              if (phone) {
                                whatsappNotifyMutation.mutate({ phone, grantId: grant.id });
                              }
                            }}
                          >
                            <Bell className="w-4 h-4 mr-1" />
                            Get Alerts
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>AI Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {grantIntelligence.recommendations.map((rec, index) => (
                    <Alert key={index}>
                      <AlertDescription>{rec}</AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Funding Landscape</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Agricultural Development</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fintech & Digital</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Climate & Sustainability</span>
                        <span>20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Other Sectors</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grant Application Timeline</CardTitle>
                <CardDescription>Upcoming deadlines and optimal application windows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grantIntelligence.grants
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .map((grant, index) => {
                      const daysLeft = getDaysUntilDeadline(grant.deadline);
                      return (
                        <div key={grant.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${daysLeft <= 30 ? 'bg-red-500' : daysLeft <= 60 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                          <div className="flex-1">
                            <p className="font-medium">{grant.title}</p>
                            <p className="text-sm text-gray-600">{grant.source}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{new Date(grant.deadline).toLocaleDateString()}</p>
                            <p className={`text-sm ${getUrgencyColor(daysLeft)}`}>
                              {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>WhatsApp Grant Alerts</span>
                </CardTitle>
                <CardDescription>
                  Get instant notifications about new grants and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const phone = formData.get('phone') as string;
                  whatsappNotifyMutation.mutate({ phone, grantId: 0 });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">WhatsApp Number</label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="+254700000000"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={whatsappNotifyMutation.isPending}>
                      <Bell className="w-4 h-4 mr-2" />
                      Enable Grant Alerts
                    </Button>
                  </div>
                </form>

                <div className="mt-6 space-y-3">
                  <h4 className="font-medium">Alert Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• New grant opportunities matching your profile</li>
                    <li>• Deadline reminders (30, 14, and 3 days before)</li>
                    <li>• Application status updates</li>
                    <li>• Funding announcements and results</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* All Available Grants */}
      <Card>
        <CardHeader>
          <CardTitle>All Active Grant Opportunities</CardTitle>
          <CardDescription>Browse all available grants from major African funders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allGrants.slice(0, 6).map((grant: Grant) => (
              <Card key={grant.id} className="border border-gray-200 hover:border-orange-300 transition-colors">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">{grant.source}</Badge>
                      <h4 className="font-semibold text-sm leading-tight">{grant.title}</h4>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{formatAmount(grant.amount)}</span>
                      <span>{getDaysUntilDeadline(grant.deadline)} days left</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={grant.applicationUrl} target="_blank" rel="noopener noreferrer">
                        Learn More
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}