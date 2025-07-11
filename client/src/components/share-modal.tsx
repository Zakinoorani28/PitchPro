import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Mail, MessageSquare, Link, QrCode, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title: string;
    type: 'pitch_deck' | '3d_video' | 'document';
    id: string;
    previewUrl?: string;
  };
}

export default function ShareModal({ isOpen, onClose, content }: ShareModalProps) {
  const [shareMessage, setShareMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/shared/${content.type}/${content.id}`;
  const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0"></iframe>`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the link",
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = async () => {
    if (!recipientEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter recipient email address",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      const response = await fetch('/api/share/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          shareUrl,
          contentTitle: content.title,
          contentType: content.type,
          message: shareMessage.trim()
        })
      });

      if (response.ok) {
        toast({
          title: "Email Sent",
          description: `Share link sent to ${recipientEmail}`,
        });
        setRecipientEmail('');
        setShareMessage('');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to send email. Please try copying the link instead.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = `Check out this ${content.type.replace('_', ' ')}: ${content.title}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
    return qrUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share {content.title}</span>
          </DialogTitle>
          <DialogDescription>
            Share your {content.type.replace('_', ' ')} with collaborators, investors, or team members
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div>
              <Label htmlFor="share-url">Share Link</Label>
              <div className="flex space-x-2">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyLink} variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Label>QR Code</Label>
              <div className="mt-2">
                <img 
                  src={generateQRCode()} 
                  alt="QR Code" 
                  className="mx-auto border rounded"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div>
              <Label htmlFor="recipient-email">Recipient Email</Label>
              <Input
                id="recipient-email"
                type="email"
                placeholder="investor@company.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="share-message">Personal Message (Optional)</Label>
              <Textarea
                id="share-message"
                placeholder="Hi! I'd like to share my latest pitch deck with you..."
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleEmailShare} 
              disabled={isSharing}
              className="w-full"
            >
              {isSharing ? (
                <>Sending...</>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSocialShare('whatsapp')}
                className="justify-start"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Share on WhatsApp
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleSocialShare('linkedin')}
                className="justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share on LinkedIn
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleSocialShare('twitter')}
                className="justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share on Twitter
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div>
              <Label htmlFor="embed-code">Embed Code</Label>
              <Textarea
                id="embed-code"
                value={embedCode}
                readOnly
                className="font-mono text-sm"
                rows={3}
              />
            </div>
            
            <Button 
              onClick={() => navigator.clipboard.writeText(embedCode)}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Embed Code
            </Button>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Embedded content will be publicly accessible. 
                Ensure sensitive information is protected before embedding.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}