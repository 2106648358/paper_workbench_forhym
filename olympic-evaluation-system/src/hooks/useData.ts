import { useState, useEffect } from 'react';
import type { Config, JudgmentMatrix, WeightsResult, EWMWeights, Project, ProjectCategory, RankingsResult } from '@/types';

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/config.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load config');
        return res.json();
      })
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { config, loading, error };
}

export function useJudgmentMatrix() {
  const [data, setData] = useState<JudgmentMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/ahp/judgment-matrix.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load judgment matrix');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useAHPWeights() {
  const [data, setData] = useState<WeightsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/ahp/weights.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load AHP weights');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useEWMWeights() {
  const [data, setData] = useState<EWMWeights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/ewm/weights.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load EWM weights');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/projects/core.json').then((res) => res.json()),
      fetch('/data/projects/new.json').then((res) => res.json()),
      fetch('/data/projects/candidate.json').then((res) => res.json()),
      fetch('/data/projects/removed.json').then((res) => res.json()),
    ])
      .then(([core, newProjects, candidate, removed]: ProjectCategory[]) => {
        const allProjects: Project[] = [
          ...core.projects,
          ...newProjects.projects,
          ...candidate.projects,
          ...removed.projects,
        ];
        setProjects(allProjects);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { projects, loading, error };
}

export function useRankings(): {
  data: RankingsResult | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<RankingsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/results/rankings.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load rankings');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useDataLoader() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const { data: judgmentMatrix, loading: jmLoading, error: jmError } = useJudgmentMatrix();
  const { data: ahpWeights, loading: ahpLoading, error: ahpError } = useAHPWeights();
  const { data: ewmWeights, loading: ewmLoading, error: ewmError } = useEWMWeights();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();

  const loading = configLoading || jmLoading || ahpLoading || ewmLoading || projectsLoading;
  const error = configError || jmError || ahpError || ewmError || projectsError;

  return {
    config,
    judgmentMatrix,
    ahpWeights,
    ewmWeights,
    projects,
    loading,
    error,
  };
}