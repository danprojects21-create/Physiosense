
export enum AnalysisStep {
  LANDING = 'LANDING',
  CAPTURE_FRONT = 'CAPTURE_FRONT',
  CAPTURE_PROFILE = 'CAPTURE_PROFILE',
  UPLOAD_BOTH = 'UPLOAD_BOTH',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS'
}

export interface MorphoAnalysis {
  generalCharacteristics: {
    morphologicalType: string;
    facialStructure: string;
    vitalEnergy: string;
  };
  personality: {
    dominantTraits: string[];
    emotionalStyle: string;
    behavioralPatterns: string;
    relationToAuthority: string;
  };
  positives: {
    talents: string[];
    strengths: string[];
    potential: string;
  };
  improvements: {
    limitingTendencies: string[];
    risks: string;
    balanceRecommendations: string;
  };
  relationships: {
    connectionTypes: string;
    compatibilities: string;
    communicationStyle: string;
  };
  selfKnowledge: {
    keys: string[];
    recommendations: string[];
  };
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
