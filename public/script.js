class Calculator {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('calcHistory')) || [];
        this.currentExpression = '';
        this.init();
    }

    init() {
        this.updateHistory();
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        document.getElementById('result').value = '';
    }

    append(value) {
        if (this.validateInput(value)) {
            this.currentExpression += value;
            this.updateDisplay();
        }
    }

    validateInput(value) {
        const lastChar = this.currentExpression.slice(-1);
        const operators = ['+', '-', '*', '/'];
        
        // Prevent multiple operators
        if (operators.includes(value) && operators.includes(lastChar)) return false;
        
        // Validate decimal points
        if (value === '.' && this.currentExpression.split(/[\+\-\*\/]/).pop().includes('.')) return false;
        
        return true;
    }

    calculate() {
        try {
            const sanitized = this.currentExpression
                .replace(/√/g, 'Math.sqrt(')
                .replace(/π/g, Math.PI)
                .replace(/%/g, '/100*');
            
            const result = this.safeEvaluate(sanitized);
            
            if (result === 'Error') throw new Error();
            
            this.history.unshift(`${this.currentExpression} = ${result}`);
            localStorage.setItem('calcHistory', JSON.stringify(this.history));
            this.currentExpression = result.toString();
            this.updateDisplay();
            this.updateHistory();
        } catch {
            this.showError();
        }
    }

    safeEvaluate(expr) {
        try {
            if (!/^[0-9+\-*/().π√% ]+$/.test(expr)) return 'Error';
            const result = new Function(`return ${expr}`)();
            return Number.isFinite(result) ? result : 'Error';
        } catch {
            return 'Error';
        }
    }

    updateDisplay() {
        const resultField = document.getElementById('result');
        resultField.value = this.currentExpression;
        resultField.classList.remove('error');
    }

    showError() {
        const resultField = document.getElementById('result');
        resultField.classList.add('error');
        resultField.value = 'Error';
        setTimeout(() => this.clear(), 1500);
    }

    clear() {
        this.currentExpression = '';
        this.updateDisplay();
    }

    backspace() {
        this.currentExpression = this.currentExpression.slice(0, -1);
        this.updateDisplay();
    }

    updateHistory() {
        document.getElementById('history').innerHTML = this.history
            .slice(0, 5)
            .map(entry => `<div class="history-item">${entry}</div>`)
            .join('');
    }

    handleKeyboard(e) {
        const operations = {
            'Enter': () => this.calculate(),
            'Escape': () => this.clear(),
            'Backspace': () => this.backspace()
        };
        
        if (e.key in operations) operations[e.key]();
        else if (/[0-9+\-*/.%π√()]/.test(e.key)) this.append(e.key);
    }
}

// Initialize calculator
const calculator = new Calculator();

// Window interface
window.appendValue = (v) => calculator.append(v);
window.clearScreen = () => calculator.clear();
window.calculateResult = () => calculator.calculate();
window.backspace = () => calculator.backspace();
window.toggleTheme = () => {
    document.documentElement.setAttribute('data-theme',
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
};