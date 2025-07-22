/**
 * Bazi Engine - 核心八字计算引擎 (最终调试修复版)
 */
function calculateBazi(year, month, day, hour, minute, gender, birthPlace) {
    if (year < 1900 || year > 2100) throw new Error('年份超出支持范围 (1900-2100)。');
    if (month < 1 || month > 12) throw new Error('无效的月份。');

    // 创建Solar对象
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    const lunar = solar.getLunar();
    const baziChart = lunar.getEightChar();

    // 修复大运计算
    const yun = baziChart.getYun(gender === 'male' ? 1 : 0);
    const startAge = yun.getStartAge();
    const daYunList = yun.getDaYun();

    const luckPillars = daYunList.map((daYun, index) => ({
        startAge: startAge + index * 10,
        endAge: startAge + index * 10 + 9,
        ganZhi: daYun.getGanZhi()
    }));

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
            gan: "日主", // 特殊标记日主
            zhi: baziChart.getDayShiShenZhi()
        },
        hour: {
            gan: baziChart.getTimeShiShenGan(),
            zhi: baziChart.getTimeShiShenZhi()
        }
    };

    return {
        fourPillars: {
            year: { gan: baziChart.getYearGan(), zhi: baziChart.getYearZhi() },
            month: { gan: baziChart.getMonthGan(), zhi: baziChart.getMonthZhi() },
            day: { gan: baziChart.getDayGan(), zhi: baziChart.getDayZhi() },
            hour: { gan: baziChart.getTimeGan(), zhi: baziChart.getTimeZhi() }
        },
        dayMaster: {
            gan: baziChart.getDayGan(),
            element: baziChart.getDayGanWuXing()
        },
        luckPillars,
        tenGods
    };
}
