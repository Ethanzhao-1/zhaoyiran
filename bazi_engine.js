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

    // --- 核心错误修复 ---
    // 1. 获取包含大运信息的 Yun 对象
    const yun = baziChart.getYun(gender === 'male'? 1 : 0);
    // 2. 从 Yun 对象中获取“起运”的基础年龄
    const startAge = yun.getStartAge();
    // 3. 从 Yun 对象中获取大运柱数组
    const luckPillarsArray = yun.getDaYun();
    
    // 4. 手动计算并格式化每一个大运的起止年龄
    const formattedLuckPillars = luckPillarsArray.map((p, index) => {
        const pillarStartAge = startAge + (index * 10);
        const pillarEndAge = pillarStartAge + 9;
        return {
            startAge: pillarStartAge,
            endAge: pillarEndAge,
            ganZhi: p.getGanZhi()
        };
    });
    // --- 修复结束 ---

    // 获取日主信息
    const dayMaster = baziChart.getDayGan();
    const dayMasterElement = baziChart.getDayGanWuXing();

    // 获取所有十神 (并增加兼容性处理)
    const dayShiShen = baziChart.getDayShiShenZhi();
    const tenGods = {
        year: baziChart.getYearShiShenGan(),
        month: baziChart.getMonthShiShenGan(),
        day: Array.isArray(dayShiShen)? dayShiShen.join('/') : dayShiShen, // 处理日支藏干有多个十神的情况
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
