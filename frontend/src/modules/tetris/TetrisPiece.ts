/**
 * Model for Tetris game and array of all possible tetris pieces
 */
import { tetris } from 'util/constants';

export class Block {
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;

    constructor(x: number, y: number, fill: string) {
        this.x = x;
        this.y = y;
        this.w = tetris.cellSize;
        this.h = tetris.cellSize;
        this.fill = fill;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.rect(
            this.x * tetris.cellSize,
            this.y * tetris.cellSize,
            this.w,
            this.h
        );
        ctx.fill();
        ctx.stroke();
    }
}

export class TetrisPiece {
    blocks: Block[];
    x: number;
    y: number;

    constructor(blocks: Block[]) {
        this.x = 0;
        this.y = 0;
        this.blocks = blocks;
    }

    draw(context: CanvasRenderingContext2D, opacity: number): void {
        this.blocks.forEach((block) => {
            context.beginPath();
            context.fillStyle = `${block.fill.split(')')[0]}, ${opacity})`;
            context.strokeStyle = 'black';
            context.rect(
                (this.x + block.x) * tetris.cellSize,
                (this.y + block.y) * tetris.cellSize,
                block.w,
                block.h
            );
            context.fill();
            context.stroke();
        });
    }

    moveRight(x: number) {
        this.x += x;
        return this;
    }

    destruct(): Block[] {
        const destructedBlocks: Block[] = [];
        this.blocks.forEach((block) => {
            const destructedBlock = new Block(
                this.x + block.x,
                this.y + block.y,
                block.fill
            );
            destructedBlocks.push(destructedBlock);
        });
        return destructedBlocks;
    }
}

export const colors = {
    red: 'rgb(255, 0, 0)',
    lime: 'rgb(27, 255, 8)',
    yellow: 'rgb(255, 255, 0)',
    cyan: 'rgb(0, 229, 255)',
    blue: 'rgb(48, 79, 254)',
    orange: 'rgb(245, 124, 0)',
    purple: 'rgb(142, 36, 170)',
};

export const pieces = [
    /**
     * Red awkward shape
     */
    new TetrisPiece([
        new Block(0, 0, colors.red),
        new Block(1, 0, colors.red),
        new Block(1, 1, colors.red),
        new Block(2, 1, colors.red),
    ]),
    /**
     * Lime awkard shape
     */
    new TetrisPiece([
        new Block(1, 0, colors.lime),
        new Block(2, 0, colors.lime),
        new Block(0, 1, colors.lime),
        new Block(1, 1, colors.lime),
    ]),
    /**
     * Yellow square shape
     */
    new TetrisPiece([
        new Block(0, 0, colors.yellow),
        new Block(0, 1, colors.yellow),
        new Block(1, 0, colors.yellow),
        new Block(1, 1, colors.yellow),
    ]),
    /**
     * Cyan bar shape
     */
    new TetrisPiece([
        new Block(0, 1, colors.cyan),
        new Block(1, 1, colors.cyan),
        new Block(2, 1, colors.cyan),
        new Block(3, 1, colors.cyan),
    ]),
    /**
     * Blue L shape
     */
    new TetrisPiece([
        new Block(0, 0, colors.blue),
        new Block(0, 1, colors.blue),
        new Block(1, 1, colors.blue),
        new Block(2, 1, colors.blue),
    ]),
    /**
     * Orange L shape
     */
    new TetrisPiece([
        new Block(0, 1, colors.orange),
        new Block(1, 1, colors.orange),
        new Block(2, 1, colors.orange),
        new Block(2, 0, colors.orange),
    ]),
    /**
     * Purple pointer shape
     */
    new TetrisPiece([
        new Block(0, 1, colors.purple),
        new Block(1, 1, colors.purple),
        new Block(1, 0, colors.purple),
        new Block(2, 1, colors.purple),
    ]),
];
