import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Video, 
  Palette, 
  Globe, 
  Shield, 
  DollarSign, 
  CheckCircle,
  Star,
  Rocket,
  Crown
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface HackathonIntegration {
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  value: string;
  status: 'available' | 'active' | 'used';
  credits?: number;
  features: string[];
}

export default function HackathonShowcase() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showcase, setShowcase] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const integrations: HackathonIntegration[] = [
    {
      name: 'Tavus AI Video',
      icon: Video,
      description: '250 free conversational video minutes with AI presenter',
      value: '$150 FREE',
      status: 'available',
      credits: 150,
      features: ['AI Presenter', 'Conversational Video', 'Custom Personas', '3D Environments']
    },
    {
      name: 'Pica Pro Design',
      icon: Palette,
      description: '2 months of Pro access with premium templates',
      value: '$200 FREE',
      status: 'available',
      features: ['Premium Templates', 'Advanced Design Tools', 'Brand Consistency', 'Export Options']
    },
    {
      name: 'Lingo Localization',
      icon: Globe,
      description: 'Localize content in 85+ languages',
      value: '$50 FREE',
      status: 'available',
      credits: 50,
      features: ['85+ Languages', 'Cultural Adaptation', 'Professional Translation', 'API Integration']
    },
    {
      name: 'Sentry Monitoring',
      icon: Shield,
      description: '6 months of Team Plan with error tracking',
      value: '6 Months FREE',
      status: 'active',
      features: ['Error Tracking', 'Performance Monitoring', 'Session Replay', 'Log Monitoring']
    },
    {
      name: 'RevenueCat',
      icon: DollarSign,
      description: 'Free until $2.5K monthly revenue',
      value: 'FREE',
      status: 'active',
      features: ['Subscription Management', 'Payment Processing', 'Analytics', 'Cross-platform']
    },
    {
      name: 'Dappier AI',
      icon: Zap,
      description: 'AI search and content enhancement',
      value: '$25 FREE',
      status: 'available',
      credits: 25,
      features: ['AI Search', 'Content Enhancement', 'Market Insights', 'Custom Copilots']
    }
  ];

  const handleGenerateShowcase = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const businessData = {
        businessName: 'ProtoLab AI',
        industry: 'AI/SaaS',
        country: 'Kenya',
        description: 'AI-powered pitch deck generator for African entrepreneurs with advanced 3D video generation and multi-language support',
        fundingAmount: 1000000,
        useCase: 'Series A funding'
      };

      const response = await apiRequest('POST', '/api/hackathon/showcase', {
        businessData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success) {
        setShowcase(response.hackathon_showcase);
        toast({
          title: "Hackathon Showcase Complete!",
          description: "All premium integrations activated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Showcase generation failed",
        description: "Please try again or check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const totalValue = integrations.reduce((sum, integration) => {
    const value = integration.value.replace(/[^0-9]/g, '');
    return sum + (value ? parseInt(value) : 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hackathon Premium Showcase
          </h1>
          <Crown className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          ProtoLab enhanced with $475+ worth of premium hackathon perks - transforming your pitch deck generator into a professional AI powerhouse
        </p>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Total Value: ${totalValue}+ in Premium Features
        </Badge>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, index) => (
          <Card key={index} className="relative overflow-hidden border-2 hover:border-blue-300 transition-all">
            <div className="absolute top-2 right-2">
              {integration.status === 'active' && (
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
              {integration.status === 'available' && (
                <Badge variant="outline">
                  <Star className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              )}
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <integration.icon className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {integration.value}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="mb-3">
                {integration.description}
              </CardDescription>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Key Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {integration.features.map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {integration.credits && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">
                    ${integration.credits} Credits Available
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate Showcase Button */}
      <div className="text-center">
        <Button 
          onClick={handleGenerateShowcase}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
        >
          {isGenerating ? (
            <>
              <Rocket className="h-5 w-5 mr-2 animate-spin" />
              Generating Premium Showcase...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5 mr-2" />
              Generate Complete Hackathon Showcase
            </>
          )}
        </Button>
        
        {isGenerating && (
          <div className="mt-4 max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Activating premium integrations... {progress}%
            </p>
          </div>
        )}
      </div>

      {/* Showcase Results */}
      {showcase && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-6 w-6" />
              Hackathon Showcase Complete!
            </CardTitle>
            <CardDescription>
              {showcase.business_name} enhanced with all premium integrations
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Enhanced Features</TabsTrigger>
                <TabsTrigger value="video">AI Video</TabsTrigger>
                <TabsTrigger value="design">Premium Design</TabsTrigger>
                <TabsTrigger value="global">Localization</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">AI Video Generation</h4>
                    <p className="text-sm text-gray-600">
                      Conversational AI presenter with 3D environments
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Premium Design</h4>
                    <p className="text-sm text-gray-600">
                      Professional templates with brand consistency
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Multi-language Support</h4>
                    <p className="text-sm text-gray-600">
                      Content localized to French, Swahili, Arabic, Portuguese
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Error Monitoring</h4>
                    <p className="text-sm text-gray-600">
                      Professional monitoring with performance tracking
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="video">
                <div className="space-y-4">
                  <h4 className="font-semibold">Tavus AI Video Integration</h4>
                  <p>Professional AI presenter with conversational capabilities.</p>
                  <Badge className="bg-blue-500">$150 Credits Available</Badge>
                </div>
              </TabsContent>
              
              <TabsContent value="design">
                <div className="space-y-4">
                  <h4 className="font-semibold">Pica Pro Design Enhancement</h4>
                  <p>Premium templates and advanced design tools.</p>
                  <Badge className="bg-purple-500">2 Months Pro Access</Badge>
                </div>
              </TabsContent>
              
              <TabsContent value="global">
                <div className="space-y-4">
                  <h4 className="font-semibold">Lingo Multi-language Localization</h4>
                  <p>Content translated to 85+ languages with cultural adaptation.</p>
                  <Badge className="bg-green-500">$50 Credits Available</Badge>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-800">Total Value Unlocked</h4>
              </div>
              <p className="text-yellow-700">
                {showcase.total_value_unlocked} in premium features now active in your ProtoLab application
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}