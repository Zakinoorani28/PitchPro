import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import FileUploadZone from './file-upload-zone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Briefcase, 
  User, 
  Building, 
  Target,
  DollarSign,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe,
  Users,
  Crown,
  Lock,
  Zap,
  Scale,
  Award,
  Shield,
  Brain
} from 'lucide-react';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl?: string;
  };
  targetIndustry: string;
  experience: string;
  skills: string;
  education: string;
  achievements: string;
}

interface BusinessPlanData {
  businessName: string;
  businessType: string;
  market: string;
  targetRevenue: number;
  competitors: string;
  referenceUrl?: string;
  description: string;
}

interface GeneratedDocument {
  content: string;
  score?: number;
  previewUrl?: string;
  financials?: any;
  charts?: string[];
}

interface TemplateCategory {
  category: string;
  templates: {
    free: string[];
    premium: string[];
  };
  totalCount: number;
  accessibleCount: number;
}

interface Template {
  name: string;
  description: string;
  category: string;
  tier: 'free' | 'premium';
  sections: string[];
}

export default function DocumentGenerator() {
  const [activeTab, setActiveTab] = useState('resume');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [documentContext, setDocumentContext] = useState<any>({});
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [userId] = useState('demo_user_001'); // In production, get from auth
  const { toast } = useToast();

  // Fetch template categories
  const { data: templateData } = useQuery({
    queryKey: ['/api/templates/categories'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/templates/categories');
      return response.json();
    }
  });

  const resumeMutation = useMutation({
    mutationFn: async (data: ResumeData) => {
      const response = await apiRequest('POST', '/api/documents/generate-resume', data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedDoc(data);
      toast({
        title: "Resume Generated",
        description: `ATS Score: ${data.score}% - ${data.score >= 80 ? 'Excellent!' : data.score >= 60 ? 'Good' : 'Needs improvement'}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate resume",
        variant: "destructive",
      });
    }
  });

  const businessPlanMutation = useMutation({
    mutationFn: async (data: BusinessPlanData) => {
      const response = await apiRequest('POST', '/api/documents/generate-business-plan', data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedDoc(data);
      toast({
        title: "Business Plan Generated",
        description: "Your comprehensive business plan is ready for download!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate business plan",
        variant: "destructive",
      });
    }
  });

  // Template generation mutation
  const templateMutation = useMutation({
    mutationFn: async (data: { templateName: string; formData: any }) => {
      const response = await apiRequest('POST', '/api/documents/generate-from-template', data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedDoc(data);
      toast({
        title: "Document Generated",
        description: `Your ${data.template.name} is ready!`,
      });
    },
    onError: (error: any) => {
      if (error.status === 403) {
        toast({
          title: "Premium Template",
          description: "This template requires a premium subscription",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: error.message || "Failed to generate document",
          variant: "destructive",
        });
      }
    }
  });

  // Enhanced contextual generation mutation
  const contextualMutation = useMutation({
    mutationFn: async (data: { documentType: string; baseData: any; context: any }) => {
      const response = await apiRequest('POST', '/api/intelligence/generate-contextual', {
        documentType: data.documentType,
        baseData: data.baseData,
        context: { ...documentContext, ...data.context },
        userId
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedDoc({
        content: data.content,
        score: data.metadata?.confidence_score ? Math.round(data.metadata.confidence_score * 100) : undefined,
        financials: data.metadata?.financials
      });
      toast({
        title: "Enhanced Document Generated",
        description: data.learning_applied ? "Applied your learned preferences!" : "Professional document created!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate contextual document",
        variant: "destructive",
      });
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business_plans': return Building;
      case 'proposals': return Target;
      case 'legal': return Scale;
      default: return FileText;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'business_plans': return 'Business Plans';
      case 'proposals': return 'Proposals & RFPs';
      case 'legal': return 'Legal Documents';
      default: return category;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';  
  };

  const handleResumeGenerate = (formData: FormData) => {
    const data: ResumeData = {
      personalInfo: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        location: formData.get('location') as string,
        linkedinUrl: formData.get('linkedinUrl') as string || undefined,
      },
      targetIndustry: formData.get('targetIndustry') as string,
      experience: formData.get('experience') as string,
      skills: formData.get('skills') as string,
      education: formData.get('education') as string,
      achievements: formData.get('achievements') as string,
    };

    // Use contextual generation if context is available
    if (Object.keys(documentContext).length > 0 || selectedFiles.length > 0) {
      contextualMutation.mutate({
        documentType: 'cv',
        baseData: data,
        context: { fileIds: selectedFiles }
      });
    } else {
      resumeMutation.mutate(data);
    }
  };

  const handleBusinessPlanGenerate = (formData: FormData) => {
    const data: BusinessPlanData = {
      businessName: formData.get('businessName') as string,
      businessType: formData.get('businessType') as string,
      market: formData.get('market') as string,
      targetRevenue: parseInt(formData.get('targetRevenue') as string),
      competitors: formData.get('competitors') as string,
      referenceUrl: formData.get('referenceUrl') as string || undefined,
      description: formData.get('description') as string,
    };

    // Use contextual generation if context is available
    if (Object.keys(documentContext).length > 0 || selectedFiles.length > 0) {
      contextualMutation.mutate({
        documentType: 'business_plan',
        baseData: data,
        context: { fileIds: selectedFiles }
      });
    } else {
      businessPlanMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">AI Document Generator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create professional documents with AI assistance. Generate ATS-optimized resumes, comprehensive business plans, and professional templates tailored for your industry.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="context" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Context</span>
          </TabsTrigger>
          <TabsTrigger value="resume" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Resume Builder</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Business Plan</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Generated Docs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="context" className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold">Document Intelligence Context</h2>
            <p className="text-gray-600">
              Upload files, analyze websites, and provide context to generate more accurate, personalized documents
            </p>
            {(Object.keys(documentContext).length > 0 || selectedFiles.length > 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-blue-800 text-sm font-medium">
                  ✓ Context configured! Your documents will be enhanced with:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedFiles.length > 0 && (
                    <Badge variant="outline" className="text-blue-700">
                      {selectedFiles.length} uploaded file{selectedFiles.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {documentContext.website_content && (
                    <Badge variant="outline" className="text-blue-700">
                      Website analysis
                    </Badge>
                  )}
                  {documentContext.company_profile && (
                    <Badge variant="outline" className="text-blue-700">
                      Company profile
                    </Badge>
                  )}
                  {documentContext.past_projects?.length > 0 && (
                    <Badge variant="outline" className="text-blue-700">
                      {documentContext.past_projects.length} project{documentContext.past_projects.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <FileUploadZone
            userId={userId}
            onFilesUploaded={(files) => {
              toast({
                title: "Files Ready",
                description: `${files.length} file(s) analyzed and ready for contextual generation`,
              });
            }}
            onContextUpdated={(context) => {
              setDocumentContext(prev => ({ ...prev, ...context }));
            }}
            selectedFiles={selectedFiles}
            onFileSelectionChange={setSelectedFiles}
          />
        </TabsContent>

        <TabsContent value="resume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>AI Resume Builder</span>
                <Badge variant="secondary">ATS Optimized</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleResumeGenerate(formData);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL (optional)</Label>
                    <Input id="linkedinUrl" name="linkedinUrl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetIndustry">Target Industry</Label>
                  <Select name="targetIndustry" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your target industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Work Experience</Label>
                  <Textarea 
                    id="experience" 
                    name="experience" 
                    placeholder="Describe your work experience, including job titles, companies, and key achievements..."
                    className="min-h-[100px]"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea 
                    id="skills" 
                    name="skills" 
                    placeholder="List your technical and soft skills..."
                    className="min-h-[80px]"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Textarea 
                    id="education" 
                    name="education" 
                    placeholder="Your educational background..."
                    className="min-h-[80px]"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements</Label>
                  <Textarea 
                    id="achievements" 
                    name="achievements" 
                    placeholder="Notable achievements, awards, certifications..."
                    className="min-h-[80px]"
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={resumeMutation.isPending}
                >
                  {resumeMutation.isPending ? 'Generating Resume...' : 'Generate AI Resume'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Business Plan Generator</span>
                <Badge variant="secondary">VC Ready</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleBusinessPlanGenerate(formData);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" name="businessName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select name="businessType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="fintech">FinTech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="market">Target Market</Label>
                  <Input 
                    id="market" 
                    name="market" 
                    placeholder="e.g., Small businesses in East Africa"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetRevenue">Target Annual Revenue (USD)</Label>
                  <Input 
                    id="targetRevenue" 
                    name="targetRevenue" 
                    type="number"
                    placeholder="e.g., 1000000"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitors">Main Competitors</Label>
                  <Input 
                    id="competitors" 
                    name="competitors" 
                    placeholder="List your main competitors"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referenceUrl">Reference URL (optional)</Label>
                  <Input 
                    id="referenceUrl" 
                    name="referenceUrl" 
                    placeholder="Website or document for additional context"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Describe your business model, value proposition, and key differentiators..."
                    className="min-h-[120px]"
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={businessPlanMutation.isPending}
                >
                  {businessPlanMutation.isPending ? 'Generating Business Plan...' : 'Generate Business Plan'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Professional Templates</h2>
            <p className="text-gray-600">Choose from our collection of industry-standard document templates</p>
          </div>

          {templateData?.categories ? (
            <div className="grid gap-6">
              {templateData.categories.map((category: TemplateCategory) => {
                const CategoryIcon = getCategoryIcon(category.category);
                return (
                  <Card key={category.category}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CategoryIcon className="h-5 w-5" />
                        <span>{getCategoryName(category.category)}</span>
                        <Badge variant="outline">
                          {category.totalCount} templates
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...category.templates.free, ...category.templates.premium].map((templateName) => {
                          const isPremium = category.templates.premium.includes(templateName);
                          return (
                            <div 
                              key={templateName}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedTemplate === templateName 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedTemplate(templateName)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium capitalize">
                                  {templateName.replace(/_/g, ' ')}
                                </h3>
                                {isPremium ? (
                                  <Crown className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <Zap className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                Professional {templateName.replace(/_/g, ' ')} template
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant={isPremium ? "secondary" : "default"}>
                                  {isPremium ? "Premium" : "Free"}
                                </Badge>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // This would open a form for the specific template
                                    toast({
                                      title: "Template Selected",
                                      description: `${templateName} template form would open here`,
                                    });
                                  }}
                                >
                                  Use Template
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading templates...</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {generatedDoc ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Generated Document</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedDoc.score && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">ATS Score</span>
                      <span className={`text-sm font-medium ${getScoreColor(generatedDoc.score)}`}>
                        {generatedDoc.score}% - {getScoreLabel(generatedDoc.score)}
                      </span>
                    </div>
                    <Progress value={generatedDoc.score} className="h-2" />
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Document Content Preview</h3>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {generatedDoc.content.substring(0, 500)}...
                  </div>
                </div>

                {generatedDoc.financials && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Financial Projections</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(generatedDoc.financials).map(([year, data]: [string, any]) => (
                        <div key={year} className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-blue-800 capitalize">{year}</div>
                          <div className="text-xs text-blue-600 space-y-1">
                            <div>Revenue: ${data.revenue?.toLocaleString()}</div>
                            <div>Profit: ${data.profit?.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Generated Yet</h3>
              <p className="text-gray-600">
                Generate your first document using the Resume Builder, Business Plan Generator, or Templates.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}