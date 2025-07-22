/**
 * Bazi Engine - 核心八字计算引擎 (最终修复版)
 * 使用 lunar-javascript 库 (https://github.com/6tail/lunar-javascript)
 */

function calculateBazi(year, month, day, hour, minute, gender) {
    // 1. 从公历生成 Solar 对象
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    
    // 2. 获取 Lunar 对象
    const lunar = solar.getLunar();
    
    // 3. 获取核心八字命盘
    const baziChart = lunar.getEightChar();

    // --- 大运计算修复 ---
    const yun = baziChart.getYun(gender === 'male' ? 1 : 0);
    const startAge = yun.getStartAge();
    const luckPillarsArray = yun.getDaYun();
    
    // 计算精确起运时间
    const birthSolar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    const startSolar = yun.getStartSolar();
    const monthDiff = calculateMonthDiff(birthSolar, startSolar);
    const startYears = Math.floor(monthDiff / 12);
    const startMonths = monthDiff % 12;
    
    // 重构大运数据结构
    const formattedLuckPillars = luckPillarsArray.map((pillar, index) => {
        const pillarStartTotalMonths = monthDiff + index * 120; // 120个月=10年
        const pillarEndTotalMonths = pillarStartTotalMonths + 120;
        
        return {
            // 整数虚岁范围（兼容传统排盘）
            startAge: startAge + index * 10,
            endAge: startAge + index * 10 + 9,
            // 精确时间范围（年+月）
            exactStart: convertMonths(pillarStartTotalMonths),
            exactEnd: convertMonths(pillarEndTotalMonths),
            ganZhi: pillar.getGanZhi()
        };
    });

    // --- 十神信息增强 ---
    const tenGods = {
        year: {
            gan: baziChart.getYearShiShenGan(),
            zhi: baziChart.getYearShiShenZhi()
        },
        month: {
            gan: baziChart.getMonthShiShenGan(),
            zhi: baziChart.getMonthShiShenZhi()
        },
        day: {
            gan: baziChart.getDayShiShenGan(),
            zhi: baziChart.getDayShiShenZhi()
        },
        hour: {
            gan: baziChart.getTimeShiShenGan(),
            zhi: baziChart.getTimeShiShenZhi()
        }
    };

    // 4. 格式化四柱信息
    const fourPillars = {
        year: baziChart.getYearInGanZhi(),
        month: baziChart.getMonthInGanZhi(),
        day: baziChart.getDayInGanZhi(),
        hour: baziChart.getTimeInGanZhi(),
        details: {
            year: { gan: baziChart.getYearGan(), zhi: baziChart.getYearZhi() },
            month: { gan: baziChart.getMonthGan(), zhi: baziChart.getMonthZhi() },
            day: { gan: baziChart.getDayGan(), zhi: baziChart.getDayZhi() },
            hour: { gan: baziChart.getTimeGan(), zhi: baziChart.getTimeZhi() }
        }
    };
    
    // 5. 返回结构化结果
    return {
        fourPillars,
        dayMaster: {
            gan: baziChart.getDayGan(),
            element: baziChart.getDayGanWuXing()
        },
        luckPillars: formattedLuckPillars,
        luckPillarStartAge: {
            exact: { years: startYears, months: startMonths },
            traditional: startAge
        },
        tenGods
    };
}

// ===== 工具函数 =====
function calculateMonthDiff(startSolar, endSolar) {
    let months = (endSolar.getYear() - startSolar.getYear()) * 12;
    months += endSolar.getMonth() - startSolar.getMonth();
    
    // 处理日期的精确差异
    if (endSolar.getDay() < startSolar.getDay()) {
        months--;
    }
    return months;
}

function convertMonths(totalMonths) {
    return {
        years: Math.floor(totalMonths / 12),
        months: totalMonths % 12
    };
}
