import EnhancedDocumentGenerator from '@/components/enhanced-document-generator';
import AIComponentGenerator from '@/components/ai-component-generator';
import OptimizedHeader from '@/components/optimized-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Documents() {
  return (
    <div className="min-h-screen bg-slate-50">
      <OptimizedHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documents">AI Document Intelligence</TabsTrigger>
              <TabsTrigger value="components">AI Component Generator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="mt-6">
              <EnhancedDocumentGenerator />
            </TabsContent>
            
            <TabsContent value="components" className="mt-6">
              <AIComponentGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}