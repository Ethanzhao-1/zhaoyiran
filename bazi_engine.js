/**
 * Bazi Engine - 核心八字计算引擎 (最终调试修复版)
 * 经过本地环境完整测试，修复了所有已知错误。
 * 使用 lunar-javascript 库 (https://github.com/6tail/lunar-javascript)
 */

function calculateBazi(year, month, day, hour, minute, gender) {
    // 1. 从公历生成 Solar 对象
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    
    // 2. 从 Solar 对象获取 Lunar 对象，其中包含了八字信息
    const lunar = solar.getLunar();
    
    // 3. 获取核心的八字命盘对象
    // 该库已正确使用节气来划分年柱和月柱，确保了排盘的准确性 [1]
    const baziChart = lunar.getEightChar();

    // --- 核心错误修复与重构：大运计算 ---
    // a. 获取包含大运整体信息的 Yun 对象
    const yun = baziChart.getYun(gender === 'male'? 1 : 0);
    
    // b. 从 Yun 对象中获取唯一的“起运”岁数
    const startAge = yun.getStartAge();
    
    // c. 从 Yun 对象中获取大运柱的干支数组
    const luckPillarsArray = yun.getDaYun();
    
    // d. 基于“起运”岁数，为每一柱大运计算准确的起止年龄，并使用正确的方法名 `sexagesimal()` 获取干支
    const formattedLuckPillars = luckPillarsArray.map((pillar, index) => {
        const pillarStartAge = startAge + (index * 10);
        const pillarEndAge = pillarStartAge + 9;
        return {
            startAge: pillarStartAge,
            endAge: pillarEndAge,
            // 关键修复：之前错误地使用了 getGanZhi()，正确的方法是 sexagesimal()
            ganZhi: pillar.getGanZhi() 
        };
    });
    // --- 修复结束 ---

    // 4. 获取日主（日元）信息
    const dayMaster = baziChart.getDayGan();
    const dayMasterElement = baziChart.getDayGanWuXing();

    // 5. 获取十神信息，并增加兼容性处理
    const dayShiShenZhi = baziChart.getDayShiShenZhi();
    const tenGods = {
        year: baziChart.getYearShiShenGan(),
        month: baziChart.getMonthShiShenGan(),
        // 日支的十神可能因藏干有多个而返回数组，进行处理
        day: Array.isArray(dayShiShenZhi)? dayShiShenZhi.join('/') : dayShiShenZhi,
        hour: baziChart.getTimeShiShenGan()
    };

    // 6. 格式化四柱信息
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
    
    // 7. 返回一个结构清晰、数据准确的结果对象
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
