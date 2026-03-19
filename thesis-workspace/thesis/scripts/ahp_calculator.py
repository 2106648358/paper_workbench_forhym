"""
AHP层次分析法权重计算模块
Analytic Hierarchy Process Weight Calculator
"""

import numpy as np
from typing import Tuple, List, Optional


def create_judgment_matrix(comparisons: List[List[float]]) -> np.ndarray:
    """
    从两两比较值构建判断矩阵

    Args:
        comparisons: 上三角比较值列表，如 [[1, 3, 5], [1, 2], [1]] 表示
                    a12=3, a13=5, a23=2 的3x3矩阵

    Returns:
        n x n 判断矩阵
    """
    n = len(comparisons) + 1
    A = np.ones((n, n))

    k = 0
    for i in range(n - 1):
        for j in range(i + 1, n):
            A[i, j] = comparisons[i][j - i - 1]
            A[j, i] = 1 / A[i, j]

    return A


def calculate_weights(A: np.ndarray, method: str = "eigenvalue") -> np.ndarray:
    """
    计算AHP权重向量

    Args:
        A: 判断矩阵 (n x n)
        method: 计算方法 ('eigenvalue' 或 'geometric_mean')

    Returns:
        归一化权重向量
    """
    if method == "eigenvalue":
        eigenvalues, eigenvectors = np.linalg.eig(A)
        max_idx = np.argmax(eigenvalues.real)
        lambda_max = eigenvalues[max_idx].real
        weights = np.abs(eigenvectors[:, max_idx].real)
    elif method == "geometric_mean":
        weights = np.prod(A, axis=1) ** (1 / A.shape[0])
    else:
        raise ValueError(f"Unknown method: {method}")

    weights = weights / np.sum(weights)
    return weights


def consistency_check(A: np.ndarray, weights: np.ndarray) -> Tuple[float, float, float]:
    """
    一致性检验

    Args:
        A: 判断矩阵
        weights: 权重向量

    Returns:
        (lambda_max, CI, CR)
    """
    n = A.shape[0]
    Aw = A @ weights
    lambda_max = np.mean(Aw / weights)

    CI = (lambda_max - n) / (n - 1)

    RI_table = {
        1: 0,
        2: 0,
        3: 0.52,
        4: 0.89,
        5: 1.12,
        6: 1.26,
        7: 1.36,
        8: 1.41,
        9: 1.46,
        10: 1.49,
    }
    RI = RI_table.get(n, 1.49)

    CR = CI / RI if RI > 0 else 0

    return lambda_max, CI, CR


def aggregate_expert_matrices(matrices: List[np.ndarray]) -> np.ndarray:
    """
    多专家判断矩阵整合（几何平均法）

    Args:
        matrices: 多位专家的判断矩阵列表

    Returns:
        整合后的判断矩阵
    """
    k = len(matrices)
    n = matrices[0].shape[0]

    aggregated = np.ones((n, n))
    for i in range(n):
        for j in range(n):
            product = 1.0
            for matrix in matrices:
                product *= matrix[i, j]
            aggregated[i, j] = product ** (1 / k)

    return aggregated


def ahp_analysis(A: np.ndarray, verbose: bool = False) -> dict:
    """
    完整的AHP分析

    Args:
        A: 判断矩阵
        verbose: 是否打印详细信息

    Returns:
        包含权重和检验结果的字典
    """
    weights = calculate_weights(A)
    lambda_max, CI, CR = consistency_check(A, weights)

    result = {
        "weights": weights,
        "lambda_max": lambda_max,
        "CI": CI,
        "CR": CR,
        "consistent": CR < 0.1,
    }

    if verbose:
        print(f"权重向量: {weights}")
        print(f"最大特征值 λ_max = {lambda_max:.4f}")
        print(f"一致性指标 CI = {CI:.4f}")
        print(f"一致性比率 CR = {CR:.4f}")
        print(f"一致性检验: {'通过' if CR < 0.1 else '未通过'}")

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

    result = ahp_analysis(A, verbose=True)
