#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Data Validator
验证数据完整性、一致性和可追溯性

数据用途:
- 确保论文数据的学术诚信
- 检查数据来源的可追溯性
- 验证数据完整性

创建日期: 2026-03-18
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Tuple


class DataValidator:
    """数据验证器"""

    def __init__(self):
        self.validation_results = []
        self.errors = []
        self.warnings = []

    def log_result(self, check_name: str, passed: bool, message: str = ""):
        """记录验证结果"""
        result = {
            "check": check_name,
            "passed": passed,
            "message": message,
            "timestamp": datetime.now().isoformat(),
        }
        self.validation_results.append(result)

        if passed:
            print(f"[PASS] {check_name}: {message}")
        else:
            print(f"[FAIL] {check_name}: {message}")
            self.errors.append(f"{check_name}: {message}")

    def log_warning(self, check_name: str, message: str):
        """记录警告"""
        self.warnings.append(f"{check_name}: {message}")
        print(f"[WARN] {check_name}: {message}")

    def validate_completeness(self, projects: List[Dict]) -> Tuple[bool, List[str]]:
        """验证数据完整性

        检查:
        - 所有项目是否有完整的数据
        - 六维指标是否都有值
        - 是否有缺失字段
        """
        print("\n=== 数据完整性检查 ===\n")

        required_indicators = [
            "gender_equity",
            "popularity",
            "sustainability",
            "inclusivity",
            "innovation",
            "safety",
        ]

        missing_data = []

        for project in projects:
            project_name = project.get("name", "Unknown")
            indicators = project.get("indicators", {})

            for indicator in required_indicators:
                if indicator not in indicators:
                    missing_data.append(f"{project_name}: 缺少 {indicator}")
                elif "score" not in indicators[indicator]:
                    missing_data.append(f"{project_name}: {indicator} 缺少 score")
                elif "source" not in indicators[indicator]:
                    missing_data.append(f"{project_name}: {indicator} 缺少 source")

        if missing_data:
            self.log_result("数据完整性", False, f"发现 {len(missing_data)} 个缺失项")
            for item in missing_data:
                self.log_warning("缺失数据", item)
            return False, missing_data
        else:
            self.log_result("数据完整性", True, f"所有 {len(projects)} 个项目数据完整")
            return True, []

    def validate_score_range(self, projects: List[Dict]) -> Tuple[bool, List[str]]:
        """验证评分范围

        检查:
        - 所有评分是否在 [0, 1] 范围内
        """
        print("\n=== 评分范围检查 ===\n")

        out_of_range = []

        for project in projects:
            project_name = project.get("name", "Unknown")
            indicators = project.get("indicators", {})

            for indicator_name, indicator_data in indicators.items():
                if "score" in indicator_data:
                    score = indicator_data["score"]
                    if not (0 <= score <= 1):
                        out_of_range.append(
                            f"{project_name}.{indicator_name}: score={score}"
                        )

        if out_of_range:
            self.log_result("评分范围", False, f"发现 {len(out_of_range)} 个超出范围")
            for item in out_of_range:
                self.log_warning("超出范围", item)
            return False, out_of_range
        else:
            self.log_result("评分范围", True, "所有评分在 [0, 1] 范围内")
            return True, []

    def validate_sources(self, projects: List[Dict]) -> Tuple[bool, List[str]]:
        """验证数据来源

        检查:
        - 每个数据点是否有来源记录
        - 来源信息是否足够详细
        """
        print("\n=== 数据来源检查 ===\n")

        missing_sources = []
        vague_sources = []

        vague_keywords = ["估计", "推测", "未知", "N/A", "待补充"]

        for project in projects:
            project_name = project.get("name", "Unknown")
            indicators = project.get("indicators", {})

            for indicator_name, indicator_data in indicators.items():
                source = indicator_data.get("source", "")

                if not source:
                    missing_sources.append(f"{project_name}.{indicator_name}")
                elif any(kw in source for kw in vague_keywords):
                    vague_sources.append(f"{project_name}.{indicator_name}: {source}")

        if missing_sources:
            self.log_result(
                "数据来源", False, f"发现 {len(missing_sources)} 个缺失来源"
            )
            for item in missing_sources:
                self.log_warning("缺失来源", item)
            return False, missing_sources
        elif vague_sources:
            self.log_result("数据来源", True, "所有数据有来源记录")
            self.log_warning("来源模糊", f"发现 {len(vague_sources)} 个来源描述较模糊")
            return True, vague_sources
        else:
            self.log_result("数据来源", True, "所有数据有明确的来源记录")
            return True, []

    def validate_consistency(self, projects: List[Dict]) -> Tuple[bool, List[str]]:
        """验证数据一致性

        检查:
        - year_added 与 innovation score 是否一致
        - status 与项目特征是否一致
        """
        print("\n=== 数据一致性检查 ===\n")

        inconsistencies = []

        for project in projects:
            project_name = project.get("name", "Unknown")
            year_added = project.get("year_added")
            status = project.get("status")
            indicators = project.get("indicators", {})

            innovation_score = indicators.get("innovation", {}).get("score", 0)

            if year_added:
                recency = 1 - (year_added - 1896) / (2024 - 1896)
                if abs(innovation_score - recency * 0.6) > 0.3:
                    inconsistencies.append(
                        f"{project_name}: year_added={year_added}, "
                        f"innovation_score={innovation_score} 可能不一致"
                    )

            if status == "new" and year_added and year_added < 2020:
                inconsistencies.append(
                    f"{project_name}: status={status} 但 year_added={year_added}"
                )

        if inconsistencies:
            self.log_result(
                "数据一致性", False, f"发现 {len(inconsistencies)} 个潜在不一致"
            )
            for item in inconsistencies:
                self.log_warning("不一致", item)
            return False, inconsistencies
        else:
            self.log_result("数据一致性", True, "数据逻辑一致")
            return True, []

    def validate_thesis_requirements(
        self, projects: List[Dict]
    ) -> Tuple[bool, List[str]]:
        """验证论文要求

        检查:
        - 是否有足够的项目数量
        - 是否覆盖不同类型的项目
        """
        print("\n=== 论文要求检查 ===\n")

        issues = []

        if len(projects) < 10:
            issues.append(f"项目数量不足: {len(projects)} < 10")

        statuses = set(p.get("status") for p in projects)
        required_statuses = {"core", "new", "candidate"}

        missing_statuses = required_statuses - statuses
        if missing_statuses:
            issues.append(f"缺少项目类型: {missing_statuses}")

        if issues:
            self.log_result("论文要求", False, f"发现 {len(issues)} 个问题")
            for item in issues:
                self.log_warning("要求未满足", item)
            return False, issues
        else:
            self.log_result(
                "论文要求", True, f"{len(projects)} 个项目，覆盖类型: {statuses}"
            )
            return True, []

    def generate_validation_report(self) -> str:
        """生成验证报告"""
        report = []
        report.append("# 数据验证报告\n")
        report.append(
            f"**验证日期**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        )

        report.append("## 验证结果摘要\n\n")
        passed = sum(1 for r in self.validation_results if r["passed"])
        total = len(self.validation_results)
        report.append(f"- 通过: {passed}/{total}\n")
        report.append(f"- 错误: {len(self.errors)}\n")
        report.append(f"- 警告: {len(self.warnings)}\n\n")

        if self.errors:
            report.append("## 错误列表\n\n")
            for error in self.errors:
                report.append(f"- {error}\n")
            report.append("\n")

        if self.warnings:
            report.append("## 警告列表\n\n")
            for warning in self.warnings:
                report.append(f"- {warning}\n")
            report.append("\n")

        report.append("## 详细验证结果\n\n")
        for result in self.validation_results:
            status = "✓" if result["passed"] else "✗"
            report.append(f"- {status} **{result['check']}**: {result['message']}\n")

        return "".join(report)

    def run_all_validations(self, projects: List[Dict]) -> Dict:
        """运行所有验证"""
        print("=" * 60)
        print("数据验证器")
        print("=" * 60)

        results = {
            "completeness": self.validate_completeness(projects),
            "score_range": self.validate_score_range(projects),
            "sources": self.validate_sources(projects),
            "consistency": self.validate_consistency(projects),
            "thesis_requirements": self.validate_thesis_requirements(projects),
        }

        all_passed = all(r[0] for r in results.values())

        print("\n" + "=" * 60)
        if all_passed:
            print("验证通过! 数据可用于论文。")
        else:
            print("验证发现问题，请检查上述错误。")
        print("=" * 60)

        return {
            "all_passed": all_passed,
            "results": {k: v[0] for k, v in results.items()},
            "errors": self.errors,
            "warnings": self.warnings,
        }


def main():
    """主函数"""
    # 加载数据
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # 尝试加载整合数据
    data_path = os.path.join(script_dir, "output", "integrated_olympic_data.json")

    if os.path.exists(data_path):
        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        projects = data.get("projects", [])
    else:
        # 使用内置测试数据
        projects = [
            {
                "name": "田径",
                "name_en": "Athletics",
                "year_added": 1896,
                "status": "core",
                "indicators": {
                    "gender_equity": {
                        "score": 0.88,
                        "source": "World Athletics; Paris 2024",
                    },
                    "popularity": {
                        "score": 0.95,
                        "source": "World Athletics; Google Trends",
                    },
                    "sustainability": {"score": 0.70, "source": "项目特性分析"},
                    "inclusivity": {
                        "score": 0.88,
                        "source": "IPC Paris 2024; Olympedia",
                    },
                    "innovation": {"score": 0.35, "source": "Olympedia"},
                    "safety": {
                        "score": 0.75,
                        "source": "Junge et al. (2009) Br J Sports Med",
                    },
                },
            }
        ]

    # 创建验证器并运行
    validator = DataValidator()
    validation_result = validator.run_all_validations(projects)

    # 保存验证报告
    report = validator.generate_validation_report()
    output_dir = os.path.join(script_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    report_path = os.path.join(output_dir, "validation_report.md")

    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"\n验证报告已保存到: {report_path}")


if __name__ == "__main__":
    main()
