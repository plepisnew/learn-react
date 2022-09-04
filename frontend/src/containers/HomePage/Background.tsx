import React, { useRef, useContext, useState } from 'react';
import Canvas from 'components/ui/Canvas';
import BubbleContext from 'context/BubbleContext';
import useFrameLoop from 'hooks/useFrameLoop';
import Bubble from 'modules/drawable/Bubble';
import { bubblesDebug } from 'util/debug';
import { bubbles as bubbleConstant } from 'util/constants';
import fitToParent from 'util/fitToParent';

const Background: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    const { bubblesFrozen, bubblesOn, floatation, inflation, count, opacity } =
        useContext(BubbleContext);

    const spawnBubbles = (count: number) => {
        return Bubble.factory().bunchStill(
            count,
            0,
            window.innerWidth,
            window.innerHeight,
            window.innerHeight,
            bubbleConstant.radiusFloor,
            bubbleConstant.radiusCeiling
        );
    };

    const [bubbles, setBubbles] = useState<Bubble[]>(spawnBubbles(10));

    useFrameLoop(
        (frame, time, dt) => {
            if (bubblesDebug.logFrame) {
                const fps = Math.floor(1000 / dt);
                console.log(
                    `Frame ${frame} of Game Loop with dt=${Math.floor(
                        dt
                    )}ms and fps=${fps}`
                );
            }

            if (!ctx) {
                // Context not defined in 0th frame. 1st frame onwards have access to canvas and context
                const canvas = canvasRef.current;
                if (canvas) {
                    const context = canvas.getContext('2d');
                    if (context) {
                        setCtx(context);
                        onresize(context);
                    }
                }
                return;
            }
            clearCanvas(ctx as CanvasRenderingContext2D);
            handleBubbles(frame, dt, count, ctx);
        },
        [
            bubblesFrozen,
            bubblesOn,
            bubbles,
            floatation,
            inflation,
            count,
            opacity,
            ctx,
        ]
    );

    const handleBubbles = (
        frame: number,
        dt: number,
        count: number,
        context: CanvasRenderingContext2D
    ) => {
        if (bubblesDebug.logBubbles) console.log(bubbles);
        bubbles.forEach((bubble) => {
            if (!bubblesFrozen) bubble.update(dt / 1000, floatation, inflation);
            bubble.draw(context, opacity);
        });
        if (frame % bubbleConstant.framesPerSpawn == 0) {
            if (!bubblesFrozen && bubblesOn)
                setBubbles(
                    [...bubbles, ...spawnBubbles(count)].filter(
                        (bubble) => bubble.y + bubble.r >= 0
                    )
                );
        }
    };

    const onresize = (context: CanvasRenderingContext2D) => {
        fitToParent(context.canvas);
    };

    const clearCanvas = (context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    };

    window.onresize = () => onresize(ctx as CanvasRenderingContext2D);

    return <Canvas className="background-canvas" ref={canvasRef} />;
};
export default Background;
