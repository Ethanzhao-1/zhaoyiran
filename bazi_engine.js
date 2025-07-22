/**
 * Bazi Engine - 封装所有八字计算逻辑
 * 使用 lunar-javascript 库 (https://github.com/6tail/lunar-javascript)
 * 版本：1.7.3
 */

function calculateBazi(year, month, day, hour, minute, gender) {
    try {
        // 1. 处理23:30-24:00时间段（属于次日的子时）
        let adjustedDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
        if (hour === 23 && minute >= 30) {
            adjustedDate = new Date(adjustedDate.getTime() + 30 * 60000);
            year = adjustedDate.getUTCFullYear();
            month = adjustedDate.getUTCMonth() + 1;
            day = adjustedDate.getUTCDate();
            hour = 0;
            minute = 0;
        }

        // 2. 使用正确的库方法创建Solar对象（添加时区处理）
        const solar = Lunar.Solar.fromYmdHms(
            year, 
            month, 
            day, 
            hour, 
            minute, 
            0
        );
        
        // 3. 获取农历和八字对象
        const lunar = solar.getLunar();
        const baziChart = lunar.getEightChar();
        
        // 4. 获取大运信息（添加详细日志）
        console.log("计算大运，性别:", gender, "类型:", typeof gender);
        const yun = baziChart.getYun(gender === 'male' ? 1 : 0);
        const luckPillars = yun.getDaYun();
        
        // 5. 获取日主信息
        const dayMaster = baziChart.getDayGan();
        const dayMasterElement = baziChart.getDayGanWuXing();
        
        // 6. 处理日支十神
        const dayZhiShen = baziChart.getDayShiShenZhi();
        const formattedDayZhi = Array.isArray(dayZhiShen) ? 
            dayZhiShen.join('/') : dayZhiShen;
        
        // 7. 返回结构化结果
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
    } catch (error) {
        console.error("八字计算详细错误:", error);
        throw new Error(`八字计算失败: ${error.message}`);
    }
}
