#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IPC Paralympic Data Collector
从 IPC 官网采集残奥会数据

数据用途:
- 计算包容性指标 (E_inclusivity)
- 确定各奥运项目与残奥会的关联
- 为论文第四章提供包容性评估数据

创建日期: 2026-03-18
"""

import json
import os
from datetime import datetime
from typing import Dict, List

# 夏季残奥会运动列表 (IPC 官网验证数据)
SUMMER_PARALYMPIC_SPORTS = [
    {
        "id": 1,
        "name_en": "Para Archery",
        "name_cn": "射箭",
        "olympic_match": "Archery",
        "has_olympic_equivalent": True,
    },
    {
        "id": 2,
        "name_en": "Para Athletics",
        "name_cn": "田径",
        "olympic_match": "Athletics",
        "has_olympic_equivalent": True,
    },
    {
        "id": 3,
        "name_en": "Para Badminton",
        "name_cn": "羽毛球",
        "olympic_match": "Badminton",
        "has_olympic_equivalent": True,
    },
    {
        "id": 4,
        "name_en": "Blind Football",
        "name_cn": "盲人足球",
        "olympic_match": "Football",
        "has_olympic_equivalent": True,
    },
    {
        "id": 5,
        "name_en": "Boccia",
        "name_cn": "硬地滚球",
        "olympic_match": None,
        "has_olympic_equivalent": False,
    },
    {
        "id": 6,
        "name_en": "Para Canoe",
        "name_cn": "皮划艇",
        "olympic_match": "Canoe",
        "has_olympic_equivalent": True,
    },
    {
        "id": 7,
        "name_en": "Para Climbing",
        "name_cn": "攀岩",
        "olympic_match": "Sport Climbing",
        "has_olympic_equivalent": True,
        "note": "LA28新增",
    },
    {
        "id": 8,
        "name_en": "Para Cycling",
        "name_cn": "自行车",
        "olympic_match": "Cycling",
        "has_olympic_equivalent": True,
    },
    {
        "id": 9,
        "name_en": "Para Equestrian",
        "name_cn": "马术",
        "olympic_match": "Equestrian",
        "has_olympic_equivalent": True,
    },
    {
        "id": 10,
        "name_en": "Para Fencing",
        "name_cn": "轮椅击剑",
        "olympic_match": "Fencing",
        "has_olympic_equivalent": True,
    },
    {
        "id": 11,
        "name_en": "Goalball",
        "name_cn": "盲人门球",
        "olympic_match": None,
        "has_olympic_equivalent": False,
    },
    {
        "id": 12,
        "name_en": "Para Judo",
        "name_cn": "柔道",
        "olympic_match": "Judo",
        "has_olympic_equivalent": True,
    },
    {
        "id": 13,
        "name_en": "Para Powerlifting",
        "name_cn": "力量举重",
        "olympic_match": "Weightlifting",
        "has_olympic_equivalent": True,
    },
    {
        "id": 14,
        "name_en": "Para Rowing",
        "name_cn": "赛艇",
        "olympic_match": "Rowing",
        "has_olympic_equivalent": True,
    },
    {
        "id": 15,
        "name_en": "Shooting Para Sport",
        "name_cn": "射击",
        "olympic_match": "Shooting",
        "has_olympic_equivalent": True,
    },
    {
        "id": 16,
        "name_en": "Sitting Volleyball",
        "name_cn": "坐式排球",
        "olympic_match": "Volleyball",
        "has_olympic_equivalent": True,
    },
    {
        "id": 17,
        "name_en": "Para Swimming",
        "name_cn": "游泳",
        "olympic_match": "Swimming",
        "has_olympic_equivalent": True,
    },
    {
        "id": 18,
        "name_en": "Para Table Tennis",
        "name_cn": "乒乓球",
        "olympic_match": "Table Tennis",
        "has_olympic_equivalent": True,
    },
    {
        "id": 19,
        "name_en": "Para Taekwondo",
        "name_cn": "跆拳道",
        "olympic_match": "Taekwondo",
        "has_olympic_equivalent": True,
    },
    {
        "id": 20,
        "name_en": "Para Triathlon",
        "name_cn": "铁人三项",
        "olympic_match": "Triathlon",
        "has_olympic_equivalent": True,
    },
    {
        "id": 21,
        "name_en": "Wheelchair Basketball",
        "name_cn": "轮椅篮球",
        "olympic_match": "Basketball",
        "has_olympic_equivalent": True,
    },
    {
        "id": 22,
        "name_en": "Wheelchair Rugby",
        "name_cn": "轮椅橄榄球",
        "olympic_match": None,
        "has_olympic_equivalent": False,
    },
    {
        "id": 23,
        "name_en": "Wheelchair Tennis",
        "name_cn": "轮椅网球",
        "olympic_match": "Tennis",
        "has_olympic_equivalent": True,
    },
]

# 冬季残奥会运动列表
WINTER_PARALYMPIC_SPORTS = [
    {"id": 1, "name_en": "Para Alpine Skiing", "name_cn": "高山滑雪"},
    {"id": 2, "name_en": "Para Biathlon", "name_cn": "冬季两项"},
    {"id": 3, "name_en": "Para Cross-Country Skiing", "name_cn": "越野滑雪"},
    {"id": 4, "name_en": "Para Ice Hockey", "name_cn": "冰球"},
    {"id": 5, "name_en": "Para Snowboard", "name_cn": "单板滑雪"},
    {"id": 6, "name_en": "Wheelchair Curling", "name_cn": "轮椅冰壶"},
]

# 数据来源元信息
DATA_SOURCE = {
    "organization": "International Paralympic Committee (IPC)",
    "url": "https://www.paralympic.org/sports",
    "access_date": "2026-03-18",
    "verification_method": "webfetch",
    "collector": "AI Assistant",
}

# 论文中使用的奥运项目列表
OLYMPIC_PROJECTS = [
    {"name_cn": "田径", "name_en": "Athletics"},
    {"name_cn": "游泳", "name_en": "Swimming"},
    {"name_cn": "体操", "name_en": "Gymnastics"},
    {"name_cn": "篮球", "name_en": "Basketball"},
    {"name_cn": "足球", "name_en": "Football"},
    {"name_cn": "攀岩", "name_en": "Sport Climbing"},
    {"name_cn": "冲浪", "name_en": "Surfing"},
    {"name_cn": "滑板", "name_en": "Skateboarding"},
    {"name_cn": "霹雳舞", "name_en": "Breaking"},
    {"name_cn": "电子竞技", "name_en": "Esports"},
    {"name_cn": "匹克球", "name_en": "Pickleball"},
    {"name_cn": "板球", "name_en": "Cricket"},
    {"name_cn": "空手道", "name_en": "Karate"},
    {"name_cn": "棒球/垒球", "name_en": "Baseball/Softball"},
]


class IPCDataCollector:
    """IPC Paralympic 数据采集器"""

    def __init__(self, output_dir: str = "./output"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def get_paralympic_sports(self) -> Dict:
        """获取残奥会运动列表

        论文用途:
        - 计算包容性指标中的残奥关联项
        - 公式: D_para = 1 (该项目在残奥会存在) / 0 (不存在)
        - 用于论文第四章 4.1 节数据预处理
        """
        return {
            "summer_sports": SUMMER_PARALYMPIC_SPORTS,
            "winter_sports": WINTER_PARALYMPIC_SPORTS,
            "total_summer": len(SUMMER_PARALYMPIC_SPORTS),
            "total_winter": len(WINTER_PARALYMPIC_SPORTS),
        }

    def calculate_inclusivity_scores(self) -> List[Dict]:
        """计算各奥运项目的包容性残奥关联分

        论文用途:
        - 用于计算包容性指标 E_inclusivity
        - E_incl = w1 × D_para + w2 × D_dev
        - D_para 为残奥关联得分 (0 或 1)
        """
        results = []
        para_sport_names = [
            s["olympic_match"]
            for s in SUMMER_PARALYMPIC_SPORTS
            if s["has_olympic_equivalent"]
        ]

        for project in OLYMPIC_PROJECTS:
            has_para = project["name_en"] in para_sport_names
            results.append(
                {
                    "name_cn": project["name_cn"],
                    "name_en": project["name_en"],
                    "paralympic_association": has_para,
                    "paralympic_score": 1 if has_para else 0,
                    "source": "IPC Paralympic Sports List",
                }
            )

        return results

    def generate_inclusivity_data(self) -> Dict:
        """生成完整的包容性数据

        论文用途:
        - 直接用于论文第四章实验
        - 可导出为 JSON 供评估模型使用
        """
        return {
            "metadata": {
                "source": "IPC Paralympic (paralympic.org)",
                "access_date": "2026-03-18",
                "description": "残奥关联数据，用于计算包容性指标",
                "thesis_section": "第四章 4.1 数据来源与预处理",
                "indicator": "E_inclusivity - 包容性指标",
            },
            "paralympic_sports": self.get_paralympic_sports(),
            "olympic_para_mapping": self.calculate_inclusivity_scores(),
            "statistics": {
                "total_para_sports_with_olympic": len(
                    [s for s in SUMMER_PARALYMPIC_SPORTS if s["has_olympic_equivalent"]]
                ),
                "total_para_sports_unique": len(
                    [
                        s
                        for s in SUMMER_PARALYMPIC_SPORTS
                        if not s["has_olympic_equivalent"]
                    ]
                ),
            },
        }

    def save_data(self, filename: str = "ipc_paralympic_data.json"):
        """保存数据到文件"""
        data = self.generate_inclusivity_data()
        filepath = os.path.join(self.output_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"数据已保存到: {filepath}")
        return filepath


def main():
    """主函数"""
    print("=" * 60)
    print("IPC Paralympic 数据采集器")
    print("=" * 60)
    print("\n数据用途说明:")
    print("- 采集残奥会运动项目数据")
    print("- 计算奥运项目的残奥关联得分")
    print("- 用于论文包容性指标计算")
    print("=" * 60)

    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, "output")

    # 创建采集器并生成数据
    collector = IPCDataCollector(output_dir)
    collector.save_data()

    # 打印包容性计算结果
    print("\n奥运项目残奥关联得分:")
    print("-" * 50)
    scores = collector.calculate_inclusivity_scores()
    for item in scores:
        status = (
            "[YES] 有残奥关联" if item["paralympic_association"] else "[NO] 无残奥关联"
        )
        print(f"{item['name_cn']:10} | {status}")
    print("-" * 50)

    print("\n数据-论文映射:")
    print("-" * 50)
    print("1. 残奥运动列表 → 论文 4.1 节")
    print("   用途: 确定残奥关联数据来源")
    print("2. 残奥关联得分 → 论文 4.2 节")
    print("   用途: 计算包容性指标 E_inclusivity")
    print("3. 项目映射表 → 论文附录")
    print("   用途: 数据来源追溯")
    print("-" * 50)


if __name__ == "__main__":
    main()
