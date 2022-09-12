/**
 * Handling logic for tetris game
 */
import { Block, TetrisPiece, pieces } from './TetrisPiece';
import clone from 'util/clone';
import React from 'react';
import { tetris } from 'util/constants';
import { handleInput, UserInput } from './InputHandler';
import { colors } from './TetrisPiece';
import {
    clearCanvas,
    drawBoard,
    drawGrid,
    drawPiece,
    drawPieceSquare,
} from './TetrisRenderer';

interface Point {
    x: number;
    y: number;
}

interface HandleParams {
    ctx: CanvasRenderingContext2D;
    heldCtx: CanvasRenderingContext2D;
    nextCtx: CanvasRenderingContext2D;
    time: number;
    frame: number;
    previousDownMove: React.MutableRefObject<number>;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    currentPiece: TetrisPiece;
    setCurrentPiece: React.Dispatch<React.SetStateAction<TetrisPiece>>;
    heldPiece: TetrisPiece | undefined;
    setHeldPiece: React.Dispatch<React.SetStateAction<TetrisPiece | undefined>>;
    nextPiece: TetrisPiece;
    setNextPiece: React.Dispatch<React.SetStateAction<TetrisPiece>>;
    board: Block[];
    setBoard: React.Dispatch<React.SetStateAction<Block[]>>;
    paused: boolean;
    setPaused: React.Dispatch<React.SetStateAction<boolean>>;
    restarting: boolean;
    setRestarting: React.Dispatch<React.SetStateAction<boolean>>;
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
    input: UserInput;
    fallInterval: number;
    framesPerKeyHandle: number;
    keyPressFrameDelay: number;
    projectionOpacity: number;
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

let global: HandleParams = {} as HandleParams;

export const randomPiece = (initialX = 3): TetrisPiece => {
    return clone<TetrisPiece>(
        pieces[Math.floor(Math.random() * pieces.length)]
    ).moveRight(initialX);
};

/**
 * Attempts to move a TetrisPiece in a given direction. If a translational collision occurs, nothing happens. If a rotational collision occurs, attempts to move the piece in the direction opposite to the collision direction
 * @param {TetrisPiece} piece Tetris Piece to move
 * @param direction Direction in which to move the Tetris Piece
 * @returns
 */
export const movePiece = (
    piece: TetrisPiece,
    direction: string,
    stackSize = 0,
    projectionPiece = false
): void => {
    if (stackSize > MAX_STACK_SIZE) return;
    if (direction === MoveTypes.drop) {
        let moveDownResult = willColide(piece, MoveTypes.autoDown);
        while (moveDownResult !== CollisionTypes.moveAutoDown) {
            movePiece(piece, MoveTypes.autoDown, stackSize, projectionPiece);
            moveDownResult = willColide(piece, MoveTypes.autoDown);
        }
        return movePiece(piece, MoveTypes.autoDown, stackSize, projectionPiece);
    }
    const collisionResult = willColide(piece, direction);
    switch (collisionResult) {
        case CollisionTypes.moveAutoDown:
            if (!projectionPiece) {
                placePiece(piece);
                global.setCurrentPiece(global.nextPiece);
                if (collisionPoint(global.nextPiece.destruct())) {
                    return global.setGameOver(true);
                }
                global.setNextPiece(randomPiece());
            }
            return;
        case CollisionTypes.moveDown: // moves down into border: do nothing
            return;
        case CollisionTypes.moveLeft: // moves left into border: do nothing
            return;
        case CollisionTypes.moveRight: // moves right into border: do nothing
            return;
        case CollisionTypes.spinDown: // rotate down: move up if possible
            movePiece(piece, MoveTypes.up, stackSize + 1);
            movePiece(piece, MoveTypes.spin, stackSize + 1);
            return;
        case CollisionTypes.spinLeft: // rotate left: move right if possible
            movePiece(piece, MoveTypes.right, stackSize + 1);
            movePiece(piece, MoveTypes.spin, stackSize + 1);
            return;
        case CollisionTypes.spinRight: // rotate right: move left if possible
            movePiece(piece, MoveTypes.left, stackSize + 1);
            movePiece(piece, MoveTypes.spin, stackSize + 1);
            return;
        case CollisionTypes.spinUp: // rotate top: move bottom if possible
            movePiece(piece, MoveTypes.down, stackSize + 1);
            movePiece(piece, MoveTypes.spin, stackSize + 1);
            return;
    }
    movePieceUnsafe(piece, direction); // no collisions: do action
};

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

export const checkTetris = (): void => {
    const blockY = new Map<number, number>();
    global.board.forEach((block) => {
        blockY.set(block.y, (blockY.get(block.y) || 0) + 1);
    });
    const deleteY: number[] = [];
    blockY.forEach((count, y) => {
        if (count === 10) deleteY.push(y);
    });
    global.setBoard(
        global.board.filter((block) => {
            if (deleteY.includes(block.y)) return false;
            let layersAbove = 0;
            deleteY.forEach(
                (layer) => (layersAbove += layer > block.y ? 1 : 0)
            );
            block.y += layersAbove;
            return true;
        })
    );
    increaseScore(deleteY.length);
};

const increaseScore = (linesCleared: number) => {
    let updatedScore = global.score;
    if (linesCleared === 1) updatedScore += 40;
    if (linesCleared === 2) updatedScore += 100;
    if (linesCleared === 3) updatedScore += 300;
    if (linesCleared === 4) updatedScore += 1200;
    global.setScore(updatedScore);
};

export const placePiece = (piece: TetrisPiece): void => {
    piece.destruct().forEach((block) => {
        global.board.push(block);
    });
    checkTetris();
};

export const willColide = (piece: TetrisPiece, direction: string): string => {
    const futureBlocks = movePieceUnsafe(
        clone<TetrisPiece>(piece),
        direction
    ).destruct();
    const point = collisionPoint(futureBlocks);
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

const collisionPoint = (blocks: Block[]): Point | null => {
    for (let blocksIndex = 0; blocksIndex < blocks.length; blocksIndex++) {
        const block = blocks[blocksIndex];
        // Collision with border
        if (block.x < 0) return { x: -1, y: block.y };
        if (block.y < 0) return { x: block.x, y: -1 };
        if (block.x > tetris.cols - 1) return { x: tetris.cols, y: block.y };
        if (block.y > tetris.rows - 1) return { x: block.x, y: tetris.rows };
        // Collision with other blocks
        for (
            let boardIndex = 0;
            boardIndex < global.board.length;
            boardIndex++
        ) {
            const boardBlock = global.board[boardIndex];
            if (boardBlock.x === block.x && boardBlock.y === block.y)
                return { x: block.x, y: block.y };
        }
    }
    return null;
};

const holdPiece = () => {
    if (global.heldPiece) {
        const currentPiece = global.currentPiece;
        global.setCurrentPiece(global.heldPiece.moveTo(3, 0));
        global.setHeldPiece(currentPiece);
    } else {
        global.setHeldPiece(global.currentPiece);
        global.setCurrentPiece(randomPiece());
    }
};

const pauseGame = () => {
    global.setPaused(!global.paused);
};

const restartGame = () => {
    if (global.restarting || global.gameOver) {
        global.setRestarting(false);
        global.setPaused(false);
        global.setGameOver(false);
        global.setBoard([]);
        global.setCurrentPiece(randomPiece());
        global.setHeldPiece(undefined);
        global.setNextPiece(randomPiece());
        global.setScore(0);
    } else {
        global.setRestarting(true);
    }
};

export const handlePieces = (params: HandleParams) => {
    global = params;

    clearCanvas(global.ctx);
    clearCanvas(global.nextCtx);
    clearCanvas(global.heldCtx);

    drawGrid(global.ctx);

    if (global.time - global.previousDownMove.current > global.fallInterval) {
        global.previousDownMove.current = global.time;
        movePiece(global.currentPiece, MoveTypes.autoDown);
    }

    drawPiece(global.ctx, global.currentPiece, 1); // current piece
    drawPieceSquare(global.nextCtx, global.nextPiece);
    if (global.heldPiece) drawPieceSquare(global.heldCtx, global.heldPiece);
    drawPiece(
        global.ctx,
        (() => {
            const projectionPiece = clone(global.currentPiece);
            movePiece(projectionPiece, MoveTypes.drop, 0, true);
            return projectionPiece;
        })(),
        global.projectionOpacity
    ); // current piece projection
    drawBoard(global.ctx, global.board); // board

    handleInput(
        global.frame,
        global.framesPerKeyHandle,
        global.keyPressFrameDelay,
        global.input,
        {
            moveRight: global.paused
                ? undefined
                : () => movePiece(global.currentPiece, MoveTypes.right),
            moveLeft: global.paused
                ? undefined
                : () => movePiece(global.currentPiece, MoveTypes.left),
            moveDown: global.paused
                ? undefined
                : () => movePiece(global.currentPiece, MoveTypes.down),
            spin: global.paused
                ? undefined
                : () => movePiece(global.currentPiece, MoveTypes.spin),
            drop: global.paused
                ? undefined
                : () => movePiece(global.currentPiece, MoveTypes.drop),
            hold: global.paused ? undefined : () => holdPiece(),
            pause: () => pauseGame(),
            restart: () => restartGame(),
            cancelRestart: () => global.setRestarting(false),
        }
    );
};
