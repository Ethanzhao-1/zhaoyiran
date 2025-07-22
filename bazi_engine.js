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
    
    // d. 基于“起运”岁数，为每一柱大运计算准确的起止年龄，并使用正确的方法名获取干支
    const formattedLuckPillars = luckPillarsArray.map((pillar, index) => {
        const pillarStartAge = startAge + (index * 10);
        const pillarEndAge = pillarStartAge + 9;
        return {
            startAge: pillarStartAge,
            endAge: pillarEndAge,
            ganZhi: pillar.getGanZhi() // 关键修复：确保使用正确的方法
        };
    });
    // --- 修复结束 ---

    // 4. 获取日主（日元）信息
    const dayMaster = baziChart.getDayGan();
    const dayMasterElement = baziChart.getDayGanWuXing();

    // 5. 格式化四柱信息为一个清晰的对象结构
    const fourPillars = {
        year: { gan: baziChart.getYearGan(), zhi: baziChart.getYearZhi() },
        month: { gan: baziChart.getMonthGan(), zhi: baziChart.getMonthZhi() },
        day: { gan: baziChart.getDayGan(), zhi: baziChart.getDayZhi() },
        hour: { gan: baziChart.getTimeGan(), zhi: baziChart.getTimeZhi() }
    };

    // 6. 获取十神信息，并增加兼容性处理
    const dayShiShenZhi = baziChart.getDayShiShenZhi();
    const tenGods = {
        year: { gan: baziChart.getYearShiShenGan(), zhi: baziChart.getYearShiShenZhi().join(' ') },
        month: { gan: baziChart.getMonthShiShenGan(), zhi: baziChart.getMonthShiShenZhi().join(' ') },
        day: { gan: '(日主)', zhi: Array.isArray(dayShiShenZhi)? dayShiShenZhi.join(' ') : dayShiShenZhi },
        hour: { gan: baziChart.getTimeShiShenGan(), zhi: baziChart.getTimeShiShenZhi().join(' ') }
    };
    
    // 7. 返回一个结构清晰、数据准确的结果对象，供前端使用
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
