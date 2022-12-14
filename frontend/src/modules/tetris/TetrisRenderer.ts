import clone from 'util/clone';
import { tetris } from 'util/constants';
import { Block, TetrisPiece, colors } from './TetrisPiece';

/**
 * Module for handling Tetris piece rendering to Canvas
 */

export const drawGrid = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = 'rgb(225, 225, 225)';
    for (let row = 0; row < tetris.rows; row++) {
        context.beginPath(); // removing beginPath decimates the framerate for some reason
        context.moveTo(0, row * tetris.cellSize);
        context.lineTo(context.canvas.width, row * tetris.cellSize);
        context.stroke();
    }
    for (let col = 0; col < tetris.cols; col++) {
        context.beginPath();
        context.moveTo(col * tetris.cellSize, 0);
        context.lineTo(col * tetris.cellSize, context.canvas.height);
        context.stroke();
    }
};

export const drawPiece = (
    context: CanvasRenderingContext2D,
    piece: TetrisPiece,
    opacity: number
) => {
    piece.draw(context, opacity);
};

export const drawPieceSquare = (
    context: CanvasRenderingContext2D,
    piece: TetrisPiece
) => {
    const coords = piece.blocks[0].fill === colors.cyan ? 0 : 1 / 2;
    clone(piece).moveTo(coords, coords).draw(context, 1);
};

export const drawBoard = (
    context: CanvasRenderingContext2D,
    board: Block[]
) => {
    board.forEach((block) => block.draw(context));
};

export const clearCanvas = (context: CanvasRenderingContext2D) => {
    const canvas = context.canvas;
    context.clearRect(0, 0, canvas.width, canvas.height);
};
