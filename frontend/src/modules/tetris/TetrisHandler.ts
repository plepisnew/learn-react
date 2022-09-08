/**
 * Handling logic for tetris game
 */
import { Block, TetrisPiece, pieces } from './TetrisPiece';
import clone from 'util/clone';
import React from 'react';
import { tetris } from 'util/constants';
import { initialInput, UserInput } from './InputHandler';
import { colors } from './TetrisPiece';

export const randomPiece = (): TetrisPiece => {
    return clone<TetrisPiece>(
        pieces[Math.floor(Math.random() * pieces.length)]
    );
};

const CollisionTypes = {
    moveLeft: 'MOVE_LEFT',
    moveRight: 'MOVE_RIGHT',
    moveDown: 'MOVE_DOWN',
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
    up: 'UP',
    spin: 'SPIN',
    drop: 'DROP',
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
    direction: string
): void => {
    const collisionResult = willColide(piece, board, direction);
    switch (collisionResult) {
        case CollisionTypes.moveDown: // moves down into border: place piece
            placePiece(piece, board);
            setCurrentPiece(randomPiece());
            return;
        case CollisionTypes.moveLeft: // moves left into border: do nothing
            return;
        case CollisionTypes.moveRight: // moves right into border: do nothing
            return;
        case CollisionTypes.spinDown: // rotate down: move up if possible
            movePiece(piece, setCurrentPiece, board, MoveTypes.up);
            return;
        case CollisionTypes.spinLeft: // rotate left: move right if possible
            movePiece(piece, setCurrentPiece, board, MoveTypes.right);
            return;
        case CollisionTypes.spinRight: // rotate right: move left if possible
            movePiece(piece, setCurrentPiece, board, MoveTypes.left);
            return;
        case CollisionTypes.spinUp: // rotate top: move bottom if possible
            movePiece(piece, setCurrentPiece, board, MoveTypes.down);
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

export const placePiece = (piece: TetrisPiece, board: Block[]) => {
    piece.destruct().forEach((block) => {
        board.push(block);
    });
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

// export const dropPiece = (piece: TetrisPiece, board: Block[]) => {};

interface Point {
    x: number;
    y: number;
}

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
    time: number;
    previousDownMove: React.MutableRefObject<number>;
    frame: number;
    nextKeyHandle: React.MutableRefObject<{ frame: number; update: boolean }>;
    currentPiece: TetrisPiece;
    setCurrentPiece: React.Dispatch<React.SetStateAction<TetrisPiece>>;
    input: UserInput;
    setInput: React.Dispatch<React.SetStateAction<UserInput>>;
    board: Block[];
    fallInterval: number;
    framesPerKeyHandle: number;
    keyPressFrameDelay: number;
}

/**
 * Handles the flow of the game including constantly moving the current piece down and moving the current piece based on the current state of the input object
 * @param parameters
 * @param parameters.time
 */
export const handlePieces = ({
    time,
    previousDownMove,
    frame,
    nextKeyHandle,
    currentPiece,
    setCurrentPiece,
    input,
    setInput,
    board,
    fallInterval,
    framesPerKeyHandle,
    keyPressFrameDelay,
}: HandleParams) => {
    if (time - previousDownMove.current > fallInterval) {
        previousDownMove.current = time;
        movePiece(currentPiece, setCurrentPiece, board, MoveTypes.down);
    }

    if (input.left || input.right || input.down) {
        // if pressed, dont update nextKeyHandle
        if (frame > nextKeyHandle.current.frame) {
            if (input.left)
                movePiece(currentPiece, setCurrentPiece, board, MoveTypes.left);
            if (input.right)
                movePiece(
                    currentPiece,
                    setCurrentPiece,
                    board,
                    MoveTypes.right
                );

            if (input.down)
                movePiece(currentPiece, setCurrentPiece, board, MoveTypes.down);

            if (nextKeyHandle.current.update) {
                nextKeyHandle.current = {
                    frame: frame + keyPressFrameDelay,
                    update: false,
                };
            }
        }
    } else {
        // if nothing pressed, update nextKeyHandle
        nextKeyHandle.current.update = true;
    }

    if (input.drop) {
        setInput({ ...input, drop: false });
        movePiece(currentPiece, setCurrentPiece, board, MoveTypes.drop);
    }

    // if (input.pause) {
    // }
    // if (input.restart) {
    // }
    console.log(input.spin);
    if (input.spin) {
        setInput({ ...input, spin: false });
        movePiece(currentPiece, setCurrentPiece, board, MoveTypes.spin);
    }
    // if (input.drop) {
    // }
};
