#!/bin/bash
# 论文编译脚本
# 使用方法: ./compile.sh [clean|all|quick]

set -e

MAIN_FILE="main.tex"
OUTPUT_DIR="output"

# 创建输出目录
mkdir -p $OUTPUT_DIR

case "$1" in
    clean)
        echo "清理编译文件..."
        rm -f *.aux *.log *.out *.toc *.lof *.lot *.bbl *.blg *.synctex.gz
        rm -rf $OUTPUT_DIR/*
        echo "清理完成"
        ;;
    quick)
        echo "快速编译 (单次)..."
        xelatex -output-directory=$OUTPUT_DIR $MAIN_FILE
        echo "快速编译完成"
        ;;
    all|*)
        echo "完整编译..."
        # 第一次编译
        echo "  [1/4] XeLaTeX 第一次编译..."
        xelatex -output-directory=$OUTPUT_DIR $MAIN_FILE
        
        # 参考文献
        echo "  [2/4] BibTeX 处理参考文献..."
        bibtex $OUTPUT_DIR/main
        
        # 第二次编译
        echo "  [3/4] XeLaTeX 第二次编译..."
        xelatex -output-directory=$OUTPUT_DIR $MAIN_FILE
        
        # 第三次编译 (确保交叉引用正确)
        echo "  [4/4] XeLaTeX 第三次编译..."
        xelatex -output-directory=$OUTPUT_DIR $MAIN_FILE
        
        echo ""
        echo "编译完成!"
        echo "输出文件: $OUTPUT_DIR/main.pdf"
        ;;
esac