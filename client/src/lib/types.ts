export interface PitchFormData {
  industry: string;
  country: string;
  businessType: string;
  description?: string;
}

export interface PitchSlide {
  slideNumber: number;
  title: string;
  content: string[];
  keyPoints: string[];
  imageUrl?: string;
  imagePrompt?: string;
  chartData?: any;
}

export interface PitchInsights {
  marketSize: string;
  revenueProjection: string;
  competitiveAdvantage: string;
  marketStrategy: string;
}

export interface PitchDeckContent {
  title: string;
  slides: PitchSlide[];
  insights?: PitchInsights;
  generatedWith?: string;
  downloadOptions?: string[];
  executiveSummary?: string;
}

export interface GeneratePitchResponse {
  success: boolean;
  requestId: number;
  content: PitchDeckContent;
  pdfUrl: string;
  isWatermarked?: boolean;
  message?: string;
}
