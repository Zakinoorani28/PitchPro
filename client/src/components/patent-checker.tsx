import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Zap,
  Globe,
  Smartphone,
  DollarSign,
  Users
} from 'lucide-react';

interface PatentResult {
  patentNumber: string;
  title: string;
  description: string;
  similarityScore: number;
  differences: string[];
}

interface PatentCheck {
  id: string;
  noveltyScore: number;
  similarPatents: PatentResult[];
  recommendations: string[];
  status: 'processing' | 'completed' | 'failed';
}

export default function PatentChecker() {
  const [isPriorityCheck, setIsPriorityCheck] = useState(true);
  const [showMPesaDialog, setShowMPesaDialog] = useState(false);
  const [checkResult, setCheckResult] = useState<PatentCheck | null>(null);
  const { toast } = useToast();

  const patentCheckMutation = useMutation({
    mutationFn: async (data: { description: string; isPriority: boolean }) => {
      const response = await apiRequest('POST', '/api/patent/check', data);
      return response.json();
    },
    onSuccess: (result) => {
      setCheckResult({
        id: result.checkId,
        noveltyScore: result.noveltyScore,
        similarPatents: result.similarPatents,
        recommendations: result.recommendations,
        status: 'completed'
      });
      toast({
        title: "Patent Analysis Complete",
        description: `Novelty score: ${result.noveltyScore}/100`,
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  });

  const mpesaVerifyMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; amount: number }) => {
      const response = await apiRequest('POST', '/api/verify/mpesa', data);
      return response.json();
    },
    onSuccess: () => {
      setShowMPesaDialog(false);
      toast({
        title: "M-Pesa Payment Initiated",
        description: "Please complete payment on your phone",
      });
    }
  });

  const handlePatentCheck = (data: { description: string }) => {
    if (isPriorityCheck) {
      setShowMPesaDialog(true);
      return;
    }
    
    patentCheckMutation.mutate({
      description: data.description,
      isPriority: isPriorityCheck
    });
  };

  const handleMPesaPayment = (phoneNumber: string) => {
    mpesaVerifyMutation.mutate({
      phoneNumber,
      amount: 4.99 // Priority check fee
    });
  };

  const getNoveltyColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNoveltyLabel = (score: number) => {
    if (score >= 80) return 'High Novelty';
    if (score >= 60) return 'Moderate Novelty';
    return 'Low Novelty';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Patent Intelligence System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          AI-powered patent novelty analysis with ARIPO filing support
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4" />
            <span>Global Patent Database</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>ARIPO Compatible</span>
          </div>
          <div className="flex items-center space-x-1">
            <Smartphone className="w-4 h-4" />
            <span>M-Pesa Payments</span>
          </div>
        </div>
      </div>

      {/* Patent Check Form */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Patent Novelty Check</span>
          </CardTitle>
          <CardDescription>
            Analyze your invention's novelty against existing patents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handlePatentCheck({
              description: formData.get('description') as string
            });
          }}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="description">Invention Description</Label>
                <Textarea
                  name="description"
                  placeholder="Describe your invention in detail. Include technical specifications, unique features, and how it works..."
                  rows={6}
                  required
                  className="mt-2"
                />
              </div>

              {/* Priority Check Option */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <Label htmlFor="priority" className="font-semibold">Priority Check</Label>
                    <Badge variant="secondary">$4.99</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Get results in 24 hours + lawyer consultation recommendations
                  </p>
                </div>
                <Switch
                  id="priority"
                  checked={isPriorityCheck}
                  onCheckedChange={setIsPriorityCheck}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={patentCheckMutation.isPending}
              >
                {patentCheckMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Patent Landscape...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    {isPriorityCheck ? 'Start Priority Check' : 'Check Patent Novelty (Free)'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* M-Pesa Payment Dialog */}
      <Dialog open={showMPesaDialog} onOpenChange={setShowMPesaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>M-Pesa Payment</span>
            </DialogTitle>
            <DialogDescription>
              Complete payment for priority patent check ($4.99)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleMPesaPayment(formData.get('phoneNumber') as string);
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
                <Input
                  name="phoneNumber"
                  type="tel"
                  placeholder="+254700000000"
                  required
                />
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You will receive an STK push notification to complete payment
                </AlertDescription>
              </Alert>
              <Button 
                type="submit" 
                className="w-full"
                disabled={mpesaVerifyMutation.isPending}
              >
                {mpesaVerifyMutation.isPending ? 'Initiating Payment...' : 'Pay with M-Pesa'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Patent Check Results */}
      {checkResult && (
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Patent Analysis Results</span>
              <Badge variant={checkResult.noveltyScore >= 80 ? 'default' : checkResult.noveltyScore >= 60 ? 'secondary' : 'destructive'}>
                {getNoveltyLabel(checkResult.noveltyScore)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="similar">Similar Patents</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="aripo">ARIPO Filing</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getNoveltyColor(checkResult.noveltyScore)}`}>
                          {checkResult.noveltyScore}/100
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Novelty Score</p>
                        <Progress value={checkResult.noveltyScore} className="mt-3" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {checkResult.similarPatents.length}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Similar Patents Found</p>
                        <FileText className="w-8 h-8 mx-auto mt-3 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {checkResult.recommendations.length}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Recommendations</p>
                        <CheckCircle2 className="w-8 h-8 mx-auto mt-3 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="similar">
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {checkResult.similarPatents.map((patent, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">{patent.title}</h4>
                              <p className="text-sm text-gray-600">{patent.patentNumber}</p>
                            </div>
                            <Badge variant={patent.similarityScore > 70 ? 'destructive' : patent.similarityScore > 50 ? 'secondary' : 'outline'}>
                              {patent.similarityScore}% similar
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{patent.description}</p>
                          <div>
                            <p className="text-sm font-medium mb-2">Key Differences:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {patent.differences.map((diff, diffIndex) => (
                                <li key={diffIndex} className="flex items-start space-x-2">
                                  <span className="text-green-600 mt-1">•</span>
                                  <span>{diff}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                {checkResult.recommendations.map((recommendation, index) => {
                  const isPremiumSection = recommendation.includes('--- Premium') || recommendation.includes('--- Patent Strategy');
                  const isBasicRecommendation = !isPremiumSection;
                  
                  if (isPremiumSection) {
                    return (
                      <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-purple-800">{recommendation}</h4>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <Alert key={index} className={isBasicRecommendation ? "" : "bg-purple-50 border-purple-200"}>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription className={isBasicRecommendation ? "" : "text-purple-700"}>
                        {recommendation}
                      </AlertDescription>
                    </Alert>
                  );
                })}
                
                {isPriorityCheck && checkResult.recommendations.some(r => r.includes('Premium')) && (
                  <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-800">Enhanced Analysis Complete</h4>
                      </div>
                      <p className="text-sm text-purple-700 mb-3">
                        Your priority check includes advanced novelty improvements and patent strategy recommendations
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {checkResult.noveltyScore >= 70 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Users className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Lawyer Consultation Available</h4>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Connect with patent attorneys specialized in African markets (15% service fee)
                      </p>
                      <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                        Find Patent Lawyers
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="aripo" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="w-5 h-5" />
                      <span>ARIPO Patent Filing</span>
                    </CardTitle>
                    <CardDescription>
                      African Regional Intellectual Property Organization filing support
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Coverage Countries</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>• Botswana, Eswatini, Ghana</div>
                          <div>• Kenya, Lesotho, Liberia</div>
                          <div>• Malawi, Mozambique, Namibia</div>
                          <div>• Rwanda, São Tomé, Sierra Leone</div>
                          <div>• Somalia, Sudan, Tanzania</div>
                          <div>• Uganda, Zambia, Zimbabwe</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Filing Benefits</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>• Single application for multiple countries</div>
                          <div>• Cost-effective vs individual filings</div>
                          <div>• English language proceedings</div>
                          <div>• 18-month protection period</div>
                        </div>
                      </div>
                    </div>
                    
                    {checkResult.noveltyScore >= 60 && (
                      <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                          Your invention shows sufficient novelty for ARIPO filing consideration
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex space-x-3">
                      <Button variant="outline">
                        Download ARIPO Guide
                      </Button>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Start ARIPO Filing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}