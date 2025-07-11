import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, FileText, MessageSquare, Eye, Edit3, Share2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Workspace {
  id: string;
  name: string;
  type: 'proposal' | 'business_plan' | 'resume' | 'pitch_deck';
  participants: Participant[];
  documents: WorkspaceDocument[];
  createdAt: string;
  status: 'active' | 'completed' | 'archived';
}

interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  isOnline: boolean;
}

interface WorkspaceDocument {
  id: string;
  name: string;
  type: 'template' | 'draft' | 'final';
  lastEditedBy: string;
  lastEditedAt: string;
  changes: number;
  comments: number;
}

export default function CollaborationWorkspace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const { toast } = useToast();

  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    type: 'proposal' as const,
    participants: [{ name: '', email: '', role: 'editor' as const }]
  });

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const response = await fetch('/api/collab/workspaces');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWorkspaces(data.workspaces || []);
        }
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspace.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a workspace name to continue",
        variant: "destructive"
      });
      return;
    }

    if (newWorkspace.name.length < 3) {
      toast({
        title: "Name Too Short",
        description: "Workspace name must be at least 3 characters",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/collab/workspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newWorkspace.name.trim(),
          type: newWorkspace.type,
          participants: newWorkspace.participants.filter(p => p.name?.trim() && p.email?.trim())
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setWorkspaces([...workspaces, data.workspace]);
        setNewWorkspace({
          name: '',
          type: 'proposal',
          participants: [{ name: '', email: '', role: 'editor' }]
        });
        
        toast({
          title: "Workspace Created Successfully",
          description: `"${data.workspace.name}" is ready for collaboration`,
        });
      } else {
        throw new Error(data.error || 'Failed to create workspace');
      }
    } catch (error) {
      console.error('Workspace creation error:', error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const addParticipant = () => {
    setNewWorkspace({
      ...newWorkspace,
      participants: [...newWorkspace.participants, { name: '', email: '', role: 'editor' }]
    });
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const updated = [...newWorkspace.participants];
    updated[index] = { ...updated[index], [field]: value };
    setNewWorkspace({ ...newWorkspace, participants: updated });
  };

  const removeParticipant = (index: number) => {
    const updated = newWorkspace.participants.filter((_, i) => i !== index);
    setNewWorkspace({ ...newWorkspace, participants: updated });
  };

  const openWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    // In a real app, this would navigate to the workspace detail page
    toast({
      title: "Opening Workspace",
      description: `Accessing "${workspace.name}" collaboration space`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'proposal': return '📋';
      case 'business_plan': return '📊';
      case 'resume': return '👤';
      case 'pitch_deck': return '🎯';
      default: return '📄';
    }
  };

  return (
    <section id="collaboration" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            <Users className="w-4 h-4 mr-2" />
            Collaboration Hub
          </div>
          <h2 className="text-3xl font-bold font-lora text-slate-900 mb-4">
            Real-Time Collaboration Workspace
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Work together on proposals, business plans, and documents with tracked changes, comments, and real-time collaboration
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create New Workspace */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create Workspace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  placeholder="Grant Proposal Q2 2024"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="workspace-type">Document Type</Label>
                <Select 
                  value={newWorkspace.type} 
                  onValueChange={(value: any) => setNewWorkspace({ ...newWorkspace, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proposal">📋 Grant Proposal</SelectItem>
                    <SelectItem value="business_plan">📊 Business Plan</SelectItem>
                    <SelectItem value="resume">👤 Resume/CV</SelectItem>
                    <SelectItem value="pitch_deck">🎯 Pitch Deck</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Team Members</Label>
                <div className="space-y-3">
                  {newWorkspace.participants.map((participant, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Name"
                        value={participant.name}
                        onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={participant.email}
                        onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                      />
                      <Select 
                        value={participant.role}
                        onValueChange={(value) => updateParticipant(index, 'role', value)}
                      >
                        <SelectTrigger className="col-span-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="reviewer">Reviewer</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      {newWorkspace.participants.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeParticipant(index)}
                          className="col-span-1"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addParticipant}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </div>

              <Button 
                onClick={createWorkspace} 
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Create Workspace
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Active Workspaces */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Your Workspaces</h3>
              <p className="text-slate-600">Manage and access your collaborative projects</p>
            </div>

            {workspaces.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-900 mb-2">No workspaces yet</h4>
                  <p className="text-slate-600 mb-4">Create your first collaboration workspace to get started</p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Workspace
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {workspaces.map((workspace) => (
                  <Card key={workspace.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{getTypeIcon(workspace.type)}</span>
                            <h4 className="text-lg font-semibold text-slate-900">{workspace.name}</h4>
                            <Badge className={`ml-3 ${getStatusColor(workspace.status)}`}>
                              {workspace.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {workspace.participants.length} members
                            </span>
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              {workspace.documents.length} documents
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(workspace.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                              {workspace.participants.slice(0, 4).map((participant, index) => (
                                <Avatar key={index} className="w-8 h-8 border-2 border-white">
                                  <AvatarFallback className="text-xs">
                                    {participant.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {workspace.participants.length > 4 && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-600">
                                  +{workspace.participants.length - 4}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-auto">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => openWorkspace(workspace)}
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Open
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Collaboration Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Real-Time Editing</h4>
              <p className="text-sm text-slate-600">
                Collaborate simultaneously with tracked changes and live cursor positions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Comments & Reviews</h4>
              <p className="text-sm text-slate-600">
                Add contextual comments and approve changes with review workflows
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Smart Sharing</h4>
              <p className="text-sm text-slate-600">
                Role-based permissions with secure sharing and version control
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}