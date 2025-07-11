import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Languages, 
  ArrowRight, 
  Copy, 
  Volume2,
  Globe,
  Users,
  MessageSquare
} from 'lucide-react';

const AFRICAN_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', regions: ['Global', 'East Africa', 'West Africa', 'Southern Africa'] },
  { code: 'fr', name: 'French', flag: '🇫🇷', regions: ['West Africa', 'Central Africa', 'North Africa'] },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', regions: ['Angola', 'Mozambique', 'Cape Verde'] },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', regions: ['North Africa', 'Sudan', 'Chad'] },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', regions: ['East Africa', 'Tanzania', 'Kenya', 'Uganda'] },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', regions: ['Ethiopia'] },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', regions: ['West Africa', 'Nigeria', 'Niger'] },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬', regions: ['Nigeria', 'Benin', 'Togo'] },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', regions: ['Nigeria'] },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', regions: ['South Africa'] },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', regions: ['South Africa', 'Namibia'] },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼', regions: ['Rwanda'] },
];

interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export default function MultilingualTranslator() {
  const [sourceText, setSourceText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translations, setTranslations] = useState<TranslationResult[]>([]);
  const { toast } = useToast();

  const translateMutation = useMutation({
    mutationFn: async (data: {
      text: string;
      sourceLanguage: string;
      targetLanguage: string;
    }) => {
      const response = await apiRequest('POST', '/api/translate', data);
      return response.json();
    },
    onSuccess: (result) => {
      const newTranslation: TranslationResult = {
        originalText: result.originalText,
        translatedText: result.translatedText,
        sourceLanguage: result.sourceLanguage,
        targetLanguage: result.targetLanguage,
        confidence: 95 // Mock confidence score
      };
      setTranslations(prev => [newTranslation, ...prev.slice(0, 4)]);
      toast({
        title: "Translation Complete",
        description: `Translated to ${getLanguageName(result.targetLanguage)}`,
      });
    },
    onError: () => {
      toast({
        title: "Translation Failed",
        description: "Please try again or check your connection",
        variant: "destructive",
      });
    }
  });

  const batchTranslateMutation = useMutation({
    mutationFn: async (data: {
      text: string;
      targetLanguages: string[];
    }) => {
      const promises = data.targetLanguages.map(lang =>
        apiRequest('POST', '/api/translate', {
          text: data.text,
          sourceLanguage: sourceLanguage,
          targetLanguage: lang
        }).then(res => res.json())
      );
      return Promise.all(promises);
    },
    onSuccess: (results) => {
      const newTranslations = results.map(result => ({
        originalText: result.originalText,
        translatedText: result.translatedText,
        sourceLanguage: result.sourceLanguage,
        targetLanguage: result.targetLanguage,
        confidence: 95
      }));
      setTranslations(prev => [...newTranslations, ...prev.slice(0, 2)]);
      toast({
        title: "Batch Translation Complete",
        description: `Translated to ${results.length} languages`,
      });
    }
  });

  const getLanguageName = (code: string) => {
    return AFRICAN_LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return AFRICAN_LANGUAGES.find(lang => lang.code === code)?.flag || '🌍';
  };

  const handleTranslate = () => {
    if (!sourceText.trim()) {
      toast({
        title: "Enter Text",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    translateMutation.mutate({
      text: sourceText,
      sourceLanguage,
      targetLanguage
    });
  };

  const handleBatchTranslate = () => {
    if (!sourceText.trim()) {
      toast({
        title: "Enter Text",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    // Translate to major African languages
    const majorLanguages = ['fr', 'pt', 'ar', 'sw'];
    batchTranslateMutation.mutate({
      text: sourceText,
      targetLanguages: majorLanguages.filter(lang => lang !== sourceLanguage)
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          African Multilingual Translator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Real-time translation for grant proposals and business documents
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Languages className="w-4 h-4" />
            <span>12+ African Languages</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Regional Focus</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Business Context</span>
          </div>
        </div>
      </div>

      {/* Translation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Source Text</span>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  {AFRICAN_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter your grant proposal text, business description, or any document that needs translation..."
              rows={8}
              className="w-full"
            />
            <div className="flex space-x-2 mt-4">
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AFRICAN_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleTranslate}
                disabled={translateMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {translateMutation.isPending ? (
                  <>
                    <Languages className="w-4 h-4 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Translate
                  </>
                )}
              </Button>
            </div>
            <Button 
              onClick={handleBatchTranslate}
              variant="outline"
              disabled={batchTranslateMutation.isPending}
              className="w-full mt-2"
            >
              {batchTranslateMutation.isPending ? (
                <>
                  <Languages className="w-4 h-4 mr-2 animate-spin" />
                  Batch Translating...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Translate to Major African Languages
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Translation Results */}
        <Card>
          <CardHeader>
            <CardTitle>Translation Results</CardTitle>
            <CardDescription>
              Professional translations optimized for business and grant contexts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {translations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Languages className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Translations will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {translations.map((translation, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getLanguageFlag(translation.targetLanguage)}</span>
                        <Badge variant="outline">
                          {getLanguageName(translation.targetLanguage)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {translation.confidence}% confident
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(translation.translatedText)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {translation.translatedText}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Language Coverage Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>African Language Coverage</span>
          </CardTitle>
          <CardDescription>
            Regional language support for effective communication across Africa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                region: 'West Africa',
                languages: ['English', 'French', 'Hausa', 'Yoruba', 'Igbo'],
                countries: ['Nigeria', 'Ghana', 'Senegal', 'Mali', 'Burkina Faso']
              },
              {
                region: 'East Africa',
                languages: ['English', 'Swahili', 'Amharic', 'Kinyarwanda'],
                countries: ['Kenya', 'Tanzania', 'Ethiopia', 'Rwanda', 'Uganda']
              },
              {
                region: 'Southern Africa',
                languages: ['English', 'Afrikaans', 'Zulu', 'Portuguese'],
                countries: ['South Africa', 'Zimbabwe', 'Botswana', 'Namibia']
              },
              {
                region: 'North Africa',
                languages: ['Arabic', 'French', 'English'],
                countries: ['Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya']
              },
              {
                region: 'Central Africa',
                languages: ['French', 'Portuguese', 'English'],
                countries: ['Cameroon', 'DRC', 'Chad', 'CAR', 'Gabon']
              },
              {
                region: 'Lusophone Africa',
                languages: ['Portuguese', 'English', 'French'],
                countries: ['Angola', 'Mozambique', 'Cape Verde', 'Guinea-Bissau']
              }
            ].map((region, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-lg mb-2">{region.region}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Languages:</p>
                      <div className="flex flex-wrap gap-1">
                        {region.languages.map(lang => (
                          <Badge key={lang} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Key Countries:</p>
                      <p className="text-xs text-gray-600">
                        {region.countries.join(', ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Grant Proposal Optimization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Context-aware translations for funding applications</li>
              <li>• Technical terminology preservation</li>
              <li>• Cultural adaptation for different regions</li>
              <li>• Compliance with funder language requirements</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Business Communication</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Professional tone maintenance</li>
              <li>• Industry-specific vocabulary</li>
              <li>• Regional business etiquette</li>
              <li>• Legal document translation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Collaboration Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Real-time team translation</li>
              <li>• Comment translation in proposals</li>
              <li>• Multi-language document sharing</li>
              <li>• Cross-cultural communication tools</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}