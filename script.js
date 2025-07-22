document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');
    const loadingIndicator = document.getElementById('loading');

    calculateBtn.addEventListener('click', () => {
        resultContainer.innerHTML = ''; // 每次计算前清空旧结果
        loadingIndicator.classList.remove('hidden'); // 显示加载提示

        const birthDate = document.getElementById('birth-date').value;
        const birthTime = document.getElementById('birth-time').value;
        const birthPlace = document.getElementBy
