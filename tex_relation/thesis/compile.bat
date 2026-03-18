@echo off
REM 论文编译脚本 (Windows)
REM 使用方法: compile.bat [clean|all|quick]

set MAIN_FILE=main.tex
set OUTPUT_DIR=output

if not exist %OUTPUT_DIR% mkdir %OUTPUT_DIR%

if "%1"=="clean" (
    echo 清理编译文件...
    del /q *.aux *.log *.out *.toc *.lof *.lot *.bbl *.blg *.synctex.gz 2>nul
    del /q %OUTPUT_DIR%\* 2>nul
    echo 清理完成
    goto :end
)

if "%1"=="quick" (
    echo 快速编译 (单次)...
    xelatex -output-directory=%OUTPUT_DIR% %MAIN_FILE%
    echo 快速编译完成
    goto :end
)

echo 完整编译...
REM 第一次编译
echo   [1/4] XeLaTeX 第一次编译...
xelatex -output-directory=%OUTPUT_DIR% %MAIN_FILE%

REM 参考文献
echo   [2/4] BibTeX 处理参考文献...
bibtex %OUTPUT_DIR%\main

REM 第二次编译
echo   [3/4] XeLaTeX 第二次编译...
xelatex -output-directory=%OUTPUT_DIR% %MAIN_FILE%

REM 第三次编译
echo   [4/4] XeLaTeX 第三次编译...
xelatex -output-directory=%OUTPUT_DIR% %MAIN_FILE%

echo.
echo 编译完成!
echo 输出文件: %OUTPUT_DIR%\main.pdf

:end