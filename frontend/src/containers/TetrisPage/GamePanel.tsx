import React, { useRef, useState, useContext, useEffect } from 'react';
import { StyledGamePanel } from './TetrisPage.styled';
import useFrameLoop from 'hooks/useFrameLoop';
import Canvas from 'components/ui/Canvas';
import { tetris } from 'util/constants';
import TetrisPiece, {
    pieces as tetrisPieces,
} from 'modules/drawable/TetrisPiece';
import clone from 'util/clone';
import TetrisContext from 'context/TetrisContext';

const userInput = {
    left: false,
    right: false,
    up: false,
    down: false,
    drop: false,
    hold: false,
    pause: false,
    restart: false,
};

const GamePanel: React.FC = () => {
    const {
        cancerMode,
        shadowMode,
        placeOnMoveDown,
        projectionOpacity,
        rotationFrameDelay,
        keyPressFrameDelay,
        framesPerKeyHandle,
        millisPerDownMove,
        moveRightOnSpawn,
    } = useContext(TetrisContext);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    const randomPiece = (): TetrisPiece => {
        return clone<TetrisPiece>(
            tetrisPieces[Math.floor(Math.random() * tetrisPieces.length)]
        );
    };

    const [currentPiece, setCurrentPiece] = useState<TetrisPiece>(
        randomPiece()
    );
    const [pieces, setPieces] = useState<TetrisPiece[]>([currentPiece]);
    const [input, setInput] = useState<typeof userInput>(userInput);

    const previousDownMove = useRef<number>();

    const drawGrid = (context: CanvasRenderingContext2D) => {
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

    const drawPieces = (context: CanvasRenderingContext2D) => {
        pieces.forEach((piece) => piece.draw(context));
    };

    useEffect(() => {
        window.onkeydown = (e: KeyboardEvent) => {
            console.log(input);
            if (e.key === 'ArrowLeft') setInput({ ...input, left: true });
            if (e.key === 'ArrowRight') setInput({ ...input, right: true });
            if (e.key === 'ArrowDown') setInput({ ...input, down: true });
            if (e.key === 'ArrowUp') setInput({ ...input, up: true });
            if (e.key === ' ') setInput({ ...input, drop: true });
            if (e.key === 'z') setInput({ ...input, hold: true });
            if (e.key === 'p') setInput({ ...input, pause: true });
            if (e.key === 'r') setInput({ ...input, restart: true });
        };

        window.onkeyup = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') setInput({ ...input, left: false });
            if (e.key === 'ArrowRight') setInput({ ...input, right: false });
            if (e.key === 'ArrowDown') setInput({ ...input, down: false });
            if (e.key === 'ArrowUp') setInput({ ...input, up: false });
            if (e.key === ' ') setInput({ ...input, drop: false });
            if (e.key === 'z') setInput({ ...input, hold: false });
            if (e.key === 'p') setInput({ ...input, pause: false });
            if (e.key === 'r') setInput({ ...input, restart: false });
        };
    }, [input]);

    const handlePieces = (time: number) => {
        // Handling piece movement downwards
        if (!previousDownMove.current) previousDownMove.current = time;
        if (time - previousDownMove.current > millisPerDownMove) {
            previousDownMove.current = time;
            movePiece(currentPiece, 'd');
        }
    };

    const handleInput = (frame: number) => {
        // if(frame % framesPerKeyHandle === 0) {
        // }
    };

    const movePiece = (piece: TetrisPiece, direction: string) => {
        piece.move(direction);
    };

    const clearCanvas = (context: CanvasRenderingContext2D) => {
        const canvas = context.canvas;
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    useFrameLoop(
        (frame, time, dt) => {
            if (!ctx) {
                const canvas = canvasRef.current as HTMLCanvasElement;
                const context = canvas.getContext(
                    '2d'
                ) as CanvasRenderingContext2D;
                canvas.width = tetris.cols * tetris.cellSize;
                canvas.height = tetris.rows * tetris.cellSize;
                setCtx(context);
                return;
            }

            clearCanvas(ctx);
            drawGrid(ctx);

            handlePieces(time);
            handleInput(frame);

            console.log(input);

            drawPieces(ctx);
        },
        [
            ctx,
            currentPiece,
            pieces,
            input,
            millisPerDownMove,
            framesPerKeyHandle,
        ]
    );

    return (
        <StyledGamePanel>
            <Canvas ref={canvasRef} className="tetris-canvas" />
        </StyledGamePanel>
    );
};

export default GamePanel;
