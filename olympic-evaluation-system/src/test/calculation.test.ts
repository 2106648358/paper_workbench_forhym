import { describe, it, expect } from 'vitest';
import {
  powerIteration,
  consistencyRatio,
  geometricMean,
  calculateAHPWeights,
  normalizeData,
  calculateEntropy,
  calculateEntropyWeights,
  combineWeights,
  calculateProjectScore,
  rankProjects,
  calculateProbability,
} from '@/lib/calculation';

describe('powerIteration', () => {
  it('should calculate eigenvalue and eigenvector for a simple matrix', () => {
    const matrix = [
      [1, 2],
      [0.5, 1],
    ];
    const { eigenvalue, eigenvector } = powerIteration(matrix);
    
    expect(eigenvalue).toBeCloseTo(2, 0);
    expect(eigenvector[0]).toBeCloseTo(0.667, 2);
    expect(eigenvector[1]).toBeCloseTo(0.333, 2);
  });

  it('should work with 6x6 matrix', () => {
    const matrix = [
      [1, 2, 3, 4, 5, 3],
      [0.5, 1, 2, 3, 4, 2],
      [0.333, 0.5, 1, 2, 3, 1],
      [0.25, 0.333, 0.5, 1, 2, 0.5],
      [0.2, 0.25, 0.333, 0.5, 1, 0.333],
      [0.333, 0.5, 1, 2, 3, 1],
    ];
    const { eigenvalue, eigenvector } = powerIteration(matrix);
    
    expect(eigenvalue).toBeGreaterThan(6);
    expect(eigenvector.length).toBe(6);
    expect(eigenvector.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 3);
  });
});

describe('consistencyRatio', () => {
  it('should return passed for consistent matrix', () => {
    const matrix = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const result = consistencyRatio(matrix, 3);
    
    expect(result.passed).toBe(true);
    expect(result.CR).toBe(0);
  });

  it('should return failed for inconsistent matrix', () => {
    const matrix = [
      [1, 9, 9],
      [0.111, 1, 9],
      [0.111, 0.111, 1],
    ];
    const result = consistencyRatio(matrix, 4);
    
    expect(result.CR).toBeGreaterThan(0.1);
  });
});

describe('geometricMean', () => {
  it('should calculate geometric mean of matrices', () => {
    const m1 = [[1, 2], [0.5, 1]];
    const m2 = [[1, 4], [0.25, 1]];
    
    const result = geometricMean([m1, m2]);
    
    expect(result[0][1]).toBeCloseTo(2.83, 1);
    expect(result[1][0]).toBeCloseTo(0.35, 1);
  });
});

describe('calculateAHPWeights', () => {
  it('should return weights and consistency info', () => {
    const matrix = [
      [1, 2, 3, 4, 5, 3],
      [0.5, 1, 2, 3, 4, 2],
      [0.333, 0.5, 1, 2, 3, 1],
      [0.25, 0.333, 0.5, 1, 2, 0.5],
      [0.2, 0.25, 0.333, 0.5, 1, 0.333],
      [0.333, 0.5, 1, 2, 3, 1],
    ];
    
    const result = calculateAHPWeights(matrix);
    
    expect(result.weights).toBeDefined();
    expect(result.consistency).toBeDefined();
    expect(result.consistency?.passed).toBe(true);
    
    const weightSum = Object.values(result.weights).reduce((a, b) => a + b, 0);
    expect(weightSum).toBeCloseTo(1, 2);
  });
});

describe('normalizeData', () => {
  it('should normalize data to [0,1] range', () => {
    const data = [[1, 10], [5, 20], [10, 30]];
    
    const result = normalizeData(data);
    
    expect(result[0][0]).toBe(0);
    expect(result[2][0]).toBe(1);
    expect(result[0][1]).toBe(0);
    expect(result[2][1]).toBe(1);
  });

  it('should handle negative direction', () => {
    const data = [[1, 10], [5, 20], [10, 30]];
    
    const result = normalizeData(data, ['negative', 'positive']);
    
    expect(result[0][0]).toBe(1);
    expect(result[2][0]).toBe(0);
  });
});

describe('calculateEntropy', () => {
  it('should calculate entropy values', () => {
    const data = [[0.1, 0.5], [0.3, 0.3], [0.6, 0.2]];
    
    const result = calculateEntropy(data);
    
    expect(result.length).toBe(2);
    expect(result[0]).toBeGreaterThanOrEqual(0);
    expect(result[0]).toBeLessThanOrEqual(1);
  });
});

describe('calculateEntropyWeights', () => {
  it('should return weights summing to 1', () => {
    const entropyValues = [0.9, 0.8, 0.85];
    
    const result = calculateEntropyWeights(entropyValues);
    
    expect(result.length).toBe(3);
    expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 2);
  });
});

describe('combineWeights', () => {
  it('should combine weights with alpha', () => {
    const ahp = { a: 0.4, b: 0.6 };
    const ewm = { a: 0.3, b: 0.7 };
    
    const result = combineWeights(ahp, ewm, 0.5);
    
    expect(result.a).toBeCloseTo(0.35, 2);
    expect(result.b).toBeCloseTo(0.65, 2);
  });

  it('should return ahp weights when alpha is 1', () => {
    const ahp = { a: 0.4, b: 0.6 };
    const ewm = { a: 0.3, b: 0.7 };
    
    const result = combineWeights(ahp, ewm, 1);
    
    expect(result.a).toBe(0.4);
    expect(result.b).toBe(0.6);
  });
});

describe('calculateProjectScore', () => {
  it('should calculate weighted score', () => {
    const indicators = {
      popularity: 0.8,
      gender_equity: 0.9,
      sustainability: 0.7,
      inclusivity: 0.6,
      innovation: 0.5,
      safety: 0.8,
    };
    const weights = {
      popularity: 0.3,
      gender_equity: 0.2,
      sustainability: 0.15,
      inclusivity: 0.15,
      innovation: 0.1,
      safety: 0.1,
    };
    
    const result = calculateProjectScore(indicators, weights);
    
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe('rankProjects', () => {
  it('should rank projects by score', () => {
    const projects = [
      { id: 'a', name: 'A', indicators: { popularity: 0.9, gender_equity: 0.9, sustainability: 0.9, inclusivity: 0.9, innovation: 0.9, safety: 0.9 } },
      { id: 'b', name: 'B', indicators: { popularity: 0.5, gender_equity: 0.5, sustainability: 0.5, inclusivity: 0.5, innovation: 0.5, safety: 0.5 } },
      { id: 'c', name: 'C', indicators: { popularity: 0.7, gender_equity: 0.7, sustainability: 0.7, inclusivity: 0.7, innovation: 0.7, safety: 0.7 } },
    ];
    const weights = {
      popularity: 0.2,
      gender_equity: 0.2,
      sustainability: 0.15,
      inclusivity: 0.15,
      innovation: 0.15,
      safety: 0.15,
    };
    
    const result = rankProjects(projects, weights);
    
    expect(result[0].id).toBe('a');
    expect(result[1].id).toBe('c');
    expect(result[2].id).toBe('b');
    expect(result[0].rank).toBe(1);
  });
});

describe('calculateProbability', () => {
  it('should return higher probability for higher scores', () => {
    const scores = [0.5, 0.6, 0.7, 0.8, 0.9];
    
    const prob1 = calculateProbability(0.9, scores);
    const prob2 = calculateProbability(0.5, scores);
    
    expect(prob1).toBeGreaterThan(prob2);
  });

  it('should return probability between 0 and 1', () => {
    const scores = [0.5, 0.6, 0.7, 0.8, 0.9];
    
    const result = calculateProbability(0.7, scores);
    
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});