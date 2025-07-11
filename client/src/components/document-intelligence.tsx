import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Image, 
  Link2, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Sparkles,
  Palette,
  Layout
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  insights?: any;
  patterns?: any;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

interface DocumentPattern {
  templateType: string;
  confidence: number;
  keyElements: string[];
  colorScheme: string[];
  layout: string;
  suggestions: string[];
}

export default function DocumentIntelligence() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [patterns, setPatterns] = useState<DocumentPattern[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading' as const
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (const file of acceptedFiles) {
      const fileId = `${Date.now()}-${file.name}`;
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', 'reference');

        // Update status to processing
        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'processing' } : f
        ));

        const response = await apiRequest('POST', '/api/documents/upload', formData);
        
        if (response.ok) {
          const result = await response.json();
          
          // Update file with results
          setFiles(prev => prev.map(f => 
            f.name === file.name ? { 
              ...f, 
              status: 'completed',
              insights: result.insights,
              patterns: result.patterns,
              url: result.url
            } : f
          ));

          toast({
            title: "Document Analyzed",
            description: `${file.name} has been processed and patterns extracted.`
          });
        }
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'error' } : f
        ));
        
        toast({
          title: "Upload Failed",
          description: `Failed to process ${file.name}`,
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt']
    },
    maxSize: 10485760 // 10MB
  });

  const analyzeWebsite = async () => {
    if (!websiteUrl) return;

    setIsAnalyzing(true);
    try {
      const response = await apiRequest('POST', '/api/documents/analyze-website', {
        url: websiteUrl,
        companyInfo,
        linkedinUrl
      });

      if (response.ok) {
        const result = await response.json();
        
        setFiles(prev => [...prev, {
          id: `website-${Date.now()}`,
          name: `Website: ${websiteUrl}`,
          type: 'website',
          size: 0,
          status: 'completed',
          insights: result.insights,
          patterns: result.patterns,
          url: websiteUrl
        }]);

        toast({
          title: "Website Analyzed",
          description: "Website content and patterns have been extracted."
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze website",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateDocument = async (type: string) => {
    const completedFiles = files.filter(f => f.status === 'completed');
    
    if (completedFiles.length === 0) {
      toast({
        title: "No Documents",
        description: "Please upload documents first to generate custom templates.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await apiRequest('POST', `/api/documents/generate-${type}`, {
        referenceFiles: completedFiles.map(f => f.id),
        applyPatterns: true,
        gammaQuality: true
      });

      if (response.ok) {
        const result = await response.json();
        
        // Download or open the generated document
        if (result.downloadUrl) {
          window.open(result.downloadUrl, '_blank');
        }

        toast({
          title: "Document Generated",
          description: `Your custom ${type} has been created with Gamma-quality styling.`
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: `Failed to generate ${type}`,
        variant: "destructive"
      });
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-5 h-5" />;
    if (type === 'website') return <Link2 className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'processing': return <Brain className="w-4 h-4 text-blue-500 animate-pulse" />;
      default: return <Upload className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Document Intelligence Studio
        </h2>
        <p className="text-lg text-slate-600">
          Upload your documents, analyze patterns, and generate Gamma-quality business documents
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
          <TabsTrigger value="patterns">View Patterns</TabsTrigger>
          <TabsTrigger value="generate">Generate Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* File Upload Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Reference Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files or click to browse'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: PDF, DOC, DOCX, PPT, PPTX, Images (max 10MB)
                </p>
                <Button variant="outline">Browse Files</Button>
              </div>
            </CardContent>
          </Card>

          {/* Website Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                Analyze Website & Social Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Website URL</label>
                <Input
                  placeholder="https://your-company.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn Profile (Optional)</label>
                <Input
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Information</label>
                <Textarea
                  placeholder="Brief description of your company, products, and target market..."
                  value={companyInfo}
                  onChange={(e) => setCompanyInfo(e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={analyzeWebsite} disabled={!websiteUrl || isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Website
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {file.size > 0 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Web content'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.status)}
                        <span className="text-sm capitalize">{file.status}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Extracted Patterns & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {files.filter(f => f.status === 'completed' && f.patterns).length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No patterns extracted yet. Upload documents to analyze.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {files
                    .filter(f => f.status === 'completed' && f.patterns)
                    .map((file) => (
                      <Card key={file.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{file.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {file.patterns && (
                            <>
                              <div>
                                <h4 className="font-medium mb-2">Document Type</h4>
                                <Badge variant="secondary">{file.patterns.templateType}</Badge>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Key Elements</h4>
                                <div className="flex flex-wrap gap-1">
                                  {file.patterns.keyElements?.map((element: string, idx: number) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {element}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Color Scheme</h4>
                                <div className="flex gap-2">
                                  {file.patterns.colorScheme?.map((color: string, idx: number) => (
                                    <div
                                      key={idx}
                                      className="w-8 h-8 rounded border"
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Layout Style</h4>
                                <Badge variant="outline">{file.patterns.layout}</Badge>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate Gamma-Quality Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => generateDocument('pitch-deck')}>
                  <div className="text-center">
                    <Layout className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">Pitch Deck</h3>
                    <p className="text-sm text-gray-600">
                      Create investor-ready presentations with your brand patterns
                    </p>
                    <Badge className="mt-2">Gamma Quality</Badge>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => generateDocument('business-plan')}>
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-green-500 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">Business Plan</h3>
                    <p className="text-sm text-gray-600">
                      Generate comprehensive business plans with custom styling
                    </p>
                    <Badge className="mt-2">Gamma Quality</Badge>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => generateDocument('proposal')}>
                  <div className="text-center">
                    <Palette className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">Proposal</h3>
                    <p className="text-sm text-gray-600">
                      Create winning proposals with learned design patterns
                    </p>
                    <Badge className="mt-2">Gamma Quality</Badge>
                  </div>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Gamma-Quality Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Professional typography and spacing</li>
                  <li>• Custom color schemes from your brand</li>
                  <li>• Smart layout optimization</li>
                  <li>• High-quality visual elements</li>
                  <li>• Industry-specific templates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}