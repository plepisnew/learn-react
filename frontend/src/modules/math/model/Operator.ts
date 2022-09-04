/**
 * Operator Model
 */
class Operator {
    symbol: string;
    name: string;
    calculationFunction: (values: number[]) => number;
    representationFunction: (values: string[]) => string;

    constructor(
        symbol: string,
        name: string,
        calculationFunction: (values: number[]) => number,
        representationFunction: (values: string[]) => string
    ) {
        this.symbol = symbol;
        this.name = name;
        this.calculationFunction = calculationFunction;
        this.representationFunction = representationFunction;
    }

    static builder = (): OperatorBuilder => {
        return new OperatorBuilder();
    };

    /**
     * Converts a string into a corresponding mathematical operator (Operator object)
     * e.g. ```getOperator('+')``` returns Plus Operator.
     * If no operators are matched, returns the null operator i.e. ```null(x) -> x```
     * @param {string} operator Synonym or symbol of the desired operator
     * @returns {Operator} Operator fitting synonym
     */
    static get = (operator: string): Operator => getOperator(operator);
}

/**
 * Builder Pattern for Operator.
 * Accessed using ```Operator.builder()``` and finished using ```.build()```.
 */
class OperatorBuilder {
    bSymbol: string;
    bName: string;
    bCalculationFunction: (values: number[]) => number;
    bRepresentationFunction: (values: string[]) => string;

    symbol = (bSymbol: string): OperatorBuilder => {
        this.bSymbol = bSymbol;
        return this;
    };

    name = (bName: string): OperatorBuilder => {
        this.bName = bName;
        return this;
    };

    calculationFunction = (
        bCalculationFunction: (values: number[]) => number
    ) => {
        this.bCalculationFunction = bCalculationFunction;
        return this;
    };

    representationFunction = (
        bRepresentationFunction: (values: string[]) => string
    ) => {
        this.bRepresentationFunction = bRepresentationFunction;
        return this;
    };

    build = (): Operator => {
        return new Operator(
            this.bSymbol,
            this.bName,
            this.bCalculationFunction,
            this.bRepresentationFunction
        );
    };
}

/**
 * Factory Pattern for Operator.
 * Creates every kind of operator using the Builder Pattern
 */
class OperatorFactory {
    static null = (): Operator => {
        return Operator.builder()
            .symbol('')
            .name('null')
            .calculationFunction((values: number[]) => values[0])
            .representationFunction((values: string[]) => values[0])
            .build();
    };

    static addition = (): Operator => {
        return Operator.builder()
            .symbol('+')
            .name('addition')
            .calculationFunction((values: number[]) => values[0] + values[1])
            .representationFunction(
                (values: string[]) => `(${values[0]}+${values[1]})`
            )
            .build();
    };

    static subtraction = (): Operator => {
        return Operator.builder()
            .symbol('-')
            .name('subtraction')
            .calculationFunction((values: number[]) => values[0] - values[1])
            .representationFunction(
                (values: string[]) => `(${values[0]}-${values[1]})`
            )
            .build();
    };

    static multiplication = (): Operator => {
        return Operator.builder()
            .symbol('*')
            .name('multiplication')
            .calculationFunction((values: number[]) => values[0] * values[1])
            .representationFunction(
                (values: string[]) => `(${values[0]}*${values[1]})`
            )
            .build();
    };

    static division = (): Operator => {
        return Operator.builder()
            .symbol('/')
            .name('division')
            .calculationFunction((values: number[]) => values[0] / values[1])
            .representationFunction(
                (values: string[]) => `(${values[0]}/${values[1]})`
            )
            .build();
    };

    static exponentiation = (): Operator => {
        return Operator.builder()
            .symbol('^')
            .name('exponentiation')
            .calculationFunction((values: number[]) =>
                Math.pow(values[0], values[1])
            )
            .representationFunction(
                (values: string[]) => `(${values[0]}^${values[1]})`
            )
            .build();
    };

    static factorial = (): Operator => {
        return Operator.builder()
            .symbol('!')
            .name('factorial')
            .calculationFunction(factorial)
            .representationFunction((values: string[]) => `(${values[0]}!)`)
            .build();
    };

    static sin = (): Operator => {
        return Operator.builder()
            .symbol('sin')
            .name('sinus')
            .calculationFunction((values: number[]) => Math.sin(values[0]))
            .representationFunction((values: string[]) => `sin(${values[0]})`)
            .build();
    };

    static cos = (): Operator => {
        return Operator.builder()
            .symbol('cos')
            .name('cosinus')
            .calculationFunction((values: number[]) => Math.cos(values[0]))
            .representationFunction((values: string[]) => `cos(${values[0]})`)
            .build();
    };

    static tan = (): Operator => {
        return Operator.builder()
            .symbol('tan')
            .name('tangent')
            .calculationFunction((values: number[]) => Math.tan(values[0]))
            .representationFunction((values: string[]) => `tan(${values[0]})`)
            .build();
    };

    static sqrt = (): Operator => {
        return Operator.builder()
            .symbol('sqrt')
            .name('square root')
            .calculationFunction((values: number[]) => Math.sqrt(values[0]))
            .representationFunction((values: string[]) => `sqrt(${values[0]})`)
            .build();
    };
}

const factorial = (values: number[]): number => {
    if (values[0] == 0) return 1;
    if (values[0] >= 1) return values[0] * factorial([values[0] - 1]);
    return 0;
};

/**
 * Object containing all operators
 */
const operators = {
    null: OperatorFactory.null(),
    add: OperatorFactory.addition(),
    sub: OperatorFactory.subtraction(),
    multi: OperatorFactory.multiplication(),
    div: OperatorFactory.division(),
    exp: OperatorFactory.exponentiation(),
    fact: OperatorFactory.factorial(),
    sin: OperatorFactory.sin(),
    cos: OperatorFactory.cos(),
    tan: OperatorFactory.tan(),
    sqrt: OperatorFactory.sqrt(),
};

/**
 * Converts a string into a corresponding mathematical operator (Operator object)
 * e.g. ```getOperator('+')``` returns Plus Operator.
 * If no operators are matched, returns the null operator i.e. ```null(x) -> x```
 * @param {string} operator Synonym or symbol of the desired operator
 * @returns {Operator} Operator fitting synonym
 */
const getOperator = (operator: string): Operator => {
    if (['null', ''].includes(operator)) return operators.null;
    if (['+', 'plus', 'add', 'addition', 'sum', 'summation'].includes(operator))
        return operators.add;
    if (['-', 'minus', 'sub', 'subtract', 'subtraction'].includes(operator))
        return operators.sub;
    if (['*', 'multiply', 'multi', 'multiplication'].includes(operator))
        return operators.multi;
    if (['/', ':', 'division', 'div', 'divide'].includes(operator))
        return operators.div;
    if (['^', 'exp', 'e', 'exponent', 'exponentiation'].includes(operator))
        return operators.exp;
    if (['!', 'factorial', 'fact'].includes(operator)) return operators.fact;
    if (['sin', 'sinus'].includes(operator)) return operators.sin;
    if (['cos', 'cosinus'].includes(operator)) return operators.cos;
    if (['tan', 'tangent'].includes(operator)) return operators.tan;
    if (['sqrt', 'square root'].includes(operator)) return operators.sqrt;
    return operators.null;
};

export { Operator, operators };
