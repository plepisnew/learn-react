// const stringToExpression = (expr: string | (string | Expression)[]): Expression => {

//     const exprArray: (string | Expression)[] = typeof expr === 'string' ? expr.split('') : expr;
//     console.log(exprArray);

//     let deepestLevel = 0;
//     let deepestIndex = 0;
//     let level = 0;

//     for(let left = 0; left < exprArray.length; left++) {
//         const char = exprArray[left];
//         const nextChar = exprArray[left + 1];

//         if(char === '(') {
//             level++;
//             if(level > deepestLevel) deepestIndex = left;
//         } else if (char === ')') {
//             level--;
//         }

//         if(char === '(' && nextChar !== '(') {
//             const right = exprArray.indexOf(')', left);
//             const simpleElements = exprArray.slice(left + 1, right);
//             math.precedence.forEach(operator => {
//                 const operatorIndex = simpleElements.indexOf(operator);
//                 if(operatorIndex != -1) {
//                     const firstElement = simpleElements[operatorIndex - 1];
//                     const secondElement = simpleElements[operatorIndex + 1];

//                     const exp1 = typeof firstElement === 'string' ? 
//                         new Symbol(firstElement, parseInt(firstElement) || undefined) :
//                         firstElement;
                        
//                     const exp2 = typeof secondElement === 'string' ?
//                         new Symbol(secondElement, parseInt(secondElement) || undefined) :
//                         secondElement;

//                     const exp = Expression.builder()
//                                             .operand(exp1)
//                                             .operand(exp2)
//                                             .operator(operator)
//                                             .build();
                    
//                     return exprArray.splice(left, right - left + 1, exp);
//                 }
//             });
//         }
//     }
//     if(exprArray[0] === '(') return stringToExpression(exprArray);
//     return exprArray[0] as Expression;
// }