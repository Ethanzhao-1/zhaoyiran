/**
 * Bazi Engine - 封装所有八字计算逻辑
 * 使用 lunar-javascript 库 (https://github.com/6tail/lunar-javascript)
 */

function calculateBazi(year, month, day, hour, minute, gender) {
    // lunar-javascript 库需要公历日期对象
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    const lunar = solar.getLunar();
    
    // 获取八字命盘
    // 这个库已经正确处理了节气，所以月柱和年柱是准确的 [1]
    const baziChart = lunar.getEightChar();

    // --- BUG修复开始 ---
    // 1. 获取包含大运信息的 Yun 对象
    const yun = baziChart.getYun(gender === 'male'? 1 : 0);
    // 2. 从 Yun 对象中获取大运数组
    const luckPillarsArray = yun.getDaYun();
    // --- BUG修复结束 ---

    // 获取日主信息
    const dayMaster = baziChart.getDayGan();
    const dayMasterElement = baziChart.getDayGanWuXing();

    // 获取所有十神
    const tenGods = {
        year: baziChart.getYearShiShenGan(),
        month: baziChart.getMonthShiShenGan(),
        day: baziChart.getDayShiShenZhi(), // 日支藏干的十神, 通常取第一个本气
        hour: baziChart.getTimeShiShenGan()
    };

    // 格式化四柱
    const fourPillars = {
        year: {
            gan: baziChart.getYearGan(),
            zhi: baziChart.getYearZhi(),
            ganZhi: baziChart.getYearInGanZhi()
        },
        month: {
            gan: baziChart.getMonthGan(),
            zhi: baziChart.getMonthZhi(),
            ganZhi: baziChart.getMonthInGanZhi()
        },
        day: {
            gan: baziChart.getDayGan(),
            zhi: baziChart.getDayZhi(),
            ganZhi: baziChart.getDayInGanZhi()
        },
        hour: {
            gan: baziChart.getTimeGan(),
            zhi: baziChart.getTimeZhi(),
            ganZhi: baziChart.getTimeInGanZhi()
        }
    };
    
    // 格式化大运 (现在使用正确的数组 luckPillarsArray)
    const formattedLuckPillars = luckPillarsArray.map(p => ({
        startAge: p.getStartAge(),
        endAge: p.getEndAge(),
        ganZhi: p.getGanZhi()
    }));

    // 返回一个结构化的结果对象
    return {
        fourPillars,
        dayMaster: {
            gan: dayMaster,
            element: dayMasterElement
        },
        luckPillars: formattedLuckPillars,
        tenGods
    };
}
