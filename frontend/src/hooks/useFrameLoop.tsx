import { useEffect, useRef } from 'react';

type loopCallback = (
    frame: number,
    currentTime: number,
    deltaTime: number
) => void;

/**
 * Custom hook for starting a requestAnimationFrame loop
 * @param {loopCallback} callback - function to be looped
 * @param {any[]} loopDependencies - array of dependencies, which trigger a new loop sequence
 */
const useFrameLoop = (
    callback: loopCallback,
    loopDependencies?: React.DependencyList | undefined
) => {
    const requestId = useRef<number>();
    const previousTime = useRef<number>();
    const currentFrame = useRef<number>();

    const loop = (time: number) => {
        if (
            previousTime.current !== undefined &&
            currentFrame.current !== undefined
        ) {
            const dt = time - previousTime.current;
            const frame = currentFrame.current;
            callback(frame, time, dt);
        }

        previousTime.current = time;
        currentFrame.current =
            currentFrame.current == undefined ? 0 : currentFrame.current + 1;
        requestId.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        requestId.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestId.current as number);
    }, loopDependencies);
};
export default useFrameLoop;
