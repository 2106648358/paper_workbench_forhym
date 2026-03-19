"""
熵权法(EWM)权重计算模块
Entropy Weight Method Calculator
"""

import numpy as np
from typing import Tuple, Optional


def normalize_matrix(
    X: np.ndarray, directions: Optional[List[str]] = None
) -> np.ndarray:
    """
    数据标准化

    Args:
        X: 决策矩阵 (n x m)，n个方案，m个指标
        directions: 指标方向列表，'positive'正向(越大越好)，'negative'负向(越小越好)
                   默认全部正向

    Returns:
        标准化后的矩阵 [0, 1]
    """
    n, m = X.shape
    X_norm = np.zeros_like(X, dtype=float)

    if directions is None:
        directions = ["positive"] * m

    for j in range(m):
        col_min = np.min(X[:, j])
        col_max = np.max(X[:, j])
        col_range = col_max - col_min

        if col_range == 0:
            X_norm[:, j] = 1.0
        elif directions[j] == "positive":
            X_norm[:, j] = (X[:, j] - col_min) / col_range
        else:
            X_norm[:, j] = (col_max - X[:, j]) / col_range

    return X_norm


def calculate_entropy(X_norm: np.ndarray, epsilon: float = 1e-10) -> np.ndarray:
    """
    计算信息熵

    Args:
        X_norm: 标准化后的矩阵
        epsilon: 防止log(0)的小常数

    Returns:
        各指标的信息熵向量
    """
    n, m = X_norm.shape

    col_sums = np.sum(X_norm, axis=0, keepdims=True)
    col_sums = np.where(col_sums == 0, epsilon, col_sums)

    P = X_norm / col_sums
    P = np.where(P == 0, epsilon, P)

    H = -np.sum(P * np.log(P), axis=0) / np.log(n)

    return H


def calculate_entropy_weights(
    X: np.ndarray, directions: Optional[List[str]] = None, verbose: bool = False
) -> Tuple[np.ndarray, np.ndarray]:
    """
    计算熵权

    Args:
        X: 决策矩阵 (n x m)
        directions: 指标方向列表
        verbose: 是否打印详细信息

    Returns:
        (权重向量, 信息熵向量)
    """
    X_norm = normalize_matrix(X, directions)

    H = calculate_entropy(X_norm)

    D = 1 - H

    W = D / np.sum(D)

    if verbose:
        print(f"信息熵 H: {H}")
        print(f"信息效用值 D: {D}")
        print(f"熵权 W: {W}")

    return W, H


def calculate_dimension_score(
    X_sub: np.ndarray, directions: Optional[List[str]] = None
) -> np.ndarray:
    """
    计算维度综合得分（第二层EWM）

    Args:
        X_sub: 子指标数据矩阵 (n x k)，n个方案，k个子指标
        directions: 子指标方向

    Returns:
        维度综合得分向量 (n,)
    """
    if X_sub.shape[1] == 1:
        X_norm = normalize_matrix(X_sub, directions)
        return X_norm.flatten()

    W, _ = calculate_entropy_weights(X_sub, directions)
    X_norm = normalize_matrix(X_sub, directions)

    scores = X_norm @ W
    scores = (scores - scores.min()) / (scores.max() - scores.min() + 1e-10)

    return scores


if __name__ == "__main__":
    np.random.seed(42)
    X = np.random.rand(10, 6) * 100

    W, H = calculate_entropy_weights(X, verbose=True)
    print(f"\n权重总和: {np.sum(W):.4f}")
