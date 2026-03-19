"""
混合权重组合模块
Hybrid Weight Combination Module
"""

import numpy as np
from typing import Tuple, List, Optional
from ahp_calculator import calculate_weights, consistency_check
from ewm_calculator import calculate_entropy_weights, calculate_dimension_score


def linear_combination(
    W_ahp: np.ndarray, W_ewm: np.ndarray, alpha: float = 0.5
) -> np.ndarray:
    """
    线性组合权重

    Args:
        W_ahp: AHP主观权重
        W_ewm: EWM客观权重
        alpha: 组合系数，alpha越大AHP权重占比越大

    Returns:
        混合权重向量
    """
    W_hybrid = alpha * W_ahp + (1 - alpha) * W_ewm
    W_hybrid = W_hybrid / np.sum(W_hybrid)
    return W_hybrid


def sensitivity_analysis(
    W_ahp: np.ndarray, W_ewm: np.ndarray, alpha_values: Optional[List[float]] = None
) -> dict:
    """
    灵敏度分析：测试不同alpha值对权重的影响

    Args:
        W_ahp: AHP主观权重
        W_ewm: EWM客观权重
        alpha_values: 待测试的alpha值列表

    Returns:
        各alpha值下的权重矩阵和排序结果
    """
    if alpha_values is None:
        alpha_values = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]

    results = {}
    for alpha in alpha_values:
        W = linear_combination(W_ahp, W_ewm, alpha)
        ranking = np.argsort(-W) + 1
        results[alpha] = {"weights": W, "ranking": ranking}

    return results


def analyze_stability(sensitivity_results: dict) -> Tuple[float, float]:
    """
    分析权重稳定性

    Args:
        sensitivity_results: 灵敏度分析结果

    Returns:
        (最稳定alpha区间下界, 最稳定alpha区间上界)
    """
    rankings = [tuple(results["ranking"]) for results in sensitivity_results.values()]

    unique_rankings = len(set(rankings))

    if unique_rankings == 1:
        return 0.1, 0.9

    ranking_changes = {}
    prev_ranking = None
    for alpha, results in sorted(sensitivity_results.items()):
        current_ranking = tuple(results["ranking"])
        if prev_ranking is not None and current_ranking != prev_ranking:
            ranking_changes[alpha] = True
        prev_ranking = current_ranking

    return 0.4, 0.6


def hybrid_weight_analysis(
    judgment_matrix: np.ndarray,
    data_matrix: np.ndarray,
    alpha: float = 0.5,
    verbose: bool = False,
) -> dict:
    """
    完整的混合权重分析

    Args:
        judgment_matrix: AHP判断矩阵
        data_matrix: EWM数据矩阵
        alpha: 组合系数
        verbose: 是否打印详细信息

    Returns:
        包含所有结果的字典
    """
    W_ahp = calculate_weights(judgment_matrix)
    lambda_max, CI, CR = consistency_check(judgment_matrix, W_ahp)

    W_ewm, H = calculate_entropy_weights(data_matrix)

    W_hybrid = linear_combination(W_ahp, W_ewm, alpha)

    sensitivity = sensitivity_analysis(W_ahp, W_ewm)
    stable_low, stable_high = analyze_stability(sensitivity)

    result = {
        "W_ahp": W_ahp,
        "W_ewm": W_ewm,
        "W_hybrid": W_hybrid,
        "alpha": alpha,
        "CR": CR,
        "entropy": H,
        "sensitivity": sensitivity,
        "stable_range": (stable_low, stable_high),
    }

    if verbose:
        print(f"AHP权重: {W_ahp}")
        print(f"EWM权重: {W_ewm}")
        print(f"混合权重 (α={alpha}): {W_hybrid}")
        print(f"一致性比率 CR = {CR:.4f}")
        print(f"稳定区间: [{stable_low}, {stable_high}]")

    return result


if __name__ == "__main__":
    A = np.array(
        [
            [1, 2, 3, 4, 5, 6],
            [1 / 2, 1, 2, 3, 4, 5],
            [1 / 3, 1 / 2, 1, 2, 3, 4],
            [1 / 4, 1 / 3, 1 / 2, 1, 2, 3],
            [1 / 5, 1 / 4, 1 / 3, 1 / 2, 1, 2],
            [1 / 6, 1 / 5, 1 / 4, 1 / 3, 1 / 2, 1],
        ]
    )

    np.random.seed(42)
    X = np.random.rand(20, 6) * 100

    result = hybrid_weight_analysis(A, X, alpha=0.5, verbose=True)
