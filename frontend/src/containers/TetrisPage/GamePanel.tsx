import React, { useRef, useState, useContext, useEffect } from 'react';
import { StyledGamePanel } from './TetrisPage.styled';
import useFrameLoop from 'hooks/useFrameLoop';
import Canvas from 'components/ui/Canvas';
import { tetris } from 'util/constants';
import * as Tetris from 'modules/tetris/Tetris';
import TetrisContext from 'context/TetrisContext';

const GamePanel: React.FC = () => {
    const {
        cancerMode,
        shadowMode,
        placeOnMoveDown,
        projectionOpacity,
        rotationDelay,
        keyPressFrameDelay,
        framesPerKeyHandle,
        fallInterval,
        moveRightOnSpawn,
    } = useContext(TetrisContext);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    const [currentPiece, setCurrentPiece] = useState<Tetris.TetrisPiece>(
        Tetris.randomPiece()
    );
    const [board, setBoard] = useState<Tetris.Block[]>([]);
    const [input, setInput] = useState<Tetris.UserInput>(Tetris.initialInput);

    const previousDownMove = useRef<number>(0);
    const nextKeyHandle = useRef<{ frame: number; update: boolean }>({
        frame: 0,
        update: true,
    });

    useEffect(() => {
        Tetris.setupKeyBinds(window, input, setInput);
    }, [input]);

    useFrameLoop(
        (frame, time) => {
            if (frame === 0 || !ctx) {
                console.log(window);
                const canvas = canvasRef.current as HTMLCanvasElement;
                const context = canvas.getContext(
                    '2d'
                ) as CanvasRenderingContext2D;
                canvas.width = tetris.cols * tetris.cellSize;
                canvas.height = tetris.rows * tetris.cellSize;
                return setCtx(context);
            }

            Tetris.clearCanvas(ctx);
            Tetris.drawGrid(ctx);

            Tetris.handlePieces({
                time,
                previousDownMove,
                frame,
                nextKeyHandle,
                currentPiece,
                setCurrentPiece,
                board,
                input,
                setInput,
                fallInterval,
                framesPerKeyHandle,
                keyPressFrameDelay,
            });

            Tetris.drawPiece(ctx, currentPiece);
            Tetris.drawBoard(ctx, board);
        },
        [ctx, currentPiece, board, input, fallInterval, framesPerKeyHandle]
    );

    return (
        <StyledGamePanel>
            <Canvas ref={canvasRef} className="tetris-canvas" />
        </StyledGamePanel>
    );
};

export default GamePanel;
