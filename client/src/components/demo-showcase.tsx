import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Download, 
  Users, 
  Globe, 
  FileText, 
  Zap,
  CheckCircle,
  TrendingUp,
  MapPin,
  Award
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  data?: any;
}

export default function DemoShowcase() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const demoSteps: DemoStep[] = [
    {
      id: 'startup-profile',
      title: 'African Startup Profile',
      description: 'GreenHarvest Kenya - IoT Agriculture Technology',
      completed: false,
      data: {
        company: 'GreenHarvest Kenya',
        industry: 'Agriculture Technology',
        location: 'Nairobi, Kenya',
        stage: 'Series A Ready',
        problem: 'Small-scale farmers lose 40% of crops due to inefficient irrigation',
        solution: 'IoT-powered precision irrigation with mobile app control'
      }
    },
    {
      id: 'grant-matching',
      title: 'Grant Intelligence Discovery',
      description: 'Matching with authentic African Development Bank opportunities',
      completed: false,
      data: {
        matchedGrants: [
          {
            source: 'African Development Bank',
            program: 'Feed Africa Priority',
            amount: 'Up to $500K',
            deadline: '2024-08-15',
            match: '95%'
          },
          {
            source: 'Green Climate Fund',
            program: 'Climate Adaptation',
            amount: 'Up to $2M',
            deadline: '2024-09-30',
            match: '88%'
          }
        ]
      }
    },
    {
      id: 'template-selection',
      title: 'Cultural Template Application',
      description: 'Applying Ubuntu Spirit theme with AgriTech template',
      completed: false,
      data: {
        template: 'AgriTech Green',
        theme: 'Ubuntu Spirit',
        features: ['Sustainability metrics', 'Impact visualization', 'Cultural motifs']
      }
    },
    {
      id: 'pitch-generation',
      title: 'Professional Pitch Creation',
      description: 'Generating investor-ready presentation with market insights',
      completed: false,
      data: {
        slides: 8,
        marketSize: '$24B East African agriculture market',
        projectedRevenue: '$5.8M by Year 3',
        impactMetrics: '35% yield increase, 40% water savings'
      }
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration Setup',
      description: 'Enabling multi-stakeholder proposal development',
      completed: false,
      data: {
        teamMembers: [
          'University of Nairobi - Research Partner',
          'Kenya Agricultural Research Institute - Technical Advisor',
          'Local Farmers Cooperative - End Users'
        ]
      }
    }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setProgress(0);
    
    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      
      // Simulate processing time for each step
      for (let p = 0; p <= 100; p += 10) {
        setProgress((i * 100 + p) / demoSteps.length);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      demoSteps[i].completed = true;
      
      toast({
        title: `${demoSteps[i].title} Complete`,
        description: demoSteps[i].description,
      });
    }
    
    setIsRunning(false);
    setProgress(100);
    
    toast({
      title: "Demo Complete!",
      description: "ProtoLab successfully generated a comprehensive pitch deck with authentic African market data.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          ProtoLab: Complete Workflow Demo
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          See how African entrepreneurs create professional pitch decks and access funding opportunities
        </p>
        
        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="font-semibold">Generate Your Pitch</h3>
            </div>
            <p className="text-sm text-gray-600">Start with your business idea and let AI create a professional presentation</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="font-semibold">Customize & Style</h3>
            </div>
            <p className="text-sm text-gray-600">Choose templates and African cultural themes to personalize your deck</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="font-semibold">Access Funding</h3>
            </div>
            <p className="text-sm text-gray-600">Match with grants and collaborate on proposals with team members</p>
          </Card>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={runDemo} 
            disabled={isRunning}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Play className="w-5 h-5 mr-2" />
            {isRunning ? 'Running Demo...' : 'Watch Complete Demo'}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              window.open('/3d-video-demo', '_blank');
            }}
          >
            <FileText className="w-5 h-5 mr-2" />
            View 3D Pitch Demo
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          Sample: GreenHarvest Kenya AgriTech pitch deck with Ubuntu Spirit theme
        </p>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Demo Progress
            <Badge variant={progress === 100 ? "default" : "secondary"}>
              {Math.round(progress)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          {isRunning && (
            <p className="text-sm text-gray-600 mt-2">
              Currently processing: {demoSteps[currentStep]?.title}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Demo Results Display */}
      {!isRunning && progress > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <CheckCircle className="w-6 h-6 mr-2" />
              Demo Complete - Results Generated!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">✅ Business Profile Created</h4>
                <p className="text-sm text-gray-700 mb-1"><strong>Company:</strong> GreenHarvest Kenya</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Industry:</strong> AgriTech</p>
                <p className="text-sm text-gray-700"><strong>Stage:</strong> Series A Ready</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">✅ Grants Matched</h4>
                <div className="space-y-1">
                  <div className="text-xs bg-white rounded p-2">
                    <div className="font-medium">African Development Bank</div>
                    <div className="text-gray-600">Feed Africa Priority - Up to $500K</div>
                    <Badge variant="default" className="text-xs">95% match</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">✅ Professional Pitch Generated</h4>
                <p className="text-sm text-gray-700 mb-1"><strong>Slides:</strong> 8 professional slides</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Market Size:</strong> $24B East African agriculture</p>
                <p className="text-sm text-gray-700"><strong>Revenue Projection:</strong> $5.8M by Year 3</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">✅ Design Applied</h4>
                <p className="text-sm text-gray-700 mb-1"><strong>Template:</strong> AgriTech Green</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Theme:</strong> Ubuntu Spirit</p>
                <p className="text-sm text-gray-700"><strong>Features:</strong> Cultural motifs, impact metrics</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h4 className="font-semibold text-center mb-3">🎉 Your pitch deck is ready!</h4>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/pitch/10/download');
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'GreenHarvest-Kenya-Demo-Pitch.pdf';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      }
                    } catch (error) {
                      console.error('Download error:', error);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Demo Results
                </Button>
                
                <Button 
                  onClick={() => {
                    const element = document.getElementById('generator');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  variant="outline"
                >
                  Create Your Own
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoSteps.map((step, index) => (
          <Card key={step.id} className={`${step.completed ? 'border-green-500' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                {step.title}
                {step.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                {currentStep === index && isRunning && <Zap className="w-5 h-5 text-orange-600 animate-pulse" />}
              </CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            
            {step.completed && step.data && (
              <CardContent>
                {step.id === 'startup-profile' && (
                  <div className="space-y-2 text-sm">
                    <div><strong>Company:</strong> {step.data.company}</div>
                    <div><strong>Industry:</strong> {step.data.industry}</div>
                    <div><strong>Location:</strong> {step.data.location}</div>
                    <Badge variant="outline">{step.data.stage}</Badge>
                  </div>
                )}
                
                {step.id === 'grant-matching' && (
                  <div className="space-y-3">
                    {step.data.matchedGrants.map((grant: any, idx: number) => (
                      <div key={idx} className="border rounded p-2">
                        <div className="font-medium text-sm">{grant.source}</div>
                        <div className="text-xs text-gray-600">{grant.program}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm font-medium">{grant.amount}</span>
                          <Badge variant="default">{grant.match} match</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {step.id === 'template-selection' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Template:</span>
                      <Badge variant="outline">{step.data.template}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Theme:</span>
                      <Badge variant="outline">{step.data.theme}</Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      Features: {step.data.features.join(', ')}
                    </div>
                  </div>
                )}
                
                {step.id === 'pitch-generation' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Slides Generated:</span>
                      <Badge>{step.data.slides}</Badge>
                    </div>
                    <div><strong>Market:</strong> {step.data.marketSize}</div>
                    <div><strong>Revenue:</strong> {step.data.projectedRevenue}</div>
                    <div><strong>Impact:</strong> {step.data.impactMetrics}</div>
                  </div>
                )}
                
                {step.id === 'collaboration' && (
                  <div className="space-y-2">
                    {step.data.teamMembers.map((member: string, idx: number) => (
                      <div key={idx} className="flex items-center text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {member}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Features Showcase */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="data">Authentic Data</TabsTrigger>
          <TabsTrigger value="ai">AI Intelligence</TabsTrigger>
          <TabsTrigger value="impact">African Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <FileText className="w-8 h-8 text-orange-600" />
                <CardTitle className="text-lg">AI Pitch Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Professional pitch decks generated in 5 minutes with market insights</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Globe className="w-8 h-8 text-green-600" />
                <CardTitle className="text-lg">Grant Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Access to 15+ authentic African funding sources with real-time matching</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Users className="w-8 h-8 text-blue-600" />
                <CardTitle className="text-lg">Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Multi-stakeholder workspace with approval workflows and evidence management</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Award className="w-8 h-8 text-purple-600" />
                <CardTitle className="text-lg">Cultural Themes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">6 African heritage themes celebrating Ubuntu, Sahara, and Savanna aesthetics</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentic Data Sources</CardTitle>
              <CardDescription>Real funding opportunities from verified African institutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Development Banks</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• African Development Bank (AfDB)</li>
                    <li>• World Bank Africa Programs</li>
                    <li>• African Export-Import Bank</li>
                    <li>• Development Bank of Southern Africa</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Climate & Impact Funds</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Green Climate Fund</li>
                    <li>• Climate Investment Funds</li>
                    <li>• Tony Elumelu Foundation</li>
                    <li>• Mastercard Foundation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-green-600" />African market size analysis</li>
                  <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-600" />Regional opportunity mapping</li>
                  <li className="flex items-center"><Globe className="w-4 h-4 mr-2 text-orange-600" />Competition landscape insights</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Multilingual Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['English', 'French', 'Portuguese', 'Swahili', 'Amharic', 'Hausa', 'Yoruba', 'Arabic'].map(lang => (
                    <Badge key={lang} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Empowering African Innovation</CardTitle>
              <CardDescription>Real success stories and projected impact metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">50,000+</div>
                  <div className="text-sm text-gray-600">African startups seeking funding annually</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">$2.5B</div>
                  <div className="text-sm text-gray-600">Grant funding distributed in Africa yearly</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12+</div>
                  <div className="text-sm text-gray-600">African languages supported</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}