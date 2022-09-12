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
    const heldRef = useRef<HTMLCanvasElement>(null);
    const nextRef = useRef<HTMLCanvasElement>(null);

    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const [heldCtx, setHeldCtx] = useState<CanvasRenderingContext2D>();
    const [nextCtx, setNextCtx] = useState<CanvasRenderingContext2D>();

    const [currentPiece, setCurrentPiece] = useState<Tetris.TetrisPiece>(
        Tetris.randomPiece()
    );
    const [nextPiece, setNextPiece] = useState<Tetris.TetrisPiece>(
        Tetris.randomPiece()
    );
    const [heldPiece, setHeldPiece] = useState<Tetris.TetrisPiece>();
    const [board, setBoard] = useState<Tetris.Block[]>([]);

    const previousDownMove = useRef<number>(0);

    const input = useRef<Tetris.UserInput>(Tetris.initialInput);
    useEffect(() => {
        Tetris.setupKeyBinds(window, input.current);
    }, []);

    useFrameLoop(
        (frame, time) => {
            if (frame === 0 || !ctx || !heldCtx || !nextCtx) {
                const canvas = canvasRef.current as HTMLCanvasElement;
                const context = canvas.getContext(
                    '2d'
                ) as CanvasRenderingContext2D;
                canvas.width = tetris.cols * tetris.cellSize;
                canvas.height = tetris.rows * tetris.cellSize;

                const smallCanvasDimensions = 4 * tetris.cellSize;

                const heldCanvas = heldRef.current as HTMLCanvasElement;
                const heldContext = heldCanvas.getContext(
                    '2d'
                ) as CanvasRenderingContext2D;
                heldContext.translate(-80, 0);
                heldCanvas.width = smallCanvasDimensions;
                heldCanvas.height = smallCanvasDimensions;

                const nextCanvas = nextRef.current as HTMLCanvasElement;
                const nextContext = nextCanvas.getContext(
                    '2d'
                ) as CanvasRenderingContext2D;
                nextContext.translate(-80, 0);
                nextCanvas.width = smallCanvasDimensions;
                nextCanvas.height = smallCanvasDimensions;

                setCtx(context);
                setHeldCtx(heldContext);
                setNextCtx(nextContext);
                return;
            }

            Tetris.handlePieces({
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
                board,
                setBoard,
                input: input.current,
                fallInterval,
                framesPerKeyHandle,
                keyPressFrameDelay,
                projectionOpacity,
            });
        },
        [
            ctx,
            heldCtx,
            nextCtx,
            currentPiece,
            board,
            input,
            fallInterval,
            framesPerKeyHandle,
            keyPressFrameDelay,
            moveRightOnSpawn,
            projectionOpacity,
        ]
    );

    return (
        <StyledGamePanel>
            <div className="game-container">
                <div className="canvas-container">
                    <Canvas ref={heldRef} />
                    <span className="canvas-footer">HELD PIECE</span>
                </div>
                <div className="canvas-container">
                    <Canvas ref={canvasRef} />
                </div>
                <div className="canvas-container">
                    <Canvas ref={nextRef} />
                    <span className="canvas-footer">NEXT PIECE</span>
                </div>
            </div>
        </StyledGamePanel>
    );
};

export default GamePanel;
