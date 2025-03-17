class Calculator {
    constructor() {
        this.currentValue = '';
        this.history = [];
        this.sciVisible = false;
        this.historyVisible = false;
        this.init();
    }

    init() {
        document.getElementById('scientificButtons').style.display = 'none';
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    appendValue(value) {
        if (this.validateInput(value)) {
            this.currentValue += value;
            this.updateDisplay();
        }
    }

    appendOperation(operation) {
        const ops = {
            'π': Math.PI.toString(),
            '√(': 'sqrt(',
            '^2': '**2',
            '^': '**'
        };
        
        this.currentValue += ops[operation] || operation;
        this.updateDisplay();
    }

    validateInput(value) {
        const lastChar = this.currentValue.slice(-1);
        const operators = ['+', '-', '*', '/'];
        
        // Prevent invalid sequences.
        if (operators.includes(value) && operators.includes(lastChar)) return false;
        if (value === '.' && this.currentValue.split(/[\+\-\*\/]/).pop().includes('.')) return false;
        
        return true;
    }

    calculateResult() {
        try {
            let expression = this.currentValue
                .replace(/sqrt\(/g, 'Math.sqrt(')
                .replace(/\^/g, '**')
                .replace(/π/g, Math.PI.toString());

            // Security check
            if (!/^[0-9+\-*/().π√\^ ]+$/.test(expression)) throw new Error('Invalid characters');
            
            const result = new Function(`return ${expression}`)();
            
            if (!Number.isFinite(result)) throw new Error();
            
            this.history.unshift(`${this.currentValue} = ${result}`);
            this.currentValue = result.toString();
            this.updateDisplay();
            this.updateHistory();
        } catch {
            this.showError();
        }
    }

    showError() {
        const display = document.getElementById('result');
        display.value = 'Error';
        display.classList.add('error');
        setTimeout(() => {
            this.clearScreen();
            display.classList.remove('error');
        }, 1500);
    }

    clearScreen() {
        this.currentValue = '';
        this.updateDisplay();
    }

    backspace() {
        this.currentValue = this.currentValue.slice(0, -1);
        this.updateDisplay();
    }

    toggleScientific() {
        const sciPanel = document.getElementById('scientificButtons');
        this.sciVisible = !this.sciVisible;
        sciPanel.style.display = this.sciVisible ? 'grid' : 'none';
    }

    toggleHistory() {
        const historyPanel = document.getElementById('historyPanel');
        this.historyVisible = !this.historyVisible;
        historyPanel.style.display = this.historyVisible ? 'block' : 'none';
    }

    clearHistory() {
        this.history = [];
        this.updateHistory();
    }

    updateDisplay() {
        document.getElementById('result').value = this.currentValue;
    }

    updateHistory() {
        const historyElement = document.getElementById('history');
        historyElement.innerHTML = this.history
            .map(entry => `<div class="history-item">${entry}</div>`)
            .join('');
    }

    handleKeyboard(e) {
        const keyMap = {
            'Enter': () => this.calculateResult(),
            'Escape': () => this.clearScreen(),
            'Backspace': () => this.backspace()
        };
        
        if (keyMap[e.key]) {
            keyMap[e.key]();
        } else if (/[0-9+\-*/.^]/.test(e.key)) {
            this.appendValue(e.key);
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Expose methods to window
window.appendValue = (v) => calculator.appendValue(v);
window.appendOperation = (op) => calculator.appendOperation(op);
window.clearScreen = () => calculator.clearScreen();
window.calculateResult = () => calculator.calculateResult();
window.backspace = () => calculator.backspace();
window.toggleScientific = () => calculator.toggleScientific();
window.toggleHistory = () => calculator.toggleHistory();
window.clearHistory = () => calculator.clearHistory();