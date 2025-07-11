import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Wand2, Download, Eye, Share2, Check, Settings, Clock, Info, Palette, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PitchFormData, GeneratePitchResponse } from "@/lib/types";
import Checkout from "@/components/checkout";

const formSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  country: z.string().min(1, "Please select a country"),
  businessType: z.string().min(1, "Please select a business type"),
  description: z.string().optional(),
});

export default function PitchGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [expandedSlideNotes, setExpandedSlideNotes] = useState<Record<number, boolean>>({});
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedPitch, setGeneratedPitch] = useState<GeneratePitchResponse | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  const form = useForm<PitchFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      country: "",
      businessType: "",
      description: "",
    },
  });

  // Demo functionality
  useEffect(() => {
    const handleDemoTrigger = (event: CustomEvent) => {
      const demoData = event.detail;
      
      // Auto-fill form with demo data
      form.setValue('industry', 'agriculture');
      form.setValue('country', 'kenya');
      form.setValue('businessType', 'startup');
      form.setValue('description', `Company: ${demoData.company}
Industry: ${demoData.industry}
Problem: ${demoData.problem}
Solution: ${demoData.solution}
Market: ${demoData.market}
Business Model: ${demoData.businessModel}`);
      
      // Auto-trigger generation after a brief delay
      setTimeout(() => {
        toast({
          title: "Demo Mode Activated",
          description: "Generating pitch deck for GreenHarvest Kenya AgriTech startup...",
        });
        
        // Trigger form submission
        const formData: PitchFormData = {
          industry: 'agriculture',
          country: 'kenya',
          businessType: 'startup',
          description: `Company: ${demoData.company}
Industry: ${demoData.industry}
Problem: ${demoData.problem}
Solution: ${demoData.solution}
Market: ${demoData.market}
Business Model: ${demoData.businessModel}`
        };
        
        startGeneration(formData);
      }, 1500);
    };

    window.addEventListener('demoTrigger', handleDemoTrigger as EventListener);
    
    return () => {
      window.removeEventListener('demoTrigger', handleDemoTrigger as EventListener);
    };
  }, [form, toast]);

  const generateMutation = useMutation({
    mutationFn: async (data: PitchFormData) => {
      try {
        const response = await apiRequest("POST", "/api/pitch/generate", data);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }
        const result = await response.json();
        return result as GeneratePitchResponse;
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Pitch generation successful:", data);
      setGeneratedPitch(data);
      setIsGenerating(false);
      setProgress(100);
      toast({
        title: "Pitch Deck Generated!",
        description: "Your professional pitch deck is ready for download.",
      });
    },
    onError: (error) => {
      console.error("Pitch generation error:", error);
      setIsGenerating(false);
      setProgress(0);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate pitch deck",
        variant: "destructive",
      });
    },
  });

  const loadingMessages = [
    "Analyzing market data...",
    "Researching competition...",
    "Generating financial projections...",
    "Crafting compelling narratives...",
    "Finalizing your pitch deck...",
  ];

  const startGeneration = (data: PitchFormData) => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedPitch(null);

    let currentProgress = 0;
    let messageIndex = 0;

    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 20;
      if (currentProgress > 95) currentProgress = 95;

      setProgress(currentProgress);

      if (messageIndex < loadingMessages.length) {
        setLoadingMessage(loadingMessages[messageIndex]);
        messageIndex++;
      }

      if (currentProgress >= 95) {
        clearInterval(progressInterval);
      }
    }, 800);

    generateMutation.mutate(data);
  };

  const handleDownload = async () => {
    if (!generatedPitch) return;

    try {
      const response = await fetch(`/api/pitch/${generatedPitch.requestId}/download?format=pdf`);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pitch-deck-${generatedPitch.requestId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Your pitch deck PDF is being downloaded.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFormatDownload = async (format: string, url: string) => {
    // Ensure user has generated content before allowing download
    if (!generatedPitch || !generatedPitch.content) {
      toast({
        title: "No Content to Download",
        description: "Please generate a pitch deck first before downloading.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For demo purposes, allow free downloads
      if (format === 'HTML') {
        // Generate HTML content for download
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${generatedPitch.content.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .slide { page-break-after: always; margin-bottom: 40px; }
        h1 { color: #2563eb; }
        h2 { color: #1e40af; }
    </style>
</head>
<body>
    <h1>${generatedPitch.content.title}</h1>
    ${generatedPitch.content.slides.map(slide => `
        <div class="slide">
            <h2>Slide ${slide.slideNumber}: ${slide.title}</h2>
            ${slide.content.map(item => `<p>${item}</p>`).join('')}
        </div>
    `).join('')}
</body>
</html>`;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `pitch-deck-${generatedPitch.requestId}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      } else {
        // For other formats, fetch from server
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Download failed: ${response.status}`);
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `pitch-deck-${generatedPitch.requestId}.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      }

      toast({
        title: "Download Started",
        description: `Your ${format} pitch deck is downloading.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: `Unable to download ${format}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async () => {
    if (!generatedPitch) return;
    
    setShowCheckout(false);
    setIsGenerating(true);
    setLoadingMessage("Generating premium version...");
    
    try {
      // Generate premium version after payment
      const response = await apiRequest("POST", `/api/pitch/${generatedPitch.requestId}/premium`, {
        paymentId: 1 // This would come from the payment response
      });
      const premiumData = await response.json();
      
      if (premiumData.success) {
        setGeneratedPitch(premiumData);
        toast({
          title: "Premium Version Ready!",
          description: "Your watermark-free pitch deck is now available for download.",
        });
      }
    } catch (error) {
      toast({
        title: "Premium Generation Failed",
        description: "Please contact support if payment was successful.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpgradeClick = () => {
    setShowCheckout(true);
  };

  const toggleSlideNotes = (slideNumber: number) => {
    setExpandedSlideNotes(prev => ({
      ...prev,
      [slideNumber]: !prev[slideNumber]
    }));
  };

  const getSlideNotes = (title: string, content: string[]) => {
    const notes = {
      'Problem Statement': 'Start with a compelling story or statistic. Make the problem relatable and urgent. Spend 2-3 minutes here to establish credibility.',
      'Solution': 'Keep it simple and visual. Focus on the unique value proposition. Avoid technical jargon and emphasize benefits over features.',
      'Market Size': 'Use the TAM/SAM/SOM framework. Be conservative with estimates and cite credible sources. Investors want to see large, growing markets.',
      'Business Model': 'Clearly explain how you make money. Show unit economics and path to profitability. Keep revenue streams simple and scalable.',
      'Traction': 'Lead with your strongest metrics. Show growth trends, not just absolute numbers. Include customer testimonials if available.',
      'Competition': 'Position yourself in the competitive landscape. Acknowledge competitors but highlight your differentiation clearly.',
      'Financial Projections': 'Be realistic but ambitious. Show key assumptions and drivers. Focus on revenue growth and path to profitability.',
      'Team': 'Highlight relevant experience and complementary skills. Include advisors and key hires. Show why this team can execute.',
      'Funding Ask': 'Be specific about amount and use of funds. Show clear milestones you\'ll achieve. Explain why this amount will get you there.'
    };
    
    const matchedKey = Object.keys(notes).find(key => 
      title.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(title.toLowerCase().split(' ')[0])
    );
    
    return matchedKey ? notes[matchedKey] : 'Focus on clarity and conciseness. Use visuals to support your narrative and practice smooth transitions between points.';
  };

  const getTalkingPoints = (title: string, content: string[]) => {
    const basePoints = [
      'Start with a hook that captures attention',
      'Use the "rule of three" - max 3 key points per slide',
      'Tell a story, don\'t just present data',
      'Practice smooth transitions to next slide'
    ];

    if (title.toLowerCase().includes('problem')) {
      return [
        'Share a personal story or customer pain point',
        'Use specific examples and statistics',
        'Create urgency - why solve this now?',
        'Set up the solution naturally'
      ];
    } else if (title.toLowerCase().includes('solution')) {
      return [
        'Demo the product if possible',
        'Focus on customer benefits, not features',
        'Explain your unique approach',
        'Address the "why us" question'
      ];
    } else if (title.toLowerCase().includes('market')) {
      return [
        'Start with TAM, narrow to SOM',
        'Show market growth trends',
        'Identify your beachhead market',
        'Explain market timing and opportunity'
      ];
    }
    
    return basePoints;
  };

  const getInvestorFocus = (title: string) => {
    const focus = {
      'problem': 'Investors want to see a large, urgent problem that affects many people. Show market validation.',
      'solution': 'Focus on differentiation and defensibility. What makes your solution 10x better?',
      'market': 'Demonstrate large addressable market with growth potential. Show you understand market dynamics.',
      'business': 'Prove scalable unit economics and clear path to profitability. Show recurring revenue potential.',
      'traction': 'Evidence of product-market fit and growth potential. Investors invest in momentum.',
      'team': 'Highlight domain expertise and execution track record. Show you can build and scale.',
      'financial': 'Conservative assumptions with aggressive execution. Show path to significant returns.',
      'competition': 'Acknowledge competitive threats but show sustainable competitive advantages.',
      'funding': 'Clear use of funds tied to specific milestones. Show this funding gets you to next level.'
    };

    const matchedKey = Object.keys(focus).find(key => 
      title.toLowerCase().includes(key)
    );
    
    return matchedKey ? focus[matchedKey] : 'Investors evaluate team, market size, traction, and scalability. Keep your narrative focused on these key areas.';
  };

  if (showCheckout && generatedPitch) {
    return (
      <section id="generator" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Upgrade to Premium</h2>
            <p className="text-lg text-slate-600">Remove watermarks and get your professional pitch deck</p>
          </div>
          <Checkout 
            requestId={generatedPitch.requestId}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowCheckout(false)}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="generator" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-4">
            <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
            Step 1: Generate Content
          </div>
          <h2 className="text-3xl font-bold font-lora text-slate-900 mb-4">Create Your Pitch Deck</h2>
          <p className="text-lg text-slate-600">AI-powered pitch generation with authentic African market data and cultural themes</p>
        </div>

        {!isGenerating && !generatedPitch && (
          <Card className="bg-white shadow-lg border border-slate-200">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(startGeneration)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700">
                            Industry Sector
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="agritech">🌾 AgriTech - Smart Farming & Food Security</SelectItem>
                              <SelectItem value="fintech">💰 FinTech - Digital Banking & Payments</SelectItem>
                              <SelectItem value="healthtech">🏥 HealthTech - Digital Healthcare Solutions</SelectItem>
                              <SelectItem value="edtech">📚 EdTech - Educational Technology</SelectItem>
                              <SelectItem value="cleantech">🌱 CleanTech - Renewable Energy & Environment</SelectItem>
                              <SelectItem value="ecommerce">🛒 E-commerce - Digital Marketplace</SelectItem>
                              <SelectItem value="logistics">🚚 Logistics - Supply Chain & Delivery</SelectItem>
                              <SelectItem value="mobility">🚗 Mobility - Transportation Solutions</SelectItem>
                              <SelectItem value="manufacturing">🏭 Manufacturing - Industry 4.0</SelectItem>
                              <SelectItem value="mining">⛏️ Mining & Resources</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700">
                            Target Country
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* African Markets (Featured) */}
                              <SelectItem value="nigeria">🇳🇬 Nigeria - West Africa's Economic Hub</SelectItem>
                              <SelectItem value="kenya">🇰🇪 Kenya - East Africa's Innovation Center</SelectItem>
                              <SelectItem value="south-africa">🇿🇦 South Africa - Gateway to Southern Africa</SelectItem>
                              <SelectItem value="ghana">🇬🇭 Ghana - Stable Democracy & Growing Economy</SelectItem>
                              <SelectItem value="egypt">🇪🇬 Egypt - North Africa's Largest Market</SelectItem>
                              <SelectItem value="rwanda">🇷🇼 Rwanda - Tech Hub & Business Friendly</SelectItem>
                              <SelectItem value="uganda">🇺🇬 Uganda - Pearl of Africa</SelectItem>
                              <SelectItem value="tanzania">🇹🇿 Tanzania - Large Agricultural Market</SelectItem>
                              <SelectItem value="morocco">🇲🇦 Morocco - North Africa Gateway</SelectItem>
                              <SelectItem value="senegal">🇸🇳 Senegal - West Africa Stability</SelectItem>
                              <SelectItem value="ethiopia">🇪🇹 Ethiopia - Horn of Africa Leader</SelectItem>
                              <SelectItem value="ivory-coast">🇨🇮 Côte d'Ivoire - Economic Powerhouse</SelectItem>
                              {/* Global Markets */}
                              <SelectItem value="united-states">🇺🇸 United States</SelectItem>
                              <SelectItem value="united-kingdom">🇬🇧 United Kingdom</SelectItem>
                              <SelectItem value="germany">🇩🇪 Germany</SelectItem>
                              <SelectItem value="france">🇫🇷 France</SelectItem>
                              <SelectItem value="canada">🇨🇦 Canada</SelectItem>
                              <SelectItem value="australia">🇦🇺 Australia</SelectItem>
                              <SelectItem value="singapore">🇸🇬 Singapore</SelectItem>
                              <SelectItem value="uae">🇦🇪 United Arab Emirates</SelectItem>
                              <SelectItem value="india">🇮🇳 India</SelectItem>
                              <SelectItem value="brazil">🇧🇷 Brazil</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">
                          Business Type
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3"
                          >
                            {[
                              { value: "startup", label: "🚀 Early-stage Startup" },
                              { value: "scaleup", label: "📈 Growth-stage Scale-up" },
                              { value: "sme", label: "🏢 Small-Medium Enterprise" },
                              { value: "social", label: "🤝 Social Impact Venture" },
                            ].map((option) => (
                              <div key={option.value} className="flex items-center space-x-2 p-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                <RadioGroupItem value={option.value} id={option.value} />
                                <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">
                          Business Description <span className="text-slate-400">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Example: Smart irrigation system for smallholder farmers in rural Kenya, using IoT sensors to optimize water usage and increase crop yields by 40%..."
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-900 mb-3">Your pitch deck will include:</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-600">
                      {[
                        "Problem Statement",
                        "Solution Overview",
                        "Market Size Analysis",
                        "Business Model",
                        "Financial Projections",
                        "Competition Analysis",
                        "Go-to-Market Strategy",
                        "Team & Funding Ask",
                      ].map((item) => (
                        <div key={item} className="flex items-center">
                          <Check className="w-4 h-4 text-accent mr-2" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={generateMutation.isPending}
                      className="flex-1 bg-primary text-white hover:bg-blue-700 flex items-center justify-center"
                      size="lg"
                    >
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Pitch Deck
                    </Button>
                    <div className="flex items-center justify-center px-4 py-2 text-sm text-slate-500">
                      <Info className="w-4 h-4 mr-2" />
                      ~2 minutes to complete
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {isGenerating && (
          <Card className="bg-white shadow-lg border border-slate-200">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Settings className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Generating Your Pitch Deck</h3>
                <p className="text-slate-600 mb-6">Our AI is analyzing your business and creating a professional pitch deck...</p>
                <Progress value={progress} className="w-full mb-4" />
                <div className="text-sm text-slate-500">{loadingMessage}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {generatedPitch && (
          <Card className="bg-white shadow-lg border border-slate-200">
            <div className="p-8 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-slate-900">Your Pitch Deck is Ready!</h3>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  Generated just now
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-slate-600">10 professionally crafted slides tailored to your business</p>
                {generatedPitch.isWatermarked && (
                  <div className="flex items-center space-x-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm">
                    <Info className="w-4 h-4" />
                    <span>Free version includes watermark</span>
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Slide Overview</h4>
                  <div className="space-y-2 text-sm">
                    {generatedPitch.content.slides.slice(0, 5).map((slide) => (
                      <div key={slide.slideNumber} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span>{slide.slideNumber}. {slide.title}</span>
                        {slide.imageUrl && (
                          <div className="flex items-center space-x-2">
                            <Palette className="w-4 h-4 text-blue-500" />
                            <Check className="w-4 h-4 text-accent" />
                          </div>
                        )}
                        {!slide.imageUrl && <Check className="w-4 h-4 text-accent" />}
                      </div>
                    ))}
                  </div>
                  
                  {generatedPitch.content?.generatedWith && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center text-blue-700 text-sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Generated with {generatedPitch.content.generatedWith}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Key Insights</h4>
                  <div className="space-y-3 text-sm">
                    {generatedPitch.content.insights ? (
                      <>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span>{generatedPitch.content.insights.marketSize}</span>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span>{generatedPitch.content.insights.revenueProjection}</span>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span>{generatedPitch.content.insights.competitiveAdvantage}</span>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span>{generatedPitch.content.insights.marketStrategy}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span>Pitch generated successfully with professional quality content</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {generatedPitch.isWatermarked && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Upgrade to Premium</h4>
                      <p className="text-slate-600 text-sm mb-4">
                        Remove watermarks and get a professional presentation ready for investors
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center">
                          <Check className="w-4 h-4 text-accent mr-1" />
                          Watermark-free PDF
                        </div>
                        <div className="flex items-center">
                          <Check className="w-4 h-4 text-accent mr-1" />
                          High-quality export
                        </div>
                        <div className="flex items-center">
                          <Check className="w-4 h-4 text-accent mr-1" />
                          Commercial use license
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">$5 USD</div>
                      <div className="text-sm text-slate-500">One-time payment</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Button 
                      onClick={handleUpgradeClick}
                      className="flex-1 bg-primary text-white hover:bg-blue-700"
                    >
                      Upgrade Now - Pay with Card
                    </Button>
                  </div>
                </div>
              )}

              {/* Enhanced Download Options */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Download Formats</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleFormatDownload('PDF', generatedPitch.pdfUrl || '')}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFormatDownload('PowerPoint', '/api/download/pptx')}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PowerPoint
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFormatDownload('HTML', '/api/download/html')}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    HTML
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFormatDownload('Images', '/api/download/images')}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Images
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-primary text-white hover:bg-blue-700 flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {generatedPitch.isWatermarked ? "Download PDF (with watermark)" : "Download PDF"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const element = document.getElementById('pitch-deck-customizer');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                      toast({
                        title: "Next Step",
                        description: "Now customize your pitch deck with templates and themes below"
                      });
                    }
                  }}
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center"
                >
                  <Palette className="w-5 h-5 mr-2" />
                  Customize Design
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(true)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
