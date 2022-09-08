/* eslint @typescript-eslint/no-unused-vars: 0 */
import React, { useRef, useState } from 'react';
import {
    stringToExpression,
    expressionToClientText,
    Expression,
    Symbol,
    Operator,
    parenthesize,
} from 'modules/math/Math';
import Canvas from 'components/ui/Canvas';
import useFrameLoop from 'hooks/useFrameLoop';
import Capybara from 'components/misc/Capybara';

const DevPage: React.FC = () => {
    // const x = new Symbol('x', undefined);
    // const exp: Expression = Expression.builder()
    //     .operand(x)
    //     .operator('^')
    //     .operand(x)
    //     .build();
    // console.log(import.meta.env);
    // return <div className="navpage">{expressionToClientText(exp)}</div>;

    return (
        <div className="navpage" style={{ paddingTop: '20px' }}>
            <Capybara height={50} />;
        </div>
    );
};

export default DevPage;

const dev = () => {
    // const x = new Symbol('x', undefined);
    // const y = new Symbol('y', undefined);
    // const one = new Symbol('1', 1);
    // // const five = new Symbol('5', 5);
    // const two = new Symbol('2', 2);
    // const seven = new Symbol('7', 7);
    // const x_squared = Expression.builder()
    //     .operand(x)
    //     .operand(two)
    //     .operator(Operator.get('exp'))
    //     .build();
    // const y_squared = Expression.builder()
    //     .operand(y)
    //     .operand(two)
    //     .operator(Operator.get('exp'))
    //     .build();
    // const diff = Expression.builder()
    //     .operand(x_squared)
    //     .operator(Operator.get('minus'))
    //     .operand(y_squared)
    //     .build();
    // const half = Expression.builder()
    //     .operand(one)
    //     .operator(Operator.get('/'))
    //     .operand(two)
    //     .build();
    // const dist = Expression.builder()
    //     .operand(diff)
    //     .operand(half)
    //     .operator(Operator.get('exp'))
    //     .build();
    // const seventh = Expression.builder()
    //     .operand(one)
    //     .operand(seven)
    //     .operator(Operator.get('/'))
    //     .build();
    // seventh.calculate();
    // console.log(seventh);
    // dist.evaluate('x', 5);
    // dist.evaluate('y', 4);
    // dist.calculate();
    // console.log(dist);
    // const newExp = Expression.builder()
    //                         .operand(five)
    //                         .operator(Operator.get('sqrt'))
    //                         .build();
    // newExp.evaluate('x', 4);
    // newExp.calculate();
    // console.log(newExp);
    // const luckyExp = stringToExpression('(x^2-y^2+b^(a-b)+k!)');
    // const anotherExp = stringToExpression('(a^2-b^2)^(1/2)');
    // const exp = stringToExpression('(a+((((x^2)-(y^2))+(b^(a-b)))+k))')
    // const str = parenthesize('x^2-y^2+b^(a-b)+k');
    // const exp = stringToExpression('(((a^2)-(b^2))^(1/2))');
    // exp.plug('a', 5).plug('b', 2);
    // exp.plug('x', 5).plug('y', 4).plug('a', 2).plug('b', 3).plug('k', 1);
    // console.log(exp);
    // exp.evaluate('a', 5);
    // console.log(exp);
    // exp.evaluate('b', 4);
    // console.log(exp);
    // exp.calculate();
    // console.log(exp);
};
dev();
