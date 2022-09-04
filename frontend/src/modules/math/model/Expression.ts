import { Operator } from './Operator';
import { mathDebug } from 'util/debug';

/**
 * Expression and Symbol API:
 *
 * Fields [representation: string, value: string]
 * Methods: [evaluate, calculate, getRepresentation]
 */

/* eslint @typescript-eslint/ban-types: 0 */

class Expression {
    operands: (Expression | Symbol)[];
    operator: Operator;
    representation: string;
    value: number | undefined;
    unknowns: { [key: string]: boolean };

    constructor(operands: (Expression | Symbol)[], operator: Operator) {
        this.operands = operands;
        this.operator = operator;
        this.value = undefined;
        this.unknowns = this.getUnknowns();
        this.getRepresentation();
    }

    /**
     * Sets the expressions representation according to the Operator's representation function
     * @returns String representation of the expression
     */
    getRepresentation = (): string => {
        this.representation = this.operator.representationFunction(
            this.operands.map((operand) => operand.getRepresentation())
        );
        return this.representation;
    };

    /**
     * Evaluates an expression by plugging in a value for a specified variable
     * @param symbol string literal of the variable that is to be replaced
     * @param value numerical value that is to be substituted in place of the variable
     * @returns self
     */
    evaluate = (symbol: string, value: number): Expression => {
        if (this.unknowns[symbol] != undefined) this.unknowns[symbol] = false;
        this.operands.forEach((operand) => operand.evaluate(symbol, value));
        this.getRepresentation();
        return this;
    };

    calculate = (): Expression => {
        // const isCalculable = this.operands.reduce( // calculable => all operands have value
        //     (prev: boolean, curr: Expression | Symbol) => {
        //         return prev && curr.value != undefined;
        //     }, true
        // );

        let isCalculable = true;
        Object.keys(this.unknowns).forEach(
            (key) => (isCalculable = isCalculable && !this.unknowns[key])
        );

        if (mathDebug.logCalculation)
            console.log(
                `Performing Calculation on ${
                    isCalculable ? 'known' : 'unknown'
                } Expression`,
                this
            );

        if (isCalculable) {
            this.value = this.operator.calculationFunction(
                this.operands.map((operand) => {
                    operand.calculate();
                    return operand.value as number;
                })
            );
            const integerDecimalArray = `${this.value}`.split('.');
            const isDecimalNumber = integerDecimalArray.length != 1;
            const decimalDigits = (integerDecimalArray[1] || '0').length;
            // if not decimal or if not over threshold, then replace. otherwise keep the same
            if (
                !(
                    isDecimalNumber &&
                    decimalDigits > mathDebug.lazyCalculationDecimalDigits
                )
            ) {
                this.operands = [new Symbol(`${this.value}`, this.value)];
                this.operator = Operator.get('null');
            }
        } else {
            this.operands.forEach((operand) => operand.calculate());
        }
        this.getRepresentation();
        return this;
    };

    /**
     * Maps string literals (variable representations) to booleans, indicating whether such a variable is present in the expression
     * @returns Map
     */
    getUnknowns = (): { [key: string]: boolean } => {
        let unknowns: { [key: string]: boolean } = {};
        this.operands.forEach((operand) => {
            if (
                operand.constructor.name === 'Symbol' &&
                operand.value == undefined
            ) {
                unknowns[operand.representation] = true;
            } else if (operand.constructor.name === 'Expression') {
                unknowns = {
                    ...unknowns,
                    ...(operand as Expression).getUnknowns(),
                };
            }
        });
        return unknowns;
    };

    plug = (symbol: string, value: number): Expression => {
        this.evaluate(symbol, value);
        this.calculate();
        return this;
    };

    static builder = (): ExpressionBuilder => {
        return new ExpressionBuilder();
    };
}

class ExpressionBuilder {
    bOperands: (Expression | Symbol)[];
    bOperator: Operator;

    constructor() {
        this.bOperands = [];
    }

    operand = (operand: Expression | Symbol): ExpressionBuilder => {
        this.bOperands.push(operand);
        return this;
    };

    operator = (bOperator: Operator | string): ExpressionBuilder => {
        this.bOperator =
            typeof bOperator === 'string' ? Operator.get(bOperator) : bOperator;
        return this;
    };

    build = (): Expression => {
        return new Expression(this.bOperands, this.bOperator);
    };
}

class Symbol {
    representation: string;
    value: number | undefined;

    constructor(representation: string, value: number | undefined) {
        this.representation = representation;
        this.value = value;
    }

    getRepresentation = () => this.representation;

    evaluate = (symbol: string, value: number): Symbol => {
        if (this.representation === symbol) {
            this.value = value;
            this.representation = `${value}`;
        }
        return this;
    };

    calculate = (): Symbol => {
        return this;
    };
}

export { Expression, Symbol };
