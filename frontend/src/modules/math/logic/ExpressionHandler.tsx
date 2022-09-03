import React from 'react';
import { Expression, Symbol } from 'modules/math/model/Expression';
import { math } from 'util/constants';

/**
 * Compares string representations of operators and returns an integer depending on which has greater precedence.
 * 1 if first argument has precedence, -1 if second argument has precendece, 0 if both have equal precedence.
 * @param op1 string representation of first operator
 * @param op2 string representation of second operator
 * @returns integer representating precedence
 */
const compare = (op1: string, op2: string): number => {
    let val1 = math.precedence.indexOf(op1);
    let val2 = math.precedence.indexOf(op2);
    if(val1 > val2) return -1; // first operator is farther (lower precedence), return -1
    if(val1 == val2) return 0; // both operators at same index (equal precedence), return 0
    return 1; // first operator is closer (higher precedence), return 1
}

/**
 * 
 * @param expr expression string representation, which is taken from client-side
 * @returns Expression string representation with parentheses placed around every operation
 */
const parenthesize = (expr: string): string => {
    console.log(expr);
    return '';
}

/**
 * Recursively f(a) + f(b)
 * @param expr expression string representation, which is taken from `parenthesize`
 * @returns Expression object which can be manipulated and evaluated
 */
const stringToExpression = (expr: string | (string | Expression)[]): Expression => {

    const exprArray: (string | Expression)[] = typeof expr === 'string' ? expr.split('') : expr;
    let deepestLevel = 0;
    let deepestIndex = 0;
    let level = 0;

    for(let i = 0; i < exprArray.length; i++) {
        const char = exprArray[i];
        if(char === '(') {
            level++;
            if(level > deepestLevel) deepestIndex = i;
        } else if (char === ')') {
            level--;
        }
    }
    const left = deepestIndex;
    const right = exprArray.indexOf(')', left);
    const simpleElements = exprArray.slice(left + 1, right);
    math.precedence.forEach(operator => {
        const operatorIndex = simpleElements.indexOf(operator);
        if(operatorIndex != -1) {
            const firstElement = simpleElements[operatorIndex - 1];
            const secondElement = simpleElements[operatorIndex + 1];
            const exp1 = typeof firstElement === 'string' ? 
                new Symbol(firstElement, parseInt(firstElement) || undefined) :
                firstElement;
                
            const exp2 = typeof secondElement === 'string' ?
                new Symbol(secondElement, parseInt(secondElement) || undefined) :
                secondElement;
            const exp = Expression.builder()
                                    .operand(exp1)
                                    .operand(exp2)
                                    .operator(operator)
                                    .build();
            
            return exprArray.splice(left, right - left + 1, exp);
        }
    });
    if(exprArray[0] === '(') return stringToExpression(exprArray);
    return exprArray[0] as Expression;
}

const expressionToClientText = (expr: Expression): React.ReactNode => {

    
    const createContent = () => {

        const normal = (a: string) => (<>{a}</>)

        const exponent = (a: string, b: string) => (<>{a}<sup>{b}</sup></>)

        return <span>{expr.operator.symbol === '^' ? exponent(expr.operands[0].getRepresentation(), expr.operands[1].getRepresentation()) : normal(expr.getRepresentation())}</span>;
    }

    return (<div className='math-expression'>{createContent()}</div>);
}

export { stringToExpression, expressionToClientText, parenthesize, compare };