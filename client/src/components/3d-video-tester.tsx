import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Video, Play, Download, Clock, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface VideoGeneration {
  id: string;
  prompt: string;
  style: string;
  duration: number;
  status: 'processing' | 'completed' | 'failed';
  estimatedTime: number;
  previewUrl?: string;
  downloadUrl?: string;
}

export default function ThreeDVideoTester() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('professional');
  const [duration, setDuration] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<VideoGeneration | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoStreamUrl, setVideoStreamUrl] = useState<string>('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please enter a description for your 3D video",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideo(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await apiRequest('POST', '/api/generate-3d-video', {
        prompt,
        style,
        duration
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (data.success) {
        setGeneratedVideo(data.video);
        toast({
          title: "3D Video Generation Started",
          description: data.message,
        });
      } else {
        throw new Error('Generation failed');
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Unable to generate 3D video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoPreview = async (videoId: string) => {
    try {
      // Open AI video pitch concept in new window
      const previewUrl = `/api/3d-video-stream/${videoId}`;
      window.open(previewUrl, '_blank', 'width=1200,height=800');
      
      toast({
        title: "AI Video Pitch Opened",
        description: "Your AI-generated video pitch concept is now playing in a new window."
      });
    } catch (error) {
      toast({
        title: "Preview Failed",
        description: "Failed to open video pitch preview. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVideoDownload = async (videoId: string) => {
    try {
      // Direct download of HTML presentation file
      const downloadUrl = `/api/download/3d-video/${videoId}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `ai-video-pitch-${videoId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Your AI video pitch presentation is downloading as an HTML file."
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the AI video pitch. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    if (generatedVideo) {
      handleVideoDownload(generatedVideo.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-600" />
            Free 3D Video Testing
            <Badge variant="secondary" className="ml-2">No Upgrade Required</Badge>
          </CardTitle>
          <p className="text-slate-600">
            Test our 3D video generation capabilities at no cost. Perfect for previewing before upgrading.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Video Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your 3D video concept... e.g., 'A professional business presentation with floating charts and smooth camera movements'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="style">Video Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select video style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="dynamic">Dynamic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 10)}
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating 3D Video...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Free 3D Video
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              {isGenerating && (
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Processing your 3D video...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-slate-600">
                      Creating 3D elements and animations
                    </p>
                  </div>
                </Card>
              )}

              {generatedVideo && (
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Video Generated Successfully!</span>
                      <Badge variant="outline">Free Preview</Badge>
                    </div>
                    
                    <div className="bg-slate-100 rounded-lg p-4 text-center">
                      <Video className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600 mb-3">
                        3D Video Preview: {generatedVideo.duration}s • {style} style
                      </p>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleVideoPreview(generatedVideo.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Preview Video
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={handleDownload}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Video
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <p>• Free preview includes watermark</p>
                      <p>• Upgrade for full HD without watermark</p>
                      <p>• Advanced animations available in paid plans</p>
                    </div>
                  </div>
                </Card>
              )}

              {!isGenerating && !generatedVideo && (
                <Card className="p-4 border-dashed border-2 border-slate-200">
                  <div className="text-center text-slate-500">
                    <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your generated 3D video will appear here</p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Free 3D Video Testing Includes:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Preview quality 3D video generation</li>
              <li>• Multiple style options (Professional, Creative, Minimal, Dynamic)</li>
              <li>• Up to 30-second videos</li>
              <li>• No credit card required</li>
              <li>• Instant generation and download</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Video Player Modal */}
      {showVideoPlayer && videoStreamUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">3D Video Preview</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowVideoPlayer(false)}
              >
                ✕
              </Button>
            </div>
            <video 
              src={videoStreamUrl} 
              controls 
              className="w-full rounded-lg"
              autoPlay
            />
            <div className="mt-4 text-sm text-slate-600">
              <p>This is a sample video demonstrating the 3D video generation capability.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}