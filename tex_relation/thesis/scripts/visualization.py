"""
可视化模块
Visualization Module
"""

import numpy as np
from typing import List, Optional, Dict
import matplotlib.pyplot as plt
import matplotlib

matplotlib.rcParams["font.sans-serif"] = [
    "SimHei",
    "Microsoft YaHei",
    "Arial Unicode MS",
]
matplotlib.rcParams["axes.unicode_minus"] = False


def plot_weight_comparison(
    W_ahp: np.ndarray,
    W_ewm: np.ndarray,
    W_hybrid: np.ndarray,
    labels: List[str],
    save_path: Optional[str] = None,
):
    """
    绘制权重对比柱状图

    Args:
        W_ahp: AHP权重
        W_ewm: EWM权重
        W_hybrid: 混合权重
        labels: 指标标签
        save_path: 保存路径
    """
    x = np.arange(len(labels))
    width = 0.25

    fig, ax = plt.subplots(figsize=(10, 6))

    bars1 = ax.bar(x - width, W_ahp, width, label="AHP主观权重", color="#3498db")
    bars2 = ax.bar(x, W_ewm, width, label="EWM客观权重", color="#e74c3c")
    bars3 = ax.bar(x + width, W_hybrid, width, label="混合权重", color="#2ecc71")

    ax.set_xlabel("评价指标", fontsize=12)
    ax.set_ylabel("权重值", fontsize=12)
    ax.set_title("三种权重方法对比", fontsize=14)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=10)
    ax.legend()

    ax.set_ylim(0, max(max(W_ahp), max(W_ewm), max(W_hybrid)) * 1.2)

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches="tight")

    plt.close()


def plot_radar_chart(
    scores: np.ndarray,
    labels: List[str],
    title: str = "项目六维评分雷达图",
    save_path: Optional[str] = None,
):
    """
    绘制六维评分雷达图

    Args:
        scores: 六维得分 (6,)
        labels: 指标标签
        title: 图表标题
        save_path: 保存路径
    """
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    scores_plot = np.concatenate([scores, [scores[0]]])
    angles += angles[:1]
    labels_plot = labels + [labels[0]]

    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))

    ax.plot(angles, scores_plot, "o-", linewidth=2, color="#3498db")
    ax.fill(angles, scores_plot, alpha=0.25, color="#3498db")

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels[:-1], fontsize=11)
    ax.set_title(title, fontsize=14, pad=20)

    ax.set_ylim(0, 1)

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches="tight")

    plt.close()


def plot_project_ranking(
    project_names: List[str],
    scores: np.ndarray,
    title: str = "项目综合评分排名",
    save_path: Optional[str] = None,
):
    """
    绘制项目评分排名柱状图

    Args:
        project_names: 项目名称
        scores: 综合评分
        title: 图表标题
        save_path: 保存路径
    """
    sorted_idx = np.argsort(scores)[::-1]
    sorted_names = [project_names[i] for i in sorted_idx]
    sorted_scores = scores[sorted_idx]

    fig, ax = plt.subplots(figsize=(12, 6))

    colors = plt.cm.viridis(np.linspace(0.2, 0.8, len(sorted_scores)))

    bars = ax.barh(range(len(sorted_names)), sorted_scores, color=colors)

    ax.set_yticks(range(len(sorted_names)))
    ax.set_yticklabels(sorted_names, fontsize=10)
    ax.set_xlabel("综合评分", fontsize=12)
    ax.set_title(title, fontsize=14)
    ax.invert_yaxis()

    for i, (bar, score) in enumerate(zip(bars, sorted_scores)):
        ax.text(
            score + 0.01,
            bar.get_y() + bar.get_height() / 2,
            f"{score:.3f}",
            va="center",
            fontsize=9,
        )

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches="tight")

    plt.close()


def plot_sensitivity_analysis(
    sensitivity_results: Dict[float, dict],
    labels: List[str],
    save_path: Optional[str] = None,
):
    """
    绘制灵敏度分析图

    Args:
        sensitivity_results: 灵敏度分析结果
        labels: 指标标签
        save_path: 保存路径
    """
    alphas = sorted(sensitivity_results.keys())
    weights_matrix = np.array([sensitivity_results[a]["weights"] for a in alphas])

    fig, ax = plt.subplots(figsize=(10, 6))

    for j, label in enumerate(labels):
        ax.plot(alphas, weights_matrix[:, j], "o-", label=label, linewidth=2)

    ax.set_xlabel("组合系数 α", fontsize=12)
    ax.set_ylabel("权重值", fontsize=12)
    ax.set_title("权重灵敏度分析", fontsize=14)
    ax.legend(loc="best", fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.set_xlim(0, 1)

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches="tight")

    plt.close()


def generate_all_figures(
    W_ahp: np.ndarray,
    W_ewm: np.ndarray,
    W_hybrid: np.ndarray,
    dimension_scores: np.ndarray,
    project_names: List[str],
    sensitivity_results: Dict[float, dict],
    output_dir: str = "figures/",
):
    """
    生成所有图表

    Args:
        W_ahp, W_ewm, W_hybrid: 三种权重
        dimension_scores: 维度得分矩阵
        project_names: 项目名称
        sensitivity_results: 灵敏度分析结果
        output_dir: 输出目录
    """
    import os

    os.makedirs(output_dir, exist_ok=True)

    labels = ["流行度", "性别平等", "可持续性", "包容性", "创新性", "安全性"]

    plot_weight_comparison(
        W_ahp, W_ewm, W_hybrid, labels, f"{output_dir}weight_comparison.png"
    )

    for i, name in enumerate(project_names[:5]):
        plot_radar_chart(
            dimension_scores[i], labels, f"{name}六维评分", f"{output_dir}radar_{i}.png"
        )

    scores = dimension_scores @ W_hybrid
    plot_project_ranking(
        project_names, scores, "项目综合评分排名", f"{output_dir}ranking.png"
    )

    plot_sensitivity_analysis(
        sensitivity_results, labels, f"{output_dir}sensitivity.png"
    )

    print(f"所有图表已保存至 {output_dir}")


if __name__ == "__main__":
    W_ahp = np.array([0.360, 0.176, 0.174, 0.112, 0.095, 0.063])
    W_ewm = np.array([0.20, 0.18, 0.15, 0.17, 0.15, 0.15])
    W_hybrid = 0.5 * W_ahp + 0.5 * W_ewm

    labels = ["流行度", "性别平等", "安全性", "可持续性", "包容性", "创新性"]

    plot_weight_comparison(W_ahp, W_ewm, W_hybrid, labels)

    np.random.seed(42)
    scores = np.random.rand(6)
    plot_radar_chart(scores, labels)

    print("测试图表生成完成")
