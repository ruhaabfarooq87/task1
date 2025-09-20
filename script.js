class Calculator {
            constructor(previousOperandElement, currentOperandElement) {
                this.previousOperandElement = previousOperandElement;
                this.currentOperandElement = currentOperandElement;
                this.clear();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
            }

            delete() {
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                if (this.currentOperand === '') {
                    this.currentOperand = '0';
                }
            }

            appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
            }

            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                if (this.previousOperand !== '') {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '−':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            this.currentOperand = 'Error';
                            this.previousOperand = '';
                            this.operation = undefined;
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return;
                }
                
                this.currentOperand = computation;
                this.operation = undefined;
                this.previousOperand = '';
            }

            getDisplayNumber(number) {
                if (number === 'Error') return 'Error';
                
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                
                let integerDisplay;
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', {
                        maximumFractionDigits: 0
                    });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            updateDisplay() {
                this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
                if (this.operation != null) {
                    this.previousOperandElement.innerText = 
                        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                } else {
                    this.previousOperandElement.innerText = '';
                }
            }
        }

        // Initialize calculator
        const previousOperandElement = document.getElementById('previousOperand');
        const currentOperandElement = document.getElementById('currentOperand');
        const calculator = new Calculator(previousOperandElement, currentOperandElement);

        // Button event listeners
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                if (currentOperandElement.innerText === 'Error') {
                    calculator.clear();
                }
                calculator.appendNumber(button.getAttribute('data-number'));
                calculator.updateDisplay();
            });
        });

        document.querySelectorAll('[data-operation]').forEach(button => {
            button.addEventListener('click', () => {
                if (currentOperandElement.innerText === 'Error') {
                    calculator.clear();
                }
                calculator.chooseOperation(button.getAttribute('data-operation'));
                calculator.updateDisplay();
            });
        });

        document.querySelector('.equals').addEventListener('click', () => {
            calculator.compute();
            calculator.updateDisplay();
        });

        document.querySelector('.clear').addEventListener('click', () => {
            calculator.clear();
            calculator.updateDisplay();
        });

        document.querySelector('.delete').addEventListener('click', () => {
            if (currentOperandElement.innerText !== 'Error') {
                calculator.delete();
                calculator.updateDisplay();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', event => {
            if (/[0-9]/.test(event.key)) {
                if (currentOperandElement.innerText === 'Error') {
                    calculator.clear();
                }
                calculator.appendNumber(event.key);
                calculator.updateDisplay();
            } else if (event.key === '.') {
                if (currentOperandElement.innerText === 'Error') {
                    calculator.clear();
                }
                calculator.appendNumber('.');
                calculator.updateDisplay();
            } else if (event.key === '+' || event.key === '-') {
                if (currentOperandElement.innerText === 'Error') {
                    calculator.clear();
                }
                calculator.chooseOperation(event.key === '+' ? '+' : '−');
                calculator.updateDisplay();
            } else if (event.key === '*') {
                if (currentOperandElement.innerText === 'Error') {
                    calculator.clear();
                }
                calculator.chooseOperation('×');
                calculator.updateDisplay();
            } else if (event.key === '/') {
                if (currentOperandElement.innerText === 'Error') {
                    calculator.clear();
                }
                calculator.chooseOperation('÷');
                calculator.updateDisplay();
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                calculator.compute();
                calculator.updateDisplay();
            } else if (event.key === 'Backspace') {
                if (currentOperandElement.innerText !== 'Error') {
                    calculator.delete();
                    calculator.updateDisplay();
                }
            } else if (event.key === 'Escape') {
                calculator.clear();
                calculator.updateDisplay();
            }
            
            // Help menu
            if (event.key === 'F1') {
                event.preventDefault();
                document.getElementById('keyboardHelp').style.display = 'flex';
            }
        });

        // Close help modal
        document.getElementById('closeHelp').addEventListener('click', () => {
            document.getElementById('keyboardHelp').style.display = 'none';
        });

        // Close help modal when clicking outside
        document.getElementById('keyboardHelp').addEventListener('click', (e) => {
            if (e.target === document.getElementById('keyboardHelp')) {
                document.getElementById('keyboardHelp').style.display = 'none';
            }
        });

        // Smooth scroll for CTA button
        document.querySelector('.cta-button').addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });

        // Update keyboard hint based on device
        const updateKeyboardHint = () => {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const hintElement = document.getElementById('keyboardHint');
            hintElement.textContent = isMobile ? 'Tap buttons to calculate' : 'Press F1 for keyboard help';
        };

        // Initialize
        updateKeyboardHint();
        window.addEventListener('resize', updateKeyboardHint);