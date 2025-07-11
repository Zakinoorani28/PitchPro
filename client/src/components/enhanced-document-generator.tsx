import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Wand2, Star, Crown, Palette, Upload, Link, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { monetization } from '@/lib/monetization';
import TemplateSelector from './template-selector';

interface DocumentData {
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
  description: string;
}

export default function EnhancedDocumentGenerator() {
  const [activeTab, setActiveTab] = useState('resume');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documentPatterns, setDocumentPatterns] = useState<any>(null);
  const { toast } = useToast();

  const [resumeData, setResumeData] = useState<DocumentData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedinUrl: ''
    },
    targetIndustry: '',
    experience: '',
    skills: '',
    education: '',
    achievements: ''
  });

  const [businessPlanData, setBusinessPlanData] = useState<BusinessPlanData>({
    businessName: '',
    businessType: '',
    market: '',
    targetRevenue: 100000,
    competitors: '',
    description: ''
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUploadedFiles(prev => [...prev, data]);
        setDocumentPatterns(data.patterns);
        
        toast({
          title: "Document Analyzed Successfully",
          description: `${data.filename} processed and patterns extracted.`,
        });
      } else {
        throw new Error(data.error || 'Upload processing failed');
      }
    } catch (error) {
      console.error('Document upload error:', error);
      toast({
        title: "Upload Processing Failed",
        description: error instanceof Error ? error.message : "Please check file format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const analyzeWebsite = async () => {
    if (!websiteUrl) return;
    
    setIsAnalyzing(true);
    try {
      const response = await apiRequest('POST', '/api/documents/analyze-website', { url: websiteUrl });
      const data = await response.json();
      
      setDocumentPatterns(data.patterns);
      
      toast({
        title: "Website Analyzed!",
        description: "Brand patterns extracted from website.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze website. Please check the URL.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  const generateResume = async () => {
    if (!resumeData.personalInfo.name || !resumeData.targetIndustry) {
      toast({
        title: "Validation Error",
        description: "Name and target industry are required",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await apiRequest('POST', '/api/documents/generate-resume', {
        personalInfo: resumeData.personalInfo,
        targetIndustry: resumeData.targetIndustry,
        experience: resumeData.experience,
        skills: resumeData.skills,
        education: resumeData.education,
        achievements: resumeData.achievements,
        templateId: selectedTemplate
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      
      if (data.pdfBytes) {
        setGeneratedDocument(data);
        
        // Auto-download the PDF
        const blob = new Blob([Buffer.from(data.pdfBytes, 'base64')], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.name.replace(/\s+/g, '-')}-resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Resume Generated",
          description: `Professional resume created with ATS score: ${data.score}/100`,
        });
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate resume",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const generateBusinessPlan = async () => {
    if (!businessPlanData.businessName || !businessPlanData.businessType) {
      toast({
        title: "Validation Error",
        description: "Business name and type are required",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const response = await apiRequest('POST', '/api/documents/generate-business-plan', {
        ...businessPlanData,
        templateId: selectedTemplate
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      
      if (data.pdfBytes) {
        setGeneratedDocument(data);
        
        // Auto-download the PDF
        const blob = new Blob([Buffer.from(data.pdfBytes, 'base64')], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${businessPlanData.businessName.replace(/\s+/g, '-')}-business-plan.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Business Plan Generated",
          description: "Professional business plan created and downloaded",
        });
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate business plan",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
            <FileText className="w-4 h-4 mr-2" />
            Professional Documents
          </div>
          <h2 className="text-3xl font-bold font-lora text-slate-900 mb-4">
            AI-Powered Document Generation
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Create professional resumes and business plans with modern templates and automatic PDF generation
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="resume">Resume Builder</TabsTrigger>
            <TabsTrigger value="business_plan">Business Plan Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                        })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                        })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                        })}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                        })}
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Target Industry</Label>
                    <Select 
                      value={resumeData.targetIndustry}
                      onValueChange={(value) => setResumeData({ ...resumeData, targetIndustry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Skills (comma-separated)</Label>
                    <Textarea
                      value={resumeData.skills}
                      onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                      placeholder="JavaScript, React, Node.js, Python, SQL"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Experience</Label>
                    <Textarea
                      value={resumeData.experience}
                      onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                      placeholder="Describe your work experience..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Education</Label>
                    <Textarea
                      value={resumeData.education}
                      onChange={(e) => setResumeData({ ...resumeData, education: e.target.value })}
                      placeholder="Your educational background..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Key Achievements</Label>
                    <Textarea
                      value={resumeData.achievements}
                      onChange={(e) => setResumeData({ ...resumeData, achievements: e.target.value })}
                      placeholder="Major accomplishments, awards, projects..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <TemplateSelector
                  category="resume"
                  onSelect={setSelectedTemplate}
                  userTier="free"
                />

                {isGenerating && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <Wand2 className="w-8 h-8 text-blue-600 mx-auto animate-pulse" />
                        <h4 className="font-medium">Generating Your Resume</h4>
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-slate-600">
                          Creating professional PDF with ATS optimization...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={generateResume}
                  disabled={isGenerating || !selectedTemplate}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Resume...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Professional Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="business_plan" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Business Plan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Business Name</Label>
                    <Input
                      value={businessPlanData.businessName}
                      onChange={(e) => setBusinessPlanData({ ...businessPlanData, businessName: e.target.value })}
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <Label>Business Type</Label>
                    <Select 
                      value={businessPlanData.businessType}
                      onValueChange={(value) => setBusinessPlanData({ ...businessPlanData, businessType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech-startup">Tech Startup</SelectItem>
                        <SelectItem value="saas">SaaS Company</SelectItem>
                        <SelectItem value="e-commerce">E-commerce</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="fintech">FinTech</SelectItem>
                        <SelectItem value="healthtech">HealthTech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Target Market</Label>
                    <Input
                      value={businessPlanData.market}
                      onChange={(e) => setBusinessPlanData({ ...businessPlanData, market: e.target.value })}
                      placeholder="SME businesses in Africa"
                    />
                  </div>

                  <div>
                    <Label>Target Revenue (Year 3)</Label>
                    <Input
                      type="number"
                      value={businessPlanData.targetRevenue}
                      onChange={(e) => setBusinessPlanData({ ...businessPlanData, targetRevenue: parseInt(e.target.value) || 0 })}
                      placeholder="500000"
                    />
                  </div>

                  <div>
                    <Label>Key Competitors</Label>
                    <Textarea
                      value={businessPlanData.competitors}
                      onChange={(e) => setBusinessPlanData({ ...businessPlanData, competitors: e.target.value })}
                      placeholder="List your main competitors..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Business Description</Label>
                    <Textarea
                      value={businessPlanData.description}
                      onChange={(e) => setBusinessPlanData({ ...businessPlanData, description: e.target.value })}
                      placeholder="Describe your business concept, value proposition, and goals..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <TemplateSelector
                  category="business_plan"
                  onSelect={setSelectedTemplate}
                  userTier="free"
                />

                {isGenerating && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <Wand2 className="w-8 h-8 text-green-600 mx-auto animate-pulse" />
                        <h4 className="font-medium">Creating Business Plan</h4>
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-slate-600">
                          Generating comprehensive business plan with financial projections...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={generateBusinessPlan}
                  disabled={isGenerating || !selectedTemplate}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Business Plan...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Business Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Document Intelligence Enhancement Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Document Intelligence
            </CardTitle>
            <p className="text-slate-600">Upload documents or analyze websites to learn patterns and improve generation quality with OpenAI GPT-4o</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-purple-400 bg-purple-50' : 'border-slate-300 hover:border-purple-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-medium text-slate-900 mb-1">Upload Documents</h4>
                <p className="text-sm text-slate-600">
                  Drop PDF, Word docs, or images for AI pattern analysis
                </p>
                {isAnalyzing && (
                  <div className="mt-3">
                    <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
                    <p className="text-xs text-purple-600 mt-1">AI analyzing patterns...</p>
                  </div>
                )}
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                <Link className="w-8 h-8 text-slate-400 mx-auto mb-2 block" />
                <h4 className="font-medium text-slate-900 mb-2 text-center">Website Brand Analysis</h4>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://company-website.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                  <Button 
                    onClick={analyzeWebsite} 
                    disabled={!websiteUrl || isAnalyzing}
                    size="sm"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">AI extracts brand colors, typography, and design patterns</p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  AI Analysis Results
                </h5>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-700">{file.name}</span>
                      {file.insights && (
                        <p className="text-xs text-slate-500">
                          {file.insights.documentType} • {file.insights.industry} • Gamma Score: {file.patterns?.gammaQualityScore || 85}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      AI Processed
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {documentPatterns && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                <h5 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  AI-Extracted Design Patterns
                  <Badge className="text-xs bg-purple-100 text-purple-700">GPT-4o Analysis</Badge>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 font-medium mb-2">Brand Colors:</p>
                    <div className="flex gap-1 flex-wrap">
                      {documentPatterns.colorScheme?.slice(0, 5).map((color: string, i: number) => (
                        <div 
                          key={i} 
                          className="w-6 h-6 rounded border border-slate-200 shadow-sm" 
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium mb-2">Typography:</p>
                    <p className="font-medium text-slate-800">{documentPatterns.typography?.primaryFont || 'Inter'}</p>
                    <p className="text-xs text-slate-500">
                      {documentPatterns.typography?.headingSize} / {documentPatterns.typography?.bodySize}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium mb-2">Style:</p>
                    <p className="font-medium text-slate-800 capitalize">{documentPatterns.layout || 'Professional'}</p>
                    <p className="text-xs text-slate-500">
                      Quality Score: {documentPatterns.gammaQualityScore || 85}/100
                    </p>
                  </div>
                </div>
                {documentPatterns.brandElements && (
                  <div className="mt-4 pt-3 border-t border-purple-200">
                    <p className="text-xs text-slate-600">
                      <strong>Visual Style:</strong> {documentPatterns.brandElements.visualStyle} • 
                      <strong>Layout:</strong> {documentPatterns.layout}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Monetization Section */}
            <div id="bolt-monetization" className="mt-6">
              <div className="text-center py-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Unlock Advanced AI Features</h3>
                <p className="text-slate-600 mb-4">Get unlimited AI generations, OpenAI GPT-4o analysis, and Gamma-quality templates</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                    onClick={() => monetization.showUpgradeModal()}
                  >
                    Upgrade to Pro
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => monetization.updateCreditStatus()}
                  >
                    Check Credits
                  </Button>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  Bolt Hackathon Special: 50% off first month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {generatedDocument && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Document Generated Successfully</h4>
                  <p className="text-slate-600">
                    Your professional {activeTab === 'resume' ? 'resume' : 'business plan'} has been created and downloaded
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1" />
                    {activeTab === 'resume' ? `ATS Score: ${generatedDocument.score}/100` : 'Professional Quality'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}