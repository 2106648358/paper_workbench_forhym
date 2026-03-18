import type { Indicators, WeightsResult } from '@/types';

const RI_VALUES: Record<number, number> = {
  3: 0.52,
  4: 0.89,
  5: 1.12,
  6: 1.26,
  7: 1.36,
  8: 1.41,
  9: 1.46,
};

export function powerIteration(
  matrix: number[][],
  maxIter: number = 100,
  tolerance: number = 1e-10
): { eigenvalue: number; eigenvector: number[] } {
  const n = matrix.length;
  let v = new Array(n).fill(1 / n);

  for (let iter = 0; iter < maxIter; iter++) {
    const newV = matrix.map((row) =>
      row.reduce((sum, val, j) => sum + val * v[j], 0)
    );

    const norm = Math.sqrt(newV.reduce((sum, val) => sum + val * val, 0));
    const normalizedV = newV.map((x) => x / norm);

    let diff = 0;
    for (let i = 0; i < n; i++) {
      diff += Math.abs(normalizedV[i] - v[i]);
    }

    v = normalizedV;

    if (diff < tolerance) break;
  }

  const Av = matrix.map((row) =>
    row.reduce((sum, val, j) => sum + val * v[j], 0)
  );
  const eigenvalue = Av.reduce((sum, val, i) => sum + val * v[i], 0);

  const sum = v.reduce((a, b) => a + b, 0);
  const eigenvector = v.map((x) => x / sum);

  return { eigenvalue, eigenvector };
}

export function consistencyRatio(
  matrix: number[][],
  lambdaMax: number
): { CI: number; CR: number; passed: boolean } {
  const n = matrix.length;
  const CI = (lambdaMax - n) / (n - 1);
  const RI = RI_VALUES[n] || 1.26;
  const CR = CI / RI;

  return {
    CI: Math.round(CI * 10000) / 10000,
    CR: Math.round(CR * 10000) / 10000,
    passed: CR < 0.1,
  };
}

export function geometricMean(matrices: number[][][]): number[][] {
  const n = matrices[0].length;
  const k = matrices.length;
  const result: number[][] = Array(n)
    .fill(null)
    .map(() => Array(n).fill(1));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let product = 1;
      for (const matrix of matrices) {
        product *= matrix[i][j];
      }
      result[i][j] = Math.pow(product, 1 / k);
    }
  }

  return result;
}

export function calculateAHPWeights(matrix: number[][]): WeightsResult {
  const { eigenvalue, eigenvector } = powerIteration(matrix);
  const consistency = consistencyRatio(matrix, eigenvalue);

  const dimensionIds = [
    'popularity',
    'gender_equity',
    'sustainability',
    'inclusivity',
    'innovation',
    'safety',
  ];

  const weights: Record<string, number> = {};
  eigenvector.forEach((w, i) => {
    weights[dimensionIds[i]] = Math.round(w * 1000) / 1000;
  });

  return {
    calculated: new Date().toISOString().split('T')[0],
    weights,
    consistency: {
      lambdaMax: Math.round(eigenvalue * 1000) / 1000,
      CI: consistency.CI,
      CR: consistency.CR,
      passed: consistency.passed,
    },
  };
}

export function normalizeData(
  data: number[][],
  directions: ('positive' | 'negative')[] = []
): number[][] {
  const m = data[0].length;
  const normalized: number[][] = [];

  const mins: number[] = [];
  const maxs: number[] = [];

  for (let j = 0; j < m; j++) {
    const col = data.map((row) => row[j]);
    mins[j] = Math.min(...col);
    maxs[j] = Math.max(...col);
  }

  for (let i = 0; i < data.length; i++) {
    normalized[i] = [];
    for (let j = 0; j < m; j++) {
      const range = maxs[j] - mins[j];
      if (range === 0) {
        normalized[i][j] = 1;
      } else if (directions[j] === 'negative') {
        normalized[i][j] = (maxs[j] - data[i][j]) / range;
      } else {
        normalized[i][j] = (data[i][j] - mins[j]) / range;
      }
    }
  }

  return normalized;
}

export function calculateEntropy(normalizedData: number[][]): number[] {
  const n = normalizedData.length;
  const m = normalizedData[0].length;
  const entropy: number[] = [];

  for (let j = 0; j < m; j++) {
    const col = normalizedData.map((row) => row[j]);
    const sum = col.reduce((a, b) => a + b, 0);

    if (sum === 0) {
      entropy[j] = 1;
      continue;
    }

    const p = col.map((x) => x / sum);
    let h = 0;

    for (const pij of p) {
      if (pij > 0) {
        h -= pij * Math.log(pij);
      }
    }

    h /= Math.log(n);
    entropy[j] = Math.round(h * 1000) / 1000;
  }

  return entropy;
}

export function calculateEntropyWeights(entropyValues: number[]): number[] {
  const n = entropyValues.length;
  const d = entropyValues.map((h) => 1 - h);
  const sumD = d.reduce((a, b) => a + b, 0);

  if (sumD === 0) {
    return new Array(n).fill(1 / n);
  }

  return d.map((di) => Math.round((di / sumD) * 1000) / 1000);
}

export function calculateEWMWeights(
  projects: { indicators: Indicators }[]
): { weights: Record<string, number>; entropyValues: Record<string, number> } {
  const dimensionIds = [
    'popularity',
    'gender_equity',
    'sustainability',
    'inclusivity',
    'innovation',
    'safety',
  ];

  const data = projects.map((p) =>
    dimensionIds.map((id) => p.indicators[id as keyof Indicators])
  );

  const normalized = normalizeData(data);
  const entropyValues = calculateEntropy(normalized);
  const weightsArray = calculateEntropyWeights(entropyValues);

  const weights: Record<string, number> = {};
  const entropy: Record<string, number> = {};

  dimensionIds.forEach((id, i) => {
    weights[id] = weightsArray[i];
    entropy[id] = entropyValues[i];
  });

  return { weights, entropyValues: entropy };
}

export function combineWeights(
  ahpWeights: Record<string, number>,
  ewmWeights: Record<string, number>,
  alpha: number = 0.5
): Record<string, number> {
  const hybrid: Record<string, number> = {};

  for (const key of Object.keys(ahpWeights)) {
    hybrid[key] = Math.round(
      (alpha * ahpWeights[key] + (1 - alpha) * ewmWeights[key]) * 1000
    ) / 1000;
  }

  return hybrid;
}

export function calculateProjectScore(
  indicators: Indicators,
  weights: Record<string, number>
): number {
  const dimensionIds = [
    'popularity',
    'gender_equity',
    'sustainability',
    'inclusivity',
    'innovation',
    'safety',
  ];

  let score = 0;
  for (const id of dimensionIds) {
    score += indicators[id as keyof Indicators] * (weights[id] || 0);
  }

  return Math.round(score * 1000) / 1000;
}

export function rankProjects(
  projects: { id: string; name: string; indicators: Indicators }[],
  weights: Record<string, number>
): { id: string; name: string; score: number; rank: number }[] {
  const scored = projects.map((p) => ({
    id: p.id,
    name: p.name,
    score: calculateProjectScore(p.indicators, weights),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.map((p, i) => ({
    ...p,
    rank: i + 1,
  }));
}

export function sensitivityAnalysis(
  projects: { id: string; name: string; indicators: Indicators }[],
  ahpWeights: Record<string, number>,
  ewmWeights: Record<string, number>,
  alphaSteps: number = 10
): { alpha: number; rankings: { id: string; rank: number }[] }[] {
  const results: { alpha: number; rankings: { id: string; rank: number }[] }[] =
    [];

  for (let step = 0; step <= alphaSteps; step++) {
    const alpha = step / alphaSteps;
    const hybrid = combineWeights(ahpWeights, ewmWeights, alpha);
    const ranked = rankProjects(projects, hybrid);

    results.push({
      alpha,
      rankings: ranked.map((p) => ({ id: p.id, rank: p.rank })),
    });
  }

  return results;
}

export function calculateProbability(
  score: number,
  allScores: number[]
): number {
  const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const std = Math.sqrt(
    allScores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / allScores.length
  );

  if (std === 0) return 0.5;

  const z = (score - avg) / std;
  const probability = 1 / (1 + Math.exp(-2 * z));

  return Math.round(probability * 100) / 100;
}

export function getIndicatorBreakdown(
  indicators: Indicators,
  weights: Record<string, number>
): Record<string, number> {
  const breakdown: Record<string, number> = {};
  const dimensionIds = [
    'popularity',
    'gender_equity',
    'sustainability',
    'inclusivity',
    'innovation',
    'safety',
  ];

  for (const id of dimensionIds) {
    breakdown[id] = Math.round(
      indicators[id as keyof Indicators] * (weights[id] || 0) * 1000
    ) / 1000;
  }

  return breakdown;
}