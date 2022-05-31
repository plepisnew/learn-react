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