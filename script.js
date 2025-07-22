document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');

    calculateBtn.addEventListener('click', () => {
        // 1. 获取用户输入
        const birthDate = document.getElementById('birth-date').value;
        const birthTime = document.getElementById('birth-time').value;
        const gender = document.getElementById('gender').value;

        if (!birthDate ||!birthTime) {
            alert('请输入完整的出生日期和时间。');
            return;
        }

        const [year, month, day] = birthDate.split('-').map(Number);
        const [hour, minute] = birthTime.split(':').map(Number);

        // 2. 调用 Bazi 引擎进行计算，并用 try...catch 捕获任何潜在错误
        try {
            const baziData = calculateBazi(year, month, day, hour, minute, gender);
            
            // 3. 将计算结果传递给显示函数
            displayResults(baziData);
            resultContainer.classList.remove('hidden');
        } catch (error) {
            console.error("计算或显示时发生错误:", error);
            alert("计算时发生错误，请检查您的输入或刷新页面重试。");
        }
    });

    // 主显示函数，调用各个子函数来渲染不同模块
    function displayResults(data) {
        displayBaziChart(data.fourPillars);
        displayDayMasterInfo(data.dayMaster);
        displayLuckPillars(data.luckPillars);
        displayTenGodsInfo(data.tenGods);
    }

    // 渲染四柱八字表格
    function displayBaziChart(pillars) {
        const container = document.getElementById('bazi-chart');
        container.innerHTML = `
            <div class="result-section">
                <h3>四柱八字</h3>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>年柱</th>
                            <th>月柱</th>
                            <th>日柱</th>
                            <th>时柱</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>天干</strong></td>
                            <td>${pillars.year.gan}</td>
                            <td>${pillars.month.gan}</td>
                            <td>${pillars.day.gan}</td>
                            <td>${pillars.hour.gan}</td>
                        </tr>
                        <tr>
                            <td><strong>地支</strong></td>
                            <td>${pillars.year.zhi}</td>
                            <td>${pillars.month.zhi}</td>
                            <td>${pillars.day.zhi}</td>
                            <td>${pillars.hour.zhi}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    // 渲染日主信息
    function displayDayMasterInfo(dayMaster) {
        const container = document.getElementById('day-master-info');
        container.innerHTML = `
            <div class="result-section">
                <h3>日主信息</h3>
                <p>您的日主（日元）是：<strong>${dayMaster.gan} (${dayMaster.element})</strong></p>
                <p>日主代表命主本人，是整个八字分析的核心 [2]。</p>
            </div>
        `;
    }

    // 渲染十年大运
    function displayLuckPillars(luckPillars) {
        const container = document.getElementById('luck-pillars');
        let pillarsHtml = luckPillars.map(p => `
            <div class="luck-pillar-item">
                <div class="age">${p.startAge} - ${p.endAge}岁</div>
                <div class="ganzhi">${p.ganZhi}</div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="result-section">
                <h3>十年大运</h3>
                <div class="luck-pillar-grid">${pillarsHtml}</div>
            </div>
        `;
    }

    // 渲染十神信息表格
    function displayTenGodsInfo(tenGods) {
        const container = document.getElementById('ten-gods-info');
        container.innerHTML = `
            <div class="result-section">
                <h3>十神信息</h3>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>年柱</th>
                            <th>月柱</th>
                            <th>日柱</th>
                            <th>时柱</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>天干</strong></td>
                            <td>${tenGods.year.gan}</td>
                            <td>${tenGods.month.gan}</td>
                            <td>${tenGods.day.gan}</td>
                            <td>${tenGods.hour.gan}</td>
                        </tr>
                        <tr>
                            <td><strong>地支藏干</strong></td>
                            <td>${tenGods.year.zhi}</td>
                            <td>${tenGods.month.zhi}</td>
                            <td>${tenGods.day.zhi}</td>
                            <td>${tenGods.hour.zhi}</td>
                        </tr>
                    </tbody>
                </table>
                <p>十神代表日主与其他干支的关系，揭示了性格、人际关系和运势等信息 [3, 4]。</p>
            </div>
        `;
    }
});
