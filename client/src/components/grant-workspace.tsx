import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Globe,
  Smartphone,
  Wifi,
  WifiOff,
  Languages
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  team: {
    academia: string[];
    privateSector: string[];
    grantWriter?: string;
  };
  liveDocUrl?: string;
  evidence: Evidence[];
  approvals: Record<string, Approval>;
  status: 'draft' | 'review' | 'approved' | 'submitted';
  activity: Activity[];
  createdAt: string;
}

interface Evidence {
  id: string;
  filename: string;
  url: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
}

interface Approval {
  by: string;
  at: string;
  comment?: string;
}

interface Activity {
  timestamp: string;
  user: string;
  changes: Array<{
    field: string;
    old: any;
    new: any;
  }>;
}

export default function GrantWorkspace() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [newProposalDialog, setNewProposalDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Monitor online status for load-shedding mode
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Syncing your changes...",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Changes will be saved locally and synced when reconnected.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const { data: proposals = [] } = useQuery<Proposal[]>({
    queryKey: ['/api/collab/proposals'],
    enabled: isOnline,
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      academiaEmails: string[];
      companyEmails: string[];
    }) => {
      const response = await apiRequest('POST', '/api/collab/proposal', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/collab/proposals'] });
      setNewProposalDialog(false);
      toast({
        title: "Proposal Created",
        description: "Your collaborative workspace is ready!",
      });
    },
  });

  const uploadEvidenceMutation = useMutation({
    mutationFn: async (data: { file: File; proposalId: string }) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('proposal_id', data.proposalId);
      
      const response = await fetch('/api/collab/upload', {
        method: 'POST',
        body: formData,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/collab/proposals'] });
      toast({
        title: "Evidence Uploaded",
        description: "File has been tagged and added to the proposal.",
      });
    },
  });

  const approveSectionMutation = useMutation({
    mutationFn: async (data: {
      proposalId: string;
      section: string;
      comment?: string;
    }) => {
      const response = await apiRequest('POST', '/api/collab/approve', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/collab/proposals'] });
      toast({
        title: "Section Approved",
        description: "Your approval has been recorded.",
      });
    },
  });

  const handleCreateProposal = (data: {
    title: string;
    academiaEmails: string;
    companyEmails: string;
  }) => {
    createProposalMutation.mutate({
      title: data.title,
      academiaEmails: data.academiaEmails.split(',').map(email => email.trim()),
      companyEmails: data.companyEmails.split(',').map(email => email.trim()),
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, proposalId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadEvidenceMutation.mutate({ file, proposalId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header with Online Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grant Collaboration Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Work together on AfDB, GCF, and World Bank proposals
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Online Status */}
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline Mode'}
            </span>
          </div>

          {/* Create New Proposal */}
          <Dialog open={newProposalDialog} onOpenChange={setNewProposalDialog}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Users className="w-4 h-4 mr-2" />
                New Collaboration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Collaborative Proposal</DialogTitle>
                <DialogDescription>
                  Invite team members from academia and private sector
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateProposal({
                  title: formData.get('title') as string,
                  academiaEmails: formData.get('academiaEmails') as string,
                  companyEmails: formData.get('companyEmails') as string,
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Proposal Title</Label>
                    <Input name="title" placeholder="Digital Agriculture Initiative" required />
                  </div>
                  <div>
                    <Label htmlFor="academiaEmails">Academic Partners (emails)</Label>
                    <Input 
                      name="academiaEmails" 
                      placeholder="prof@university.ac.za, researcher@makerere.ug"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyEmails">Private Sector Partners (emails)</Label>
                    <Input 
                      name="companyEmails" 
                      placeholder="ceo@agritech.co.ke, partnerships@fintech.ng"
                    />
                  </div>
                  <Button type="submit" disabled={createProposalMutation.isPending}>
                    Create Workspace
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map((proposal: Proposal) => (
          <Card key={proposal.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {proposal.title}
                <Badge variant={
                  proposal.status === 'approved' ? 'default' :
                  proposal.status === 'review' ? 'secondary' : 'outline'
                }>
                  {proposal.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                Created {new Date(proposal.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Team Members */}
                <div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Users className="w-4 h-4 mr-1" />
                    Team ({proposal.team.academia.length + proposal.team.privateSector.length})
                  </div>
                  <div className="flex -space-x-2">
                    {[...proposal.team.academia, ...proposal.team.privateSector].slice(0, 4).map((email, index) => (
                      <Avatar key={index} className="w-8 h-8 border-2 border-white dark:border-gray-800">
                        <AvatarFallback className="text-xs">
                          {email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {proposal.team.academia.length + proposal.team.privateSector.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs border-2 border-white dark:border-gray-800">
                        +{proposal.team.academia.length + proposal.team.privateSector.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* Evidence Count */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FileText className="w-4 h-4 mr-1" />
                  {proposal.evidence.length} evidence files
                </div>

                {/* Recent Activity */}
                {proposal.activity.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Last updated by {proposal.activity[0].user}
                  </div>
                )}

                <Button 
                  onClick={() => setSelectedProposal(proposal.id)}
                  className="w-full"
                  variant="outline"
                >
                  Open Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Proposal Workspace */}
      {selectedProposal && (
        <ProposalWorkspace 
          proposalId={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onFileUpload={handleFileUpload}
          onApproveSection={approveSectionMutation.mutate}
          isOnline={isOnline}
        />
      )}
    </div>
  );
}

interface ProposalWorkspaceProps {
  proposalId: string;
  onClose: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, proposalId: string) => void;
  onApproveSection: (data: { proposalId: string; section: string; comment?: string }) => void;
  isOnline: boolean;
}

function ProposalWorkspace({ 
  proposalId, 
  onClose, 
  onFileUpload, 
  onApproveSection, 
  isOnline 
}: ProposalWorkspaceProps) {
  const { data: proposal } = useQuery<Proposal>({
    queryKey: ['/api/collab/proposals', proposalId],
    enabled: isOnline,
  });

  if (!proposal) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {proposal.title}
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600">Auto-translate</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="document" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="document">Live Document</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="document" className="h-full">
            <div className="h-96 border rounded-lg p-4">
              {proposal.liveDocUrl ? (
                <iframe 
                  src={proposal.liveDocUrl} 
                  className="w-full h-full border-0"
                  title="Live Document"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <FileText className="w-12 h-12 mb-4" />
                  <p>Live document will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="evidence">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Evidence Files</h3>
                <div>
                  <input
                    type="file"
                    id="evidence-upload"
                    className="hidden"
                    onChange={(e) => onFileUpload(e, proposalId)}
                  />
                  <Button onClick={() => document.getElementById('evidence-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Evidence
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="h-64">
                {proposal.evidence.map((file: Evidence) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <div className="flex space-x-1 mt-1">
                        {file.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="approvals">
            <div className="space-y-4">
              {['budget', 'technical', 'team', 'sustainability'].map((section) => (
                <div key={section} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">{section} Section</h4>
                    {proposal.approvals[section] ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approved
                      </div>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => onApproveSection({ 
                          proposalId, 
                          section, 
                          comment: 'Approved via workspace' 
                        })}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}
                  </div>
                  {proposal.approvals[section] && (
                    <p className="text-sm text-gray-600 mt-2">
                      Approved by {proposal.approvals[section].by} on{' '}
                      {new Date(proposal.approvals[section].at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ScrollArea className="h-64">
              {proposal.activity.map((activity: Activity, index: number) => (
                <div key={index} className="border-l-2 border-orange-200 pl-4 pb-4 ml-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {activity.changes.map((change, changeIndex) => (
                      <p key={changeIndex} className="text-sm">
                        Updated <strong>{change.field}</strong>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}