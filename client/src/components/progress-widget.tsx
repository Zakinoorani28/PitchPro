import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Play, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  RotateCcw 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface DocumentProgress {
  id: string;
  type: 'pitch_deck' | 'business_plan' | 'resume' | 'proposal';
  title: string;
  progress: number;
  lastModified: string;
  status: 'draft' | 'in_progress' | 'completed';
  estimatedTimeRemaining: number; // in minutes
}

export default function ProgressWidget() {
  const [activeDocument, setActiveDocument] = useState<DocumentProgress | null>(null);

  // Fetch user's recent document progress
  const { data: progressData } = useQuery({
    queryKey: ['/api/user/progress'],
    queryFn: () => apiRequest('GET', '/api/user/progress').then(res => res.json()),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const mockProgressData: DocumentProgress[] = [
    {
      id: 'doc_1',
      type: 'pitch_deck',
      title: 'AgriTech Kenya Pitch',
      progress: 65,
      lastModified: '2024-06-17T10:30:00Z',
      status: 'in_progress',
      estimatedTimeRemaining: 8
    },
    {
      id: 'doc_2',
      type: 'business_plan',
      title: 'Solar Energy Business Plan',
      progress: 30,
      lastModified: '2024-06-16T14:15:00Z',
      status: 'draft',
      estimatedTimeRemaining: 25
    },
    {
      id: 'doc_3',
      type: 'resume',
      title: 'Professional CV',
      progress: 100,
      lastModified: '2024-06-15T09:45:00Z',
      status: 'completed',
      estimatedTimeRemaining: 0
    }
  ];

  const documents = progressData || mockProgressData;
  
  useEffect(() => {
    if (!documents || documents.length === 0) return;
    
    const inProgressDocs = documents.filter((doc: DocumentProgress) => doc.status === 'in_progress');
    
    if (inProgressDocs.length > 0) {
      setActiveDocument(inProgressDocs[0]);
    } else {
      const mostRecentDoc = [...documents].sort((a: DocumentProgress, b: DocumentProgress) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      )[0];
      setActiveDocument(mostRecentDoc);
    }
  }, [progressData]);

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pitch_deck': return <Play className="w-4 h-4" />;
      case 'business_plan': return <FileText className="w-4 h-4" />;
      case 'resume': return <FileText className="w-4 h-4" />;
      case 'proposal': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes === 0) return 'Complete';
    if (minutes < 60) return `${minutes} min remaining`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m remaining`;
  };

  const handleResumeDocument = (docId: string) => {
    // Navigate to document editor with the specific document
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      const route = doc.type === 'pitch_deck' ? '/gamma-demo' : '/documents';
      window.location.href = `${route}?resume=${docId}`;
    }
  };

  const handleStartNew = () => {
    window.location.href = '/documents';
  };

  if (!activeDocument) {
    return (
      <Card className="border-2 border-dashed border-gray-200">
        <CardContent className="p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Start Your First Document</h3>
          <p className="text-gray-600 mb-4">Create professional business documents with AI assistance</p>
          <Button onClick={handleStartNew} className="bg-green-600 hover:bg-green-700">
            <FileText className="w-4 h-4 mr-2" />
            Create Document
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-green-600 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              {getDocumentIcon(activeDocument.type)}
            </div>
            <span>Continue Your Document</span>
          </div>
          <Badge className={getStatusColor(activeDocument.status)}>
            {activeDocument.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
            {activeDocument.status === 'in_progress' && <Clock className="w-3 h-3 mr-1" />}
            {activeDocument.status === 'draft' && <RotateCcw className="w-3 h-3 mr-1" />}
            {activeDocument.status.replace('_', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-slate-900">{activeDocument.title}</h4>
            <span className="text-sm text-slate-600">
              {activeDocument.progress}% complete
            </span>
          </div>
          <Progress 
            value={activeDocument.progress} 
            className="h-2"
            style={{
              '--progress-color': activeDocument.status === 'completed' ? '#16a34a' : '#3b82f6'
            } as React.CSSProperties}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatTimeRemaining(activeDocument.estimatedTimeRemaining)}</span>
          </div>
          <span>
            Last edited: {new Date(activeDocument.lastModified).toLocaleDateString()}
          </span>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={() => handleResumeDocument(activeDocument.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={activeDocument.status === 'completed'}
          >
            {activeDocument.status === 'completed' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                View Document
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume Work
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleStartNew}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            Start New
          </Button>
        </div>

        {/* Other In-Progress Documents */}
        {inProgressDocs.length > 1 && (
          <div className="border-t pt-3">
            <h5 className="text-sm font-medium text-slate-700 mb-2">
              Other documents in progress ({inProgressDocs.length - 1})
            </h5>
            <div className="space-y-2">
              {inProgressDocs.slice(1, 3).map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
                  onClick={() => setActiveDocument(doc)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-slate-500">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {doc.title.length > 20 ? `${doc.title.substring(0, 20)}...` : doc.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">{doc.progress}%</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}