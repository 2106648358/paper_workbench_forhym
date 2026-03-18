import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, SavedScheme, HistoryRecord } from '@/types';

interface AppState {
  alpha: number;
  judgmentMatrix: number[][];
  projects: Project[];
  ahpWeights: Record<string, number>;
  ewmWeights: Record<string, number>;
  hybridWeights: Record<string, number>;
  selectedProjects: string[];
  currentStep: number;
  loading: boolean;
  error: string | null;
  schemes: SavedScheme[];
  history: HistoryRecord[];

  setAlpha: (alpha: number) => void;
  setJudgmentMatrix: (matrix: number[][]) => void;
  setProjects: (projects: Project[]) => void;
  setWeights: (type: 'ahp' | 'ewm' | 'hybrid', weights: Record<string, number>) => void;
  toggleProjectSelection: (projectId: string) => void;
  selectAllProjects: () => void;
  clearSelection: () => void;
  setCurrentStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, indicators: Partial<Project['indicators']>) => void;
  saveScheme: (name: string) => void;
  loadScheme: (schemeId: string) => void;
  deleteScheme: (schemeId: string) => void;
  addHistoryRecord: (action: string, oldValue: unknown, newValue: unknown) => void;
  revertToHistory: (recordId: string) => void;
  clearHistory: () => void;
}

const DEFAULT_JUDGMENT_MATRIX: number[][] = [
  [1, 2.667, 3.667, 3.928, 4.718, 2.667],
  [0.375, 1, 2, 2.297, 3.301, 1.148],
  [0.273, 0.5, 1, 1.189, 2, 0.638],
  [0.255, 0.435, 0.841, 1, 1.741, 0.536],
  [0.212, 0.303, 0.5, 0.575, 1, 0.347],
  [0.375, 0.871, 1.568, 1.866, 2.884, 1],
];

const DEFAULT_AHP_WEIGHTS: Record<string, number> = {
  popularity: 0.36,
  gender_equity: 0.176,
  sustainability: 0.112,
  inclusivity: 0.095,
  innovation: 0.063,
  safety: 0.174,
};

const DEFAULT_EWM_WEIGHTS: Record<string, number> = {
  popularity: 0.139,
  gender_equity: 0.193,
  sustainability: 0.154,
  inclusivity: 0.17,
  innovation: 0.216,
  safety: 0.178,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      alpha: 0.5,
      judgmentMatrix: DEFAULT_JUDGMENT_MATRIX,
      projects: [],
      ahpWeights: DEFAULT_AHP_WEIGHTS,
      ewmWeights: DEFAULT_EWM_WEIGHTS,
      hybridWeights: DEFAULT_AHP_WEIGHTS,
      selectedProjects: [],
      currentStep: 1,
      loading: false,
      error: null,
      schemes: [],
      history: [],

      setAlpha: (alpha) => {
        set({ alpha });
      },

      setJudgmentMatrix: (matrix) => {
        set({ judgmentMatrix: matrix });
      },

      setProjects: (projects) => set({ projects }),

      setWeights: (type, weights) => {
        if (type === 'ahp') {
          set({ ahpWeights: weights });
        } else if (type === 'ewm') {
          set({ ewmWeights: weights });
        } else {
          set({ hybridWeights: weights });
        }
      },

      toggleProjectSelection: (projectId) => {
        const selected = get().selectedProjects;
        if (selected.includes(projectId)) {
          set({ selectedProjects: selected.filter((id) => id !== projectId) });
        } else {
          set({ selectedProjects: [...selected, projectId] });
        }
      },

      selectAllProjects: () => {
        set({ selectedProjects: get().projects.map((p) => p.id) });
      },

      clearSelection: () => set({ selectedProjects: [] }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      addProject: (project) => {
        set({ projects: [...get().projects, project] });
      },

      updateProject: (projectId, indicators) => {
        set({
          projects: get().projects.map((p) =>
            p.id === projectId ? { ...p, indicators: { ...p.indicators, ...indicators } } : p
          ),
        });
      },

      saveScheme: (name) => {
        const state = get();
        const scheme: SavedScheme = {
          id: Date.now().toString(),
          name,
          createdAt: new Date().toISOString(),
          alpha: state.alpha,
          judgmentMatrix: state.judgmentMatrix,
          weights: state.hybridWeights,
          selectedProjects: state.selectedProjects,
        };
        set({ schemes: [...state.schemes, scheme] });
      },

      loadScheme: (schemeId) => {
        const scheme = get().schemes.find((s) => s.id === schemeId);
        if (scheme) {
          set({
            alpha: scheme.alpha,
            judgmentMatrix: scheme.judgmentMatrix,
            hybridWeights: scheme.weights,
            selectedProjects: scheme.selectedProjects,
          });
        }
      },

      deleteScheme: (schemeId) => {
        set({ schemes: get().schemes.filter((s) => s.id !== schemeId) });
      },

      addHistoryRecord: (action, oldValue, newValue) => {
        const record: HistoryRecord = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          action,
          oldValue,
          newValue,
        };
        set({ history: [record, ...get().history].slice(0, 50) });
      },

      revertToHistory: (recordId) => {
        const record = get().history.find((r) => r.id === recordId);
        if (record) {
          if (record.action === 'setAlpha') {
            set({ alpha: record.oldValue as number });
          } else if (record.action === 'setJudgmentMatrix') {
            set({ judgmentMatrix: record.oldValue as number[][] });
          }
        }
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'olympic-evaluation-storage',
      partialize: (state) => ({
        alpha: state.alpha,
        judgmentMatrix: state.judgmentMatrix,
        selectedProjects: state.selectedProjects,
        schemes: state.schemes,
      }),
    }
  )
);