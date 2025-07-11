import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TemplateSelector from './template-selector';

export default function PitchDeckCustomizer() {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('agritech');
  const [selectedTheme, setSelectedTheme] = useState<string>('ubuntu-spirit');
  const { toast } = useToast();

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleTemplateConfirm = () => {
    if (!selectedTemplate || !selectedTheme) {
      toast({
        title: "Selection Required",
        description: "Please select both a template and theme before continuing.",
        variant: "destructive"
      });
      return;
    }

    setShowTemplateSelector(false);
    
    toast({
      title: "Template Applied",
      description: `Successfully applied ${selectedTemplate} template with ${selectedTheme} theme.`,
    });
  };

  return (
    <section className="py-16 bg-gray-50" id="pitch-deck-customizer">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Step 2: Customize Your Pitch Deck Design
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Apply professional templates and authentic African cultural themes to your generated content
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-sm text-blue-800">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span>Generate your pitch content first in the section above, then customize your design here</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Choose Your Design Style</CardTitle>
              <CardDescription>
                Select from 8 professional templates and 6 authentic African cultural themes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold text-lg mb-3">8 Professional Templates</h3>
                  <p className="text-sm text-gray-600 mb-4">Business-focused designs for different industries</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Modern Business</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">AgriTech</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Tech Startup</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">+5 more</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold text-lg mb-3">6 Cultural Themes</h3>
                  <p className="text-sm text-gray-600 mb-4">Celebrating African heritage and identity</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Ubuntu Spirit</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Sahara Gold</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Savanna Green</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">+3 more</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowTemplateSelector(true)}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Layout className="w-5 h-5 mr-2" />
                Browse Templates & Themes
              </Button>
              
              <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
                <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>Template & Theme Selection</DialogTitle>
                    <DialogDescription>
                      Choose a professional template and cultural theme for your pitch deck
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[70vh]">
                    <TemplateSelector 
                      selectedTemplate={selectedTemplate}
                      selectedTheme={selectedTheme}
                      onTemplateSelect={handleTemplateSelect}
                      onThemeSelect={handleThemeSelect}
                      onConfirm={handleTemplateConfirm}
                    />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}