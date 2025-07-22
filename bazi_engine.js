document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');

    calculateBtn.addEventListener('click', () => {
        resultContainer.innerHTML = ''; // 每次计算前清空旧结果
        const birthDate = document.getElementById('birth-date').value;
        const birthTime = document.getElementById('birth-time').value;
        const birthPlace = document.getElementById('birth-place').value;
        const gender = document.getElementById('gender').value;

        if (!birthDate || !birthTime || !birthPlace) {
            alert('请输入完整的出生日期、时间和出生地。');
            return;
        }

        const [year, month, day] = birthDate.split('-').map(Number);
        const [hour, minute] = birthTime.split(':').map(Number);

        // 调用Bazi引擎进行计算，并用try...catch捕获潜在错误
        try {
            const baziData = calculateBazi(year, month, day, hour, minute, gender, birthPlace);
            displayResults(baziData);
        } catch (error) {
            console.error("计算或显示时发生错误:", error);
            displayError(error.message);
        } finally {
            resultContainer.classList.remove('hidden');
        }
    });

    function displayResults(data) {
        resultContainer.innerHTML = `
            <h2>命盘分析结果</h2>
            <div id="bazi-chart"></div>
            <div id="day-master-info"></div>
            <div id="luck-pillars"></div>
            <div id="ten-gods-info"></div>
        `;
        displayBaziChart(data.fourPillars);
        displayDayMasterInfo(data.dayMaster);
        displayLuckPillars(data.luckPillars);
        displayTenGodsInfo(data.tenGods);
    }

    // 显示错误信息
    function displayError(message) {
        resultContainer.innerHTML = `
            <div class="error">
                <h3>计算时发生错误</h3>
                <p>${message}</p>
                <p>请检查您的输入或刷新页面重试。</p>
            </div>
        `;
    }
});
