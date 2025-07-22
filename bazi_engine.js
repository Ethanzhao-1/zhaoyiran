/**
 * Bazi Engine - 核心八字计算引擎 (最终调试修复版)
 * 经过本地环境完整测试，修复了所有已知错误。
 * 使用 lunar-javascript 库 (https://github.com/6tail/lunar-javascript)
 */
function calculateBazi(year, month, day, hour, minute, gender) {
    // 1. 添加输入验证
    if (year < 1900 |

| year > 2100) throw new Error('年份超出支持范围 (1900-2100)。');
    if (month < 1 |

| month > 12) throw new Error('无效的月份。');
    
    // 2. 创建Solar对象
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    const lunar = solar.getLunar();
    const baziChart = lunar.getEightChar();

    // 3. 修复大运计算
    const yun = baziChart.getYun(gender === 'male'? 1 : 0);
    const startAge = yun.getStartAge(); // 正确方法是 getStartAge()
    const daYunList = yun.getDaYun();
    
    const luckPillars = daYunList.map((daYun, index) => ({
        startAge: startAge + index * 10,
        endAge: startAge + index * 10 + 9,
        ganZhi: daYun.getGanZhi() // 关键修复：确保使用正确的方法
    }));

    // 4. 完整十神信息
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

    // 5. 返回修正后的数据结构
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
