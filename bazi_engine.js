// 常量
const GENDER = { MALE: 1, FEMALE: 0 };
const YEAR_RANGE = { MIN: 1900, MAX: 2100 };
const MONTH_RANGE = { MIN: 1, MAX: 12 };

// 输入验证
function validateInputs(year, month) {
    if (year < YEAR_RANGE.MIN || year > YEAR_RANGE.MAX) throw new Error('年份超出支持范围 (1900-2100)。');
    if (month < MONTH_RANGE.MIN || month > MONTH_RANGE.MAX) throw new Error('无效的月份。');
}

// 日期有效性验证
function isValidDate(year, month, day) {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

// 八字引擎
function calculateBazi(year, month, day, hour, minute, gender) {
    // 输入验证
    validateInputs(year, month);
    if (!isValidDate(year, month, day)) {
        throw new Error('无效的出生日期。');
    }

    // 创建Solar对象
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    const lunar = solar.getLunar();
    const baziChart = lunar.getEightChar();

    // 获取大运
    const yun = baziChart.getYun(gender === 'male' ? GENDER.MALE : GENDER.FEMALE);
    const startAge = yun.getStartAge();
    const daYunList = yun.getDaYun();
    const luckPillars = daYunList.map((daYun, index) => ({
        startAge: startAge + index * 10,
        endAge: startAge + index * 10 + 9,
        ganZhi: daYun.getGanZhi()
    }));

    // 获取四柱
    const fourPillars = {
        year: { gan: baziChart.getYearGan(), zhi: baziChart.getYearZhi() },
        month: { gan: baziChart.getMonthGan(), zhi: baziChart.getMonthZhi() },
        day: { gan: baziChart.getDayGan(), zhi: baziChart.getDayZhi() },
        hour: { gan: baziChart.getTimeGan(), zhi: baziChart.getTimeZhi() }
    };

    // 获取十神信息
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

    // 返回数据
    return { fourPillars, luckPillars, tenGods };
}
