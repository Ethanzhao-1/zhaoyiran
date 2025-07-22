// 核心八字计算引擎 - 加入大运排法和阴阳年判断
function calculateBazi(year, month, day, hour, minute, gender, place) {
    // 输入验证
    if (year < 1900 || year > 2100) throw new Error('年份超出支持范围 (1900-2100)。');
    if (month < 1 || month > 12) throw new Error('无效的月份。');

    // 根据出生地获取时区
    const timezoneOffset = getTimezoneOffsetFromPlace(place);
    hour = (hour + timezoneOffset + 24) % 24;

    // 创建Solar对象
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    const lunar = solar.getLunar();
    const baziChart = lunar.getEightChar();

    // 计算大运
    const yun = baziChart.getYun(gender === 'male' ? 1 : 0);
    const startAge = yun.getStartAge();
    const daYunList = yun.getDaYun();
    
    const luckPillars = daYunList.map((daYun, index) => {
        const isYangYear = isYangYear(baziChart.getMonthGan());
        const luck = isYangYear ? "顺排" : "逆排";  // 阴阳年判断
        return {
            startAge: startAge + index * 10,
            endAge: startAge + index * 10 + 9,
            ganZhi: daYun.getGanZhi(),
            luck
        };
    });

    // 完整的十神信息
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
            gan: "日主", 
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

// 判断是否为阳年
function isYangYear(monthGan) {
    const yangYears = ['甲', '丙', '戊', '庚', '王'];
    return yangYears.includes(monthGan);
}

// 获取时区偏移
function getTimezoneOffsetFromPlace(place) {
    if (place === "北京") return 8;
    if (place === "纽约") return -5;
    return 0;
}
