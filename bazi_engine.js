/* 通用样式 */
body {
    font-family: 'Noto Sans SC', sans-serif;
    background-color: #f9f5ef;
    color: #333;
    line-height: 1.6;
    padding: 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

header {
    text-align: center;
    margin-bottom: 20px;
}

input, select, button {
    padding: 10px;
    margin: 10px 0;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #ddd;
}

button {
    background-color: #8a6d3b;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #7a5f31;
}

.hidden {
    display: none;
}

/* 结果部分 */
.result-section {
    margin-bottom: 20px;
}

.error {
    background-color: #ffebee;
    padding: 15px;
    border-radius: 6px;
    color: #b71c1c;
}
