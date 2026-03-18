export interface Dimension {
  id: string;
  name: string;
  nameEn: string;
}

export interface Config {
  version: string;
  defaultAlpha: number;
  dimensions: Dimension[];
  riValues: Record<string, number>;
  thresholds: {
    highProbability: number;
    mediumProbability: number;
    lowProbability: number;
  };
  presetMatrices: Record<string, { name: string; description: string }>;
}

export interface Expert {
  id: string;
  name: string;
  background: string;
}

export interface JudgmentMatrixData {
  data: number[][];
  CR: number;
}

export interface JudgmentMatrix {
  description: string;
  experts: Expert[];
  matrices: Record<string, JudgmentMatrixData>;
  aggregated: {
    method: string;
    data: number[][];
    CR: number;
  };
}

export interface WeightsResult {
  calculated: string;
  weights: Record<string, number>;
  consistency?: {
    lambdaMax: number;
    CI: number;
    CR: number;
    passed: boolean;
  };
}

export interface EWMWeights {
  calculated: string;
  entropyValues: Record<string, number>;
  weights: Record<string, number>;
  normalizedWeights: Record<string, number>;
}

export interface Indicators {
  popularity: number;
  gender_equity: number;
  sustainability: number;
  inclusivity: number;
  innovation: number;
  safety: number;
}

export interface Project {
  id: string;
  name: string;
  nameEn: string;
  yearAdded: number | null;
  yearRemoved?: number;
  yearReturned?: number;
  indicators: Indicators;
  score?: number;
  rank?: number;
  probability?: number;
}

export interface ProjectCategory {
  category: string;
  description: string;
  projects: Project[];
}

export interface RankingItem {
  rank: number;
  projectId: string;
  name: string;
  score: number;
  probability?: number;
  breakdown?: Record<string, number>;
}

export interface RankingsResult {
  calculatedAt: string;
  alpha: number;
  method: string;
  rankings: RankingItem[];
}

export interface AppState {
  alpha: number;
  judgmentMatrix: number[][];
  projects: Project[];
  weights: {
    ahp: Record<string, number>;
    ewm: Record<string, number>;
    hybrid: Record<string, number>;
  };
  selectedProjects: string[];
  currentStep: number;
  loading: boolean;
  error: string | null;
}

export interface SavedScheme {
  id: string;
  name: string;
  createdAt: string;
  alpha: number;
  judgmentMatrix: number[][];
  weights: Record<string, number>;
  selectedProjects: string[];
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  action: string;
  oldValue: unknown;
  newValue: unknown;
}