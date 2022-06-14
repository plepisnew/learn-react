class Expression {
    constructor() {

    }
}

class Equation {
    constructor() {

    }
}

class Variable {

    static constant(symbol) {
        this.symbol = symbol;
        this.isConstant = true;
    }
    static var(symbol) {
        this.symbol = symbol;
        this.isConstant = false;
    }
}

class Term {
    
    constructor() {
        
    }
}

class Operator {

    static plus(exp1, exp2) {

    }
    static minus(exp1, exp2) {

    }
    static multiply(exp1, exp2) {

    }
    static divide(exp1, exp2) {

    }
    static sin(exp) {
        
    }
    static cos(exp) {

    }
    static pow(base, exponent) {

    }
    static log(base, operand) {

    }
    static factorial(operand) {

    }
    static integral(exp, wrt) {

    }
    static defIntegral(exp, wrt, lower, upper) {

    }
    static derivative(exp, wrt) {

    }
    static sum(exp, lower, upper) {

    }
    static product(exp, lower, upper) {

    }
}

const operatorLiteral = [
    // Elementary
    { name: 'plus', operands: 2 }, // two summables
    { name: 'minus', operands: 2 }, // two substractables
    { name: 'multiply', operands: 2 }, // two multiplicables
    { name: 'divide', operands: 2 }, // two dividables
    // Trigonometry
    { name: 'sin', operands: 1 }, // one angle
    { name: 'cos', operands: 1 }, // one angle
    // Exponentation
    { name: 'pow', operands: 2 }, // base and exponent
    { name: 'log', operands: 2 }, // base and operand
    // Combinatorics
    { name: 'factorial', operands: 1}, // one integer
    // Calculus
    { name: 'def-integral', operands: 3 }, // expression and two bounds
    { name: 'integral', operands: 1 }, // expression
    { name: 'derivative', operands: 1 }, // expression
    { name: 'sum', operands: 3 }, // expression and two bounds
    { name: 'product', operands: 3 }, // expression and two bounds
];

const constants = [
    { name: 'e', value: 2.718281828459045 }, // Base of natural logarithm
    { name: 'pi', value: Math.PI }, // Half the circumference of unit circle
    { name: 'phi', value: (1+Math.sqrt(5))/2 }, // Golden ratio
    { name: 'i', value: 'kek' }, // Imaginary constant
]

class ExpressionManager {

    static toString(expression) {

    }

    static toExpression(str) {

    }
}
