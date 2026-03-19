"""
计算脚本测试模块
Test Script for Computation Modules
"""

import numpy as np
import sys

sys.path.append("scripts")

from ahp_calculator import ahp_analysis, aggregate_expert_matrices
from ewm_calculator import calculate_entropy_weights, calculate_dimension_score
from hybrid_weights import (
    linear_combination,
    sensitivity_analysis,
    hybrid_weight_analysis,
)
from evaluation import OlympicProjectEvaluator, compare_methods


def test_ahp():
    """测试AHP模块"""
    print("=" * 50)
    print("测试 AHP 层次分析法模块")
    print("=" * 50)

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

    assert result["CR"] < 0.1, "一致性检验未通过"
    assert abs(np.sum(result["weights"]) - 1) < 1e-6, "权重未归一化"

    print("\n✓ AHP 模块测试通过")
    return result["weights"]


def test_ewm():
    """测试EWM模块"""
    print("\n" + "=" * 50)
    print("测试 EWM 熵权法模块")
    print("=" * 50)

    np.random.seed(42)
    X = np.random.rand(20, 6) * 100

    W, H = calculate_entropy_weights(X, verbose=True)

    assert abs(np.sum(W) - 1) < 1e-6, "权重未归一化"
    assert np.all(H >= 0) and np.all(H <= 1), "熵值超出范围"

    print("\n✓ EWM 模块测试通过")
    return W


def test_hybrid():
    """测试混合权重模块"""
    print("\n" + "=" * 50)
    print("测试混合权重模块")
    print("=" * 50)

    W_ahp = np.array([0.360, 0.176, 0.174, 0.112, 0.095, 0.063])
    W_ewm = np.array([0.20, 0.18, 0.15, 0.17, 0.15, 0.15])

    W_hybrid = linear_combination(W_ahp, W_ewm, alpha=0.5)
    print(f"混合权重 (α=0.5): {W_hybrid}")

    assert abs(np.sum(W_hybrid) - 1) < 1e-6, "权重未归一化"

    sensitivity = sensitivity_analysis(W_ahp, W_ewm)
    print(f"\n灵敏度分析测试了 {len(sensitivity)} 个 α 值")

    print("\n✓ 混合权重模块测试通过")
    return W_hybrid


def test_evaluation():
    """测试评估模块"""
    print("\n" + "=" * 50)
    print("测试综合评估模块")
    print("=" * 50)

    W = np.array([0.360, 0.176, 0.112, 0.095, 0.063, 0.174])
    evaluator = OlympicProjectEvaluator(W)

    np.random.seed(42)
    E = np.random.rand(10, 6)

    project_names = [f"项目{i + 1}" for i in range(10)]

    results = evaluator.evaluate_projects(project_names, E)

    print(f"\n评估了 {len(results['projects'])} 个项目")
    print(f"前3名: {[p['name'] for p in results['projects'][:3]]}")

    print("\n✓ 综合评估模块测试通过")


def test_compare_methods():
    """测试方法对比"""
    print("\n" + "=" * 50)
    print("测试方法对比模块")
    print("=" * 50)

    W_ahp = np.array([0.360, 0.176, 0.174, 0.112, 0.095, 0.063])
    W_ewm = np.array([0.20, 0.18, 0.15, 0.17, 0.15, 0.15])

    np.random.seed(42)
    E = np.random.rand(10, 6)

    comparison = compare_methods(E, W_ahp, W_ewm, alpha=0.5)

    print("三种方法的排名一致性:")
    print(
        f"  AHP vs EWM: {np.corrcoef(comparison['AHP']['ranking'], comparison['EWM']['ranking'])[0, 1]:.3f}"
    )
    print(
        f"  AHP vs Hybrid: {np.corrcoef(comparison['AHP']['ranking'], comparison['Hybrid']['ranking'])[0, 1]:.3f}"
    )

    print("\n✓ 方法对比测试通过")


def run_all_tests():
    """运行所有测试"""
    print("\n" + "=" * 60)
    print("开始运行所有计算脚本测试")
    print("=" * 60)

    try:
        W_ahp = test_ahp()
        W_ewm = test_ewm()
        W_hybrid = test_hybrid()
        test_evaluation()
        test_compare_methods()

        print("\n" + "=" * 60)
        print("所有测试通过！✓")
        print("=" * 60)

        return True
    except Exception as e:
        print(f"\n测试失败: {e}")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
