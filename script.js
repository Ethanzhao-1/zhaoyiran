document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');

    calculateBtn.addEventListener('click', () => {
        resultContainer.innerHTML = ''; // 清空旧结果
        showLoadingIndicator(); // 显示加载中提示

        const birthDate = document.getElementById('birth-date').value;
        const birthTime = document.getElementById('birth-time').value;
        const gender = document.getElementById('gender').value;

        // 输入验证
        if (!birthDate || !isValidDateFormat(birthDate)) {
            alert('请输入有效的出生日期，格式应为 YYYY-MM-DD。');
            return;
        }
        if (!birthTime || !isValidTimeFormat(birthTime)) {
            alert('请输入有效的出生时间，格式应为 HH:MM。');
            return;
        }

        const [year, month, day] = birthDate.split('-').map(Number);
        const [hour, minute] = birthTime.split(':').map(Number);

        try {
            const baziData = calculateBazi(year, month, day, hour, minute, gender);
            displayResults(baziData);
        } catch (error) {
            console.error("计算或显示时发生错误:", error);
            displayError(`计算时发生错误: ${error.message}. 请确保您的输入正确。`);
        } finally {
            resultContainer.classList.remove('hidden');
        }
    });

    function showLoadingIndicator() {
        resultContainer.innerHTML = '<p>正在计算，请稍候...</p>';
    }

    function isValidDateFormat(dateStr) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateStr);
    }

    function isValidTimeFormat(timeStr) {
        const regex = /^\d{2}:\d{2}$/;
        return regex.test(timeStr);
    }

    // 渲染和显示结果的函数保持不变
});
