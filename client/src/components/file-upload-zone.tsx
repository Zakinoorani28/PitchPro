import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  File, 
  X, 
  Check, 
  AlertCircle, 
  Globe, 
  Brain,
  FileText,
  Download,
  Zap
} from 'lucide-react';

interface UploadedFile {
  id: number;
  originalName: string;
  insights: string[];
  size: number;
  uploadedAt: string;
}

interface FileUploadZoneProps {
  userId: string;
  onFilesUploaded: (files: UploadedFile[]) => void;
  onContextUpdated: (context: any) => void;
  selectedFiles: number[];
  onFileSelectionChange: (fileIds: number[]) => void;
}

export default function FileUploadZone({ 
  userId, 
  onFilesUploaded, 
  onContextUpdated,
  selectedFiles,
  onFileSelectionChange 
}: FileUploadZoneProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [companyProfile, setCompanyProfile] = useState('');
  const [pastProjects, setPastProjects] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const { toast } = useToast();

  // Fetch user's uploaded files
  const { data: userFiles, refetch: refetchFiles } = useQuery({
    queryKey: ['/api/intelligence/files', userId],
    queryFn: async () => {
      if (userId === 'anonymous') return { files: [] };
      const response = await apiRequest('GET', `/api/intelligence/files/${userId}`);
      return response.json();
    },
    enabled: userId !== 'anonymous'
  });

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('userId', userId);

      const response = await fetch('/api/intelligence/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Files Uploaded",
        description: `Successfully analyzed ${data.files.length} file(s)`,
      });
      onFilesUploaded(data.files);
      refetchFiles();
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    }
  });

  // Website analysis mutation
  const websiteAnalysisMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/intelligence/analyze-website', {
        url,
        userId
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Website Analyzed",
        description: "Successfully extracted content and brand voice",
      });
      onContextUpdated({
        website_url: data.url,
        website_content: data.content
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive",
      });
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadMutation.mutate(acceptedFiles);
    }
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/csv': ['.csv']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleWebsiteAnalysis = () => {
    if (!websiteUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to analyze",
        variant: "destructive",
      });
      return;
    }
    websiteAnalysisMutation.mutate(websiteUrl);
  };

  const updateContext = () => {
    const contextData = {
      company_profile: companyProfile,
      past_projects: pastProjects.split('\n').filter(p => p.trim()),
      linkedin_profile: linkedinProfile,
      fileIds: selectedFiles
    };
    onContextUpdated(contextData);
    
    toast({
      title: "Context Updated",
      description: "Document context has been configured for enhanced generation",
    });
  };

  const toggleFileSelection = (fileId: number) => {
    const newSelection = selectedFiles.includes(fileId)
      ? selectedFiles.filter(id => id !== fileId)
      : [...selectedFiles, fileId];
    onFileSelectionChange(newSelection);
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* File Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Supporting Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to select files (PDF, DOC, DOCX, TXT, CSV)
            </p>
            <p className="text-xs text-gray-400">
              Max 5 files, 10MB each. Upload previous proposals, CVs, company profiles for context.
            </p>
          </div>

          {uploadMutation.isPending && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                <span className="text-sm text-gray-600">Analyzing uploaded files...</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Website Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Website Content Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="https://your-company.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleWebsiteAnalysis}
              disabled={websiteAnalysisMutation.isPending}
            >
              {websiteAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Extract company voice, services, and brand elements from your website
          </p>
        </CardContent>
      </Card>

      {/* Additional Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Additional Context</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyProfile">Company Profile</Label>
            <textarea
              id="companyProfile"
              className="w-full p-3 border rounded-lg min-h-[80px] resize-y"
              placeholder="Brief description of your company, mission, and key differentiators..."
              value={companyProfile}
              onChange={(e) => setCompanyProfile(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pastProjects">Past Projects (one per line)</Label>
            <textarea
              id="pastProjects"
              className="w-full p-3 border rounded-lg min-h-[80px] resize-y"
              placeholder="Project 1: Description&#10;Project 2: Description&#10;Project 3: Description"
              value={pastProjects}
              onChange={(e) => setPastProjects(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinProfile">LinkedIn Profile URL</Label>
            <Input
              id="linkedinProfile"
              placeholder="https://linkedin.com/in/your-profile"
              value={linkedinProfile}
              onChange={(e) => setLinkedinProfile(e.target.value)}
            />
          </div>

          <Button onClick={updateContext} className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Update Context for Enhanced Generation
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {userFiles?.files && userFiles.files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Your Uploaded Files</span>
              <Badge variant="outline">{userFiles.files.length} files</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userFiles.files.map((file: UploadedFile) => (
                <div 
                  key={file.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFiles.includes(file.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {selectedFiles.includes(file.id) ? (
                        <Check className="h-5 w-5 text-blue-600" />
                      ) : (
                        <File className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.originalName}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                      {file.insights && file.insights.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {file.insights.slice(0, 3).map((insight, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {insight}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Selected files will be used as context for document generation. 
                  Click files to select/deselect them.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}