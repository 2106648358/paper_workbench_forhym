"""
综合评分计算模块
Evaluation Score Calculator
"""

import numpy as np
from typing import List, Optional, Tuple
from ewm_calculator import calculate_dimension_score, normalize_matrix


class OlympicProjectEvaluator:
    """奥运项目评估器"""

    INDICATORS = ["流行度", "性别平等", "可持续性", "包容性", "创新性", "安全性"]

    def __init__(self, weights: np.ndarray):
        """
        初始化评估器

        Args:
            weights: 六维指标权重向量
        """
        assert len(weights) == 6, "权重向量长度必须为6"
        self.weights = weights / np.sum(weights)

    def calculate_dimension_scores(
        self,
        popularity_data: np.ndarray,
        gender_data: np.ndarray,
        sustainability_data: np.ndarray,
        inclusivity_data: np.ndarray,
        innovation_data: np.ndarray,
        safety_data: np.ndarray,
    ) -> np.ndarray:
        """
        计算各维度综合得分

        Args:
            各维度数据矩阵 (n x k)，n个项目，k个子指标

        Returns:
            维度得分矩阵 (n x 6)
        """
        n = popularity_data.shape[0]
        E = np.zeros((n, 6))

        E[:, 0] = calculate_dimension_score(
            popularity_data, ["positive"] * popularity_data.shape[1]
        )
        E[:, 1] = calculate_dimension_score(
            gender_data, ["positive"] * gender_data.shape[1]
        )
        E[:, 2] = calculate_dimension_score(
            sustainability_data, ["negative"] * sustainability_data.shape[1]
        )
        E[:, 3] = calculate_dimension_score(
            inclusivity_data, ["positive"] * inclusivity_data.shape[1]
        )
        E[:, 4] = calculate_dimension_score(
            innovation_data, ["positive"] * innovation_data.shape[1]
        )
        E[:, 5] = calculate_dimension_score(
            safety_data, ["negative"] * safety_data.shape[1]
        )

        return E

    def evaluate(self, E: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        计算项目综合评分

        Args:
            E: 维度得分矩阵 (n x 6)

        Returns:
            (综合评分向量, 排名向量)
        """
        scores = E @ self.weights

        ranking = np.argsort(-scores) + 1

        return scores, ranking

    def evaluate_projects(
        self, project_names: List[str], dimension_scores: np.ndarray
    ) -> dict:
        """
        完整评估多个项目

        Args:
            project_names: 项目名称列表
            dimension_scores: 维度得分矩阵 (n x 6)

        Returns:
            评估结果字典
        """
        scores, ranking = self.evaluate(dimension_scores)

        results = []
        for i, name in enumerate(project_names):
            results.append(
                {
                    "name": name,
                    "score": scores[i],
                    "rank": ranking[i],
                    "dimension_scores": {
                        self.INDICATORS[j]: dimension_scores[i, j] for j in range(6)
                    },
                }
            )

        results.sort(key=lambda x: x["rank"])

        return {
            "projects": results,
            "weights": dict(zip(self.INDICATORS, self.weights)),
        }


def compare_methods(
    E: np.ndarray, W_ahp: np.ndarray, W_ewm: np.ndarray, alpha: float = 0.5
) -> dict:
    """
    对比不同权重方法的评估结果

    Args:
        E: 维度得分矩阵
        W_ahp: AHP权重
        W_ewm: EWM权重
        alpha: 混合系数

    Returns:
        三种方法的对比结果
    """
    W_hybrid = alpha * W_ahp + (1 - alpha) * W_ewm

    scores_ahp = E @ W_ahp
    scores_ewm = E @ W_ewm
    scores_hybrid = E @ W_hybrid

    ranking_ahp = np.argsort(-scores_ahp) + 1
    ranking_ewm = np.argsort(-scores_ewm) + 1
    ranking_hybrid = np.argsort(-scores_hybrid) + 1

    return {
        "AHP": {"scores": scores_ahp, "ranking": ranking_ahp},
        "EWM": {"scores": scores_ewm, "ranking": ranking_ewm},
        "Hybrid": {"scores": scores_hybrid, "ranking": ranking_hybrid},
    }


if __name__ == "__main__":
    W = np.array([0.360, 0.176, 0.112, 0.095, 0.063, 0.174])
    evaluator = OlympicProjectEvaluator(W)

    np.random.seed(42)
    E = np.random.rand(10, 6)

    scores, ranking = evaluator.evaluate(E)
    print("综合评分:", scores)
    print("排名:", ranking)
