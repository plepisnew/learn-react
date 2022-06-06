const copyMatrixToCube = (matrix, copycat) => {
    matrix.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            // let pos = matrix[rowIndex][colIndex].identifier.split('');
            let pos = [rowIndex, colIndex, 2]
            let duplicateCoordinate = parseInt(matrix[rowIndex][colIndex].identifier.charAt(copycat));
            console.log(duplicateCoordinate);
            console.log(`Changing ${rowIndex}${colIndex}${duplicateCoordinate} to ${rowIndex}${colIndex}`)
            if(copycat == 2) cube.matrix[rowIndex][colIndex][duplicateCoordinate] = matrix[rowIndex][colIndex];
            if(copycat == 1) cube.matrix[rowIndex][duplicateCoordinate][colIndex] = matrix[rowIndex][colIndex];
            if(copycat == 0) cube.matrix[duplicateCoordinate][rowIndex][colIndex] = matrix[rowIndex][colIndex];
        });
    });
}

const rotateMatrix = (face, layers) => {
    // console.log(face, layers);
    let dimension = cube.matrix.length;
    switch(face.toUpperCase()) {
        case 'U':
            for(let layer = 0; layer < layers; layer++) {
                let cubeLayer = (dimension - 1) - layer;
                rotateMatrixAboutCenter(cube.matrix[cubeLayer]);
            }
            break;
        case 'D':
            for(let layer = 0; layer < layers; layer++) {
                rotateMatrixAboutCenterCCW(cube.matrix[layer]);
            }
            break;
        case 'L':
            
            break;
        case 'R':
            let slice = [];
            for(let height = 0; height < dimension; height++) {
                let row = [];
                for(let depth = 0; depth < dimension; depth++) {
                    row.push(cube.matrix[height][depth][dimension - 1])
                }
                slice.push(row);
            }

            // let stuff = clone(slice);
            // console.log(stuff);
            // rotateMatrixAboutCenter(slice);
            // console.log(slice);
            // // rotateMatrixAboutCenterCCW(slice);
            // // let stuff = clone(cube.matrix);
            // copyMatrixToCube(slice, 2);
            // // console.log(stuff);
            // // console.log(cube.matrix);
            break;
        case 'F':
            break;
        case 'B':
            break;
    }
}

//

console.log(i, cornerPiece.face, cornerPiece.pos.height, cornerPiece.pos.depth, cornerPiece.pos.width);
            switch(cornerPiece.pos.height) {
                case 0:
                    switch(cornerPiece.face) {
                        case 'F':
                            if(cornerPiece.pos.width == 0) {
                                algorithm(`L' U L`);
                                await rotationsCompleted();
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`U' L' U L`);
                            }
                            if(cornerPiece.pos.width == 2) {
                                algorithm(`R U' R'`);
                                await rotationsCompleted();
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`U R U' R'`);
                            }
                            break;
                        case 'L':
                            if(cornerPiece.pos.depth == 0) {
                                algorithm(`B' U B`);
                                await rotationsCompleted();
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`U2 L' U L`);
                            }
                            if(cornerPiece.pos.depth == 2) {
                                algorithm(`L' U' L`);
                                await rotationsCompleted();
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`U R U' R'`);
                            }
                            break;
                        case 'R':
                            if(cornerPiece.pos.depth == 0) {
                                algorithm(`B U' B'`);
                                await rotationsCompleted();
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                // algorithm(`U F' U' F`); // im tired and a bit drunk
                                algorithm(`U2 R U' R'`);
                            }
                            if(cornerPiece.pos.depth == 2) {
                                algorithm(`R U R'`);
                                await rotationsCompleted();
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`U' L' U L`);
                            }
                            break;
                        case 'B':
                            if(cornerPiece.pos.width == 0) {
                                algorithm(`L U' L'`);
                                await rotationsCompleted();
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`R U2 R'`);
                            }
                            if(cornerPiece.pos.width == 2) {
                                algorithm(`R' U R`);
                                await rotationsCompleted();
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`L' U2 L`);
                            }
                            break;
                        case 'D':
                            if(cornerPiece.pos.width == 0) {
                                if(cornerPiece.pos.depth == 0) {
                                    algorithm(`B' U B`);
                                    await rotationsCompleted();
                                    while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                        rotateCube('D', 2, 1);
                                        await rotationsCompleted();
                                        center = cube.matrix[1][2][1];
                                    }
                                    algorithm(`R U2 R'`);
                                }
                                if(cornerPiece.pos.depth == 2) {
                                    algorithm(`L' U' L`);
                                    await rotationsCompleted();
                                    while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                        rotateCube('D', 2, 1);
                                        await rotationsCompleted();
                                        center = cube.matrix[1][2][1];
                                    }
                                    algorithm(`L' U L`);
                                }
                            }
                            if(cornerPiece.pos.width == 2) {
                                if(cornerPiece.pos.depth == 0) {
                                    algorithm(`B U' B'`);
                                    await rotationsCompleted();
                                    while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                        rotateCube('D', 2, 1);
                                        await rotationsCompleted();
                                        center = cube.matrix[1][2][1];
                                    }
                                    algorithm(`L' U2 L`);
                                }
                                if(cornerPiece.pos.depth == 2) {
                                    algorithm(`R U R'`);
                                    await rotationsCompleted();
                                    while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                        rotateCube('D', 2, 1);
                                        await rotationsCompleted();
                                        center = cube.matrix[1][2][1];
                                    }
                                    algorithm(`R U' R'`);
                                }
                            }
                            break;
                    }
                    break;
                case 2:
                    switch(cornerPiece.face) {
                        case 'F':
                            if(cornerPiece.pos.width == 0) {
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`U' L' U L`);
                            }
                            if(cornerPiece.pos.width == 2) {
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`U R U' R'`);
                            }
                            break;
                        case 'L':
                            if(cornerPiece.pos.depth == 0) {
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`U2 L' U L`);
                            }
                            if(cornerPiece.pos.depth == 2) {
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`R U' R'`); // fuck this line i made RUR' instead of RU'R'
                            }
                            break;
                        case 'R':
                            if(cornerPiece.pos.depth == 0) {
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`U2 R U' R'`);
                            }
                            if(cornerPiece.pos.depth == 2) {
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`L' U L`);
                            }
                            break;
                        case 'B':
                            if(cornerPiece.pos.width == 0) {
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`R U2 R'`);
                            }
                            if(cornerPiece.pos.width == 2) {
                                while(!sameColor(center, 'F', cornerPiece.col, 'U')) {
                                    rotateCube('D', 2, 1);
                                    await rotationsCompleted();
                                    center = cube.matrix[1][2][1];
                                }
                                algorithm(`L' U2 L`);
                            }
                            break;
                        case 'U':
                            if(cornerPiece.pos.width == 0) {
                                if(cornerPiece.pos.depth == 0) {
                                    while(!sameColor(center, 'F', cornerPiece.col, 'B')) {
                                        rotateCube('D', 2, 1);
                                        await rotationsCompleted();
                                        center = cube.matrix[1][2][1];
                                    }
                                    algorithm(`L U' L2 U L`);
                                }
                                if(cornerPiece.pos.depth == 2) {
                                    while(!sameColor(center, 'F', cornerPiece.col, 'L')) {
                                        rotateCube('D', 2, 1);
                                        await rotationsCompleted();
                                        center = cube.matrix[1][2][1];
                                    }
                                    algorithm(`L' U2 L U2 F U' F'`);
                                }
                            }
                            if(cornerPiece.pos.width == 2) {
                                if(cornerPiece.pos.depth == 0) {
                                    while(!sameColor(center, 'F', cornerPiece.col, 'B')) {
                                        rotateCube('D', 2, 1);
                                        await rotationsCompleted();
                                        center = cube.matrix[1][2][1];
                                    }
                                    algorithm(`R' U R2 U' R'`);
                                }
                                if(cornerPiece.pos.depth == 2) {
                                    while(!sameColor(center, 'F', cornerPiece.col, 'F')) {
                                        rotateCube('D', 2, 1);
                                        await rotationsCompleted();
                                        center = cube.matrix[1][2][1];
                                    }
                                    algorithm(`R U2 R' U' L' U L`);
                                }
                            }
                            break;
                    }
                    break;
            }
            await rotationsCompleted();