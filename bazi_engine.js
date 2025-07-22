/**
 * Bazi Engine - 封装所有八字计算逻辑
 * 使用 lunar-javascript 库 (https://github.com/6tail/lunar-javascript)
 */

function calculateBazi(year, month, day, hour, minute, gender) {
    // 处理23:30-24:00时间段（属于次日的子时）
    let adjustedDate = new Date(year, month - 1, day, hour, minute);
    if (hour === 23 && minute >= 30) {
        adjustedDate = new Date(adjustedDate.getTime() + 30 * 60000);
        year = adjustedDate.getFullYear();
        month = adjustedDate.getMonth() + 1;
        day = adjustedDate.getDate();
        hour = 0;
    }

    // 使用lunar-javascript库计算
    const solar = new Solar(year, month, day, hour, minute, 0);
    const lunar = solar.getLunar();
    const baziChart = lunar.getEightChar();

    // 获取大运信息（修正参数传递）
    const luckPillars = baziChart.getYun(gender === 'male' ? 1 : 0, 0).getDaYun();

    // 获取日主信息
    const dayMaster = baziChart.getDayGan();
    const dayMasterElement = baziChart.getDayGanWuXing();

    // 获取十神（修正日支十神处理）
    const dayZhiShen = baziChart.getDayShiShenZhi();
    const formattedDayZhi = Array.isArray(dayZhiShen) ? dayZhiShen.join('/') : dayZhiShen;

    // 返回结构化结果
    return {
        fourPillars: {
            year: baziChart.getYear(),
            month: baziChart.getMonth(),
            day: baziChart.getDay(),
            hour: baziChart.getTime()
        },
        dayMaster: {
            gan: dayMaster,
            element: dayMasterElement
        },
        luckPillars: luckPillars.map(p => ({
            startAge: p.getStartYear(),
            endAge: p.getStartYear() + 9,
            ganZhi: p.getGanZhi()
        })),
        tenGods: {
            year: baziChart.getYearShiShenGan(),
            month: baziChart.getMonthShiShenGan(),
            day: formattedDayZhi,
            hour: baziChart.getTimeShiShenGan()
        }
    };
}
