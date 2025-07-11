import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Code, Zap, BarChart3, Clock, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface GeneratedComponent {
  name: string;
  type: string;
  description: string;
  code: string;
  stats: {
    cyclomatic: number;
    lines: number;
    components: number;
    complexity: number;
  };
  metadata: {
    generated: boolean;
    timestamp: string;
    prompt: string;
    boltEnhanced: boolean;
  };
}

interface PerformanceMetrics {
  renderTime: number;
  memoryDelta: number;
  complexity: number;
  operationId: string;
}

export default function AIComponentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedComponent, setGeneratedComponent] = useState<GeneratedComponent | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [boltCredits, setBoltCredits] = useState({
    component_generations: 0,
    ai_generations: 0,
    performance_optimizations: 0
  });
  const { toast } = useToast();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for the component you want to generate.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const startTime = performance.now();

    try {
      // Generate component with AI assistance
      const response = await apiRequest('POST', '/api/ai/generate-component', {
        prompt,
        options: {
          bolt_hackathon: true,
          performance_tracking: true
        }
      });

      const result = await response.json();

      if (result.success && result.component) {
        setGeneratedComponent(result.component);
        
        // Calculate performance metrics
        const renderTime = performance.now() - startTime;
        const metrics = {
          operationId: `component_gen_${Date.now()}`,
          renderTime,
          memoryDelta: 0,
          complexity: result.component.stats?.complexity || 0.5
        };
        
        setPerformanceMetrics(prev => [...prev.slice(-4), metrics]);

        // Log performance to analytics
        await apiRequest('POST', '/api/analytics/performance', metrics).catch(console.error);

        // Update credits display
        const creditsResponse = await apiRequest('GET', '/api/bolt-credits');
        const credits = await creditsResponse.json();
        setBoltCredits(credits);

        toast({
          title: "Component Generated!",
          description: `Created ${result.component.type} component with AI assistance`,
        });
      }

    } catch (error: any) {
      console.error('Component generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate component. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, toast]);

  const handleCopyCode = useCallback(() => {
    if (generatedComponent?.code) {
      navigator.clipboard.writeText(generatedComponent.code);
      toast({
        title: "Code Copied",
        description: "Component code copied to clipboard",
      });
    }
  }, [generatedComponent, toast]);

  return (
    <div className="space-y-6">
      {/* AI Component Generator Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            AI Component Generator
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              Bolt Enhanced
            </Badge>
          </CardTitle>
          <p className="text-slate-600">
            Generate React components with AI assistance, performance monitoring, and RevenueCat integration
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Component Description</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., 'Create a dashboard card with user analytics and charts' or 'Build a contact form with validation'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] mt-2"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Component
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={async () => {
                const response = await apiRequest('GET', '/api/bolt-credits');
                const credits = await response.json();
                setBoltCredits(credits);
                toast({
                  title: "Credits Updated",
                  description: `Component generations: ${credits.component_generations || 0}`,
                });
              }}
            >
              View Credits
            </Button>
          </div>

          {/* Credit Status */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Proto Credits</span>
            </div>
            <div className="text-sm text-slate-600">
              Components: {boltCredits.component_generations}/50 • 
              AI Calls: {boltCredits.ai_generations}/100
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Component Display */}
      {generatedComponent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-green-600" />
              Generated Component: {generatedComponent.name}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{generatedComponent.type}</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                AI Generated
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Bolt Enhanced
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <div className="p-6 border rounded-lg bg-slate-50">
                  <h4 className="font-medium text-slate-900 mb-2">Component Preview</h4>
                  <p className="text-sm text-slate-600 mb-4">{generatedComponent.description}</p>
                  
                  <div className="bg-white p-4 rounded border-2 border-dashed border-slate-300">
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🎨</div>
                      <p className="font-medium">{generatedComponent.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {generatedComponent.type} Component
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Generated Code</h4>
                  <Button size="sm" onClick={handleCopyCode}>
                    Copy Code
                  </Button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generatedComponent.code}</code>
                </pre>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Complexity</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">
                      {generatedComponent.stats.cyclomatic}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Code className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Lines</span>
                    </div>
                    <p className="text-lg font-bold text-green-700">
                      {generatedComponent.stats.lines}
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Components</span>
                    </div>
                    <p className="text-lg font-bold text-purple-700">
                      {generatedComponent.stats.components}
                    </p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Quality</span>
                    </div>
                    <p className="text-lg font-bold text-orange-700">
                      {Math.round(generatedComponent.stats.complexity * 100)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Quality Score</h5>
                  <Progress 
                    value={generatedComponent.stats.complexity * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-slate-500">
                    Based on code complexity, structure, and AI analysis
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {performanceMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Performance Metrics
            </CardTitle>
            <p className="text-slate-600">Real-time performance monitoring for AI operations</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.slice(-3).map((metrics, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">
                        Operation: {metrics.operationId.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-500">
                        Render Time: {metrics.renderTime.toFixed(2)}ms
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={metrics.renderTime < 1000 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {metrics.renderTime < 1000 ? 'Fast' : 'Optimizing'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}