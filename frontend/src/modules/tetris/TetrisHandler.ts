/**
 * Handling logic for tetris game
 */
import { Block, TetrisPiece, pieces } from './TetrisPiece';
import clone from 'util/clone';
import React from 'react';
import { tetris } from 'util/constants';
import { handleInput, UserInput } from './InputHandler';
import { colors } from './TetrisPiece';
import { clearCanvas, drawBoard, drawGrid, drawPiece } from './TetrisRenderer';

interface Point {
    x: number;
    y: number;
}

const CollisionTypes = {
    moveLeft: 'MOVE_LEFT',
    moveRight: 'MOVE_RIGHT',
    moveDown: 'MOVE_DOWN',
    moveAutoDown: 'MOVE_AUTO_DOWN',
    spinLeft: 'SPIN_LEFT',
    spinRight: 'SPIN_RIGHT',
    spinDown: 'SPIN_DOWN',
    spinUp: 'SPIN_UP',
    none: 'NONE',
};

const MoveTypes = {
    left: 'LEFT',
    right: 'RIGHT',
    down: 'DOWN',
    autoDown: 'AUTO_DOWN',
    up: 'UP',
    spin: 'SPIN',
    drop: 'DROP',
};

const MAX_STACK_SIZE = 5;

export const randomPiece = (initialX = 3): TetrisPiece => {
    return clone<TetrisPiece>(
        pieces[Math.floor(Math.random() * pieces.length)]
    ).moveRight(initialX);
};

/**
 * Attempts to move a TetrisPiece in a given direction. If a translational collision occurs, nothing happens. If a rotational collision occurs, attempts to move the piece in the direction opposite to the collision direction
 * @param {TetrisPiece} piece Tetris Piece to move
 * @param {React.Dispatch<React.SetStateAction<TetrisPiece>>} setCurrentPiece Current Tetris Piece state setter
 * @param {Block[]} board Current board state
 * @param direction Direction in which to move the Tetris Piece
 * @returns
 */
export const movePiece = (
    piece: TetrisPiece,
    setCurrentPiece: React.Dispatch<React.SetStateAction<TetrisPiece>>,
    board: Block[],
    setBoard: React.Dispatch<React.SetStateAction<Block[]>>,
    direction: string,
    stackSize = 0,
    projectionPiece = false
): void => {
    if (stackSize > MAX_STACK_SIZE) return;
    if (direction === MoveTypes.drop) {
        let moveDownResult = willColide(piece, board, MoveTypes.autoDown);
        while (moveDownResult !== CollisionTypes.moveAutoDown) {
            movePiece(
                piece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.autoDown,
                stackSize,
                projectionPiece
            );
            moveDownResult = willColide(piece, board, MoveTypes.autoDown);
        }
        return movePiece(
            piece,
            setCurrentPiece,
            board,
            setBoard,
            MoveTypes.autoDown,
            stackSize,
            projectionPiece
        );
    }
    const collisionResult = willColide(piece, board, direction);
    switch (collisionResult) {
        case CollisionTypes.moveAutoDown:
            if (!projectionPiece) {
                placePiece(piece, board, setBoard);
                setCurrentPiece(randomPiece());
            }
            return;
        case CollisionTypes.moveDown: // moves down into border: do nothing
            return;
        case CollisionTypes.moveLeft: // moves left into border: do nothing
            return;
        case CollisionTypes.moveRight: // moves right into border: do nothing
            return;
        case CollisionTypes.spinDown: // rotate down: move up if possible
            movePiece(
                piece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.up,
                stackSize + 1
            );
            movePiece(
                piece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.spin,
                stackSize + 1
            );

            return;
        case CollisionTypes.spinLeft: // rotate left: move right if possible
            movePiece(
                piece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.right,
                stackSize + 1
            );
            movePiece(
                piece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.spin,
                stackSize + 1
            );

            return;
        case CollisionTypes.spinRight: // rotate right: move left if possible
            movePiece(
                piece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.left,
                stackSize + 1
            );
            movePiece(
                piece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.spin,
                stackSize + 1
            );

            return;
        case CollisionTypes.spinUp: // rotate top: move bottom if possible
            movePiece(
                piece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.down,
                stackSize + 1
            );
            movePiece(
                piece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.spin,
                stackSize + 1
            );

            return;
    }
    movePieceUnsafe(piece, direction); // no collisions: do action
};

/**
 * Unsafely moves a Tetris Piece in a given direction, forcing its coordinates to change. Should only be called when the future piece does not collide with anything.
 * @param piece Tetris Piece to move
 * @param direction Direction in which to move the Tetris Piece
 * @returns Moved Tetris Piece
 */
export const movePieceUnsafe = (
    piece: TetrisPiece,
    direction: string
): TetrisPiece => {
    piece;
    direction;
    switch (direction) {
        case MoveTypes.left:
            piece.x--;
            break;
        case MoveTypes.right:
            piece.x++;
            break;
        case MoveTypes.down:
            piece.y++;
            break;
        case MoveTypes.autoDown:
            piece.y++;
            break;
        case MoveTypes.up:
            piece.y--;
            break;
        case MoveTypes.spin:
            if (piece.blocks[0].fill === colors.cyan) {
                // translate [-1.5,1.5], rotate -90 deg [[0 1] [-1 0]], translate [1.5, 1.5] => [3-y, x]
                piece.blocks.forEach((block) => {
                    const terminalX = 3 - block.y;
                    const terminalY = block.x;
                    block.x = terminalX;
                    block.y = terminalY;
                });
            } else if (piece.blocks[0].fill !== colors.yellow) {
                // translate [-1,1], rotate -90 deg [[0 1] [-1 0]], translate [1, 1] => [2-y, x]
                piece.blocks.forEach((block) => {
                    const terminalX = 2 - block.y;
                    const terminalY = block.x;
                    block.x = terminalX;
                    block.y = terminalY;
                });
            }
            break;
        case MoveTypes.drop:
            break;
    }
    return piece;
};

export const checkTetris = (
    board: Block[],
    setBoard: React.Dispatch<React.SetStateAction<Block[]>>
): void => {
    const blockY = new Map<number, number>();
    board.forEach((block) => {
        blockY.set(block.y, (blockY.get(block.y) || 0) + 1);
    });
    const deleteY: number[] = [];
    blockY.forEach((count, y) => {
        if (count === 10) deleteY.push(y);
    });
    setBoard(
        board.filter((block) => {
            if (deleteY.includes(block.y)) return false;
            if (block.y < Math.min(...deleteY)) block.y += deleteY.length;
            return true;
        })
    );
};

export const placePiece = (
    piece: TetrisPiece,
    board: Block[],
    setBoard: React.Dispatch<React.SetStateAction<Block[]>>
): void => {
    piece.destruct().forEach((block) => {
        board.push(block);
    });
    checkTetris(board, setBoard);
};

/**
 * Determines whether a piece moven in a specific direction collides with the border or other pieces
 * @param piece
 * @param board
 * @param direction
 */
export const willColide = (
    piece: TetrisPiece,
    board: Block[],
    direction: string
): string => {
    const futureBlocks = movePieceUnsafe(
        clone<TetrisPiece>(piece),
        direction
    ).destruct();
    const point = collisionPoint(board, futureBlocks);
    if (point) {
        if (direction === MoveTypes.left) return CollisionTypes.moveLeft;
        if (direction === MoveTypes.right) return CollisionTypes.moveRight;
        if (direction === MoveTypes.autoDown)
            return CollisionTypes.moveAutoDown;
        if (direction === MoveTypes.down) return CollisionTypes.moveDown;
        if (direction === MoveTypes.spin) {
            const xCoords = futureBlocks.map((block) => block.x);
            const yCoords = futureBlocks.map((block) => block.y);
            const minX = Math.min(...xCoords);
            const minY = Math.min(...yCoords);
            const maxX = Math.max(...xCoords);
            const maxY = Math.max(...yCoords);
            if (minX === point.x) return CollisionTypes.spinLeft;
            if (maxX === point.x) return CollisionTypes.spinRight;
            if (minY === point.y) return CollisionTypes.spinUp;
            if (maxY === point.y) return CollisionTypes.spinDown;
        }
    }
    return CollisionTypes.none;
};

const collisionPoint = (board: Block[], blocks: Block[]): Point | null => {
    for (let blocksIndex = 0; blocksIndex < blocks.length; blocksIndex++) {
        const block = blocks[blocksIndex];
        // Collision with border
        if (block.x < 0) return { x: -1, y: block.y };
        if (block.y < 0) return { x: block.x, y: -1 };
        if (block.x > tetris.cols - 1) return { x: tetris.cols, y: block.y };
        if (block.y > tetris.rows - 1) return { x: block.x, y: tetris.rows };
        // Collision with other blocks
        for (let boardIndex = 0; boardIndex < board.length; boardIndex++) {
            const boardBlock = board[boardIndex];
            if (boardBlock.x === block.x && boardBlock.y === block.y)
                return { x: block.x, y: block.y };
        }
    }
    return null;
};

interface HandleParams {
    ctx: CanvasRenderingContext2D;
    heldCtx: CanvasRenderingContext2D;
    nextCtx: CanvasRenderingContext2D;
    time: number;
    previousDownMove: React.MutableRefObject<number>;
    frame: number;
    currentPiece: TetrisPiece;
    setCurrentPiece: React.Dispatch<React.SetStateAction<TetrisPiece>>;
    heldPiece: TetrisPiece | undefined;
    setHeldPiece: React.Dispatch<React.SetStateAction<TetrisPiece | undefined>>;
    nextPiece: TetrisPiece;
    setNextPiece: React.Dispatch<React.SetStateAction<TetrisPiece>>;
    board: Block[];
    setBoard: React.Dispatch<React.SetStateAction<Block[]>>;
    input: UserInput;
    fallInterval: number;
    framesPerKeyHandle: number;
    keyPressFrameDelay: number;
    projectionOpacity: number;
}

/**
 * Handles the flow of the game including constantly moving the current piece down and moving the current piece based on the current state of the input object
 * @param parameters
 * @param parameters.time
 */
export const handlePieces = ({
    ctx,
    heldCtx,
    nextCtx,
    time,
    previousDownMove,
    frame,
    currentPiece,
    setCurrentPiece,
    heldPiece,
    setHeldPiece,
    nextPiece,
    setNextPiece,
    input,
    board,
    setBoard,
    fallInterval,
    framesPerKeyHandle,
    keyPressFrameDelay,
    projectionOpacity,
}: HandleParams) => {
    clearCanvas(ctx);
    drawGrid(ctx);

    if (time - previousDownMove.current > fallInterval) {
        previousDownMove.current = time;
        movePiece(
            currentPiece,
            setCurrentPiece,
            board,
            setBoard,
            MoveTypes.autoDown
        );
    }

    drawPiece(ctx, currentPiece, 1);
    drawPiece(
        ctx,
        (() => {
            const projectionPiece = clone(currentPiece);
            movePiece(
                projectionPiece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.drop,
                0,
                true
            );
            return projectionPiece;
        })(),
        projectionOpacity
    );
    drawBoard(ctx, board);

    drawPiece(nextCtx, nextPiece, 1);

    handleInput(frame, framesPerKeyHandle, keyPressFrameDelay, input, {
        moveRight: () =>
            movePiece(
                currentPiece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.right
            ),
        moveLeft: () =>
            movePiece(
                currentPiece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.left
            ),
        moveDown: () =>
            movePiece(
                currentPiece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.down
            ),
        spin: () =>
            movePiece(
                currentPiece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.spin
            ),
        drop: () =>
            movePiece(
                currentPiece,
                setCurrentPiece,
                board,
                setBoard,
                MoveTypes.drop
            ),
    });
    // If one of the lagging keys are pressed, set future handling frame if its time to begin handling
};
