import React, { useRef, useState } from 'react';
import Canvas from 'components/ui/Canvas';
import useFrameLoop from 'hooks/useFrameLoop';
import shuffleArray from 'util/shuffleArray';
import fitToParent from 'util/fitToParent';
import { transition } from 'util/constants';

export const TransitionCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    const cols = transition.columns;
    const tileSize = window.innerWidth / cols;
    const rows = window.innerHeight / tileSize;

    const generateGrid = (rows: number, cols: number) => {
        const grid: { x: number; y: number }[] = [];
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                grid.push({ x, y });
            }
        }
        return shuffleArray(grid);
    };

    const grid = generateGrid(rows, cols);

    useFrameLoop(
        (frame) => {
            if (!ctx) {
                const canvas = canvasRef.current;
                const context = canvas?.getContext(
                    '2d'
                ) as CanvasRenderingContext2D;
                setCtx(context);
                onresize(context);
                return;
            }

            const animationFrame = frame - 1;
            if (animationFrame < grid.length) {
                const item = grid[animationFrame];
                ctx.fillStyle = 'black';
                ctx.rect(
                    item.x * tileSize,
                    item.y * tileSize,
                    tileSize,
                    tileSize
                );
                ctx.fill();
                ctx.stroke();
            } else if (animationFrame < grid.length + transition.sleepFrames) {
                // sleeping time
            } else if (
                animationFrame <
                2 * grid.length + transition.sleepFrames
            ) {
                const item =
                    grid[animationFrame - grid.length - transition.sleepFrames];
                ctx.clearRect(
                    item.x * tileSize,
                    item.y * tileSize,
                    tileSize,
                    tileSize
                );
            }
        },
        [ctx]
    );

    const onresize = (context: CanvasRenderingContext2D) => {
        fitToParent(context.canvas);
    };

    return (
        <div className="transition-container">
            <Canvas ref={canvasRef} className="transition-canvas" />
        </div>
    );
};
