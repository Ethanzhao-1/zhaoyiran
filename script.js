// 现代JavaScript实践：将代码包裹在事件监听器中，确保DOM完全加载
// (虽然 'defer' 已经处理了这个问题，但这是一种更明确、更健壮的模式)
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 缓存DOM元素 ---
    // 最佳实践：将频繁访问的DOM元素存储在变量中，以提高性能，避免重复查询。
    const fortuneForm = document.getElementById('fortuneForm');
    const userNameInput = document.getElementById('userName');
    const birthDateInput = document.getElementById('birthDate');
    const loader = document.getElementById('loader');
    const revealSection = document.getElementById('reveal');
    const resultCard = document.getElementById('resultCard');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');

    // --- 2. 占卜数据 ---
    // 将数据与逻辑分离，便于维护和扩展。
    const fortunes = {
        spring: "春天出生的你，如同初生的嫩芽，充满了无限的生机与可能。近期，一次意想不到的相遇将为你带来新的机遇，请敞开心扉，勇敢迎接。",
        summer: "夏天出生的你，热情如火，光芒四射。你的创造力正处于顶峰，一个搁置已久的项目将迎来突破。记住，大胆的行动胜过犹豫不决。",
        autumn: "秋天出生的你，内心丰盈而沉静，如同收获的季节。是时候审视内心，进行一次深刻的自我反思。答案不在远方，而在你的心中。",
        winter: "冬天出生的你，坚韧而富有智慧，能在沉寂中积蓄力量。一段旧的篇章即将结束，新的开始就在眼前。放手过去，才能拥抱未来。",
        default: "你的命运轨迹独特而神秘，星辰暗示着一场即将到来的重大转变。保持警觉，相信你的直觉，它将是你最强大的向导。"
    };

    // --- 3. 事件监听 ---
    // 使用 'submit' 事件而非 'click'，这对于表单是更标准、更具可访问性的做法。
    fortuneForm.addEventListener('submit', (event) => {
        // 阻止表单的默认提交行为，防止页面刷新。
        event.preventDefault();

        // 获取并验证用户输入
        const userName = userNameInput.value.trim();
        const birthDate = birthDateInput.value;

        if (!userName ||!birthDate) {
            alert('请填写你所有的信息，命运的启示需要完整的指引。');
            return;
        }

        // 开始占卜流程
        startRitual(birthDate, userName);
    });

    /**
     * 开始占卜仪式：显示加载动画并触发计算
     * @param {string} dateString - 用户输入的出生日期 (YYYY-MM-DD)
     * @param {string} name - 用户输入的名字
     */
    const startRitual = (dateString, name) => {
        // 隐藏旧结果并显示加载动画
        revealSection.classList.add('hidden');
        resultCard.classList.remove('visible');
        loader.classList.remove('hidden');

        // 模拟计算过程，营造期待感
        setTimeout(() => {
            const fortune = calculateFortune(dateString, name);
            displayFortune(fortune, name);
        }, 2500); // 2.5秒延迟
    };

    /**
     * 计算运势
     * @param {string} dateString - 出生日期字符串
     * @param {string} name - 用户名
     * @returns {string} - 计算出的运势文本
     */
    const calculateFortune = (dateString, name) => {
        // 最佳实践：显式类型转换。从input[type=date]获取的值是字符串。
        const date = new Date(dateString);
        const month = date.getMonth() + 1; // getMonth() 返回 0-11

        let season;
        if (month >= 3 && month <= 5) {
            season = 'spring';
        } else if (month >= 6 && month <= 8) {
            season = 'summer';
        } else if (month >= 9 && month <= 11) {
            season = 'autumn';
        } else { // 12, 1, 2
            season = 'winter';
        }
        
        // 增加一点基于名字的“随机性”，让结果看起来更个性化
        const nameLengthFactor = name.length % 4;
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        if (nameLengthFactor === 1 && season!== 'summer') return fortunes.summer;
        if (nameLengthFactor === 2 && season!== 'autumn') return fortunes.autumn;
        
        return fortunes[season] |

| fortunes.default;
    };

    /**
     * 显示最终的占卜结果
     * @param {string} fortuneText - 运势文本
     * @param {string} name - 用户名
     */
    const displayFortune = (fortuneText, name) => {
        // 隐藏加载动画
        loader.classList.add('hidden');

        // 填充结果卡片内容
        resultTitle.textContent = `致 ${name} 的星辰密语`;
        resultText.textContent = fortuneText;

        // 以动画效果显示结果卡片
        revealSection.classList.remove('hidden');
        // 使用一个微小的延迟来确保 'display' 属性的改变先生效，从而触发CSS过渡
        setTimeout(() => {
            resultCard.classList.add('visible');
        }, 50);
    };
});
