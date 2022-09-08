import Canvas from 'components/ui/Canvas';
import useFrameLoop from 'hooks/useFrameLoop';
import React, { useRef, useState, useEffect } from 'react';
import { capybara } from 'util/constants';

/**
 * If only width is provided, then height will scale according to width
 * If only height is provided, then width will scale according to height
 * If both width and height are provided, then only width is used
 * If neither width nor height are provided, then default size is used
 */
interface Props {
    width?: number;
    height?: number;
    style?: React.CSSProperties;
}

const Capybara: React.FC<Props> = ({ width, height, style }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const [image, setImage] = useState<HTMLImageElement>();
    const [size, setSize] = useState<{ width: number; height: number }>();

    const loadImage = (): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.src = capybara.src;
        });

    useFrameLoop(
        (frame) => {
            if (frame === 0) {
                const canvas = canvasRef.current as HTMLCanvasElement;
                const context = canvas.getContext(
                    '2d'
                ) as CanvasRenderingContext2D;
                setCtx(context);

                loadImage().then((image) => {
                    setImage(image);
                    const aspectRatio =
                        image.width / capybara.frames / image.height;
                    const size = {
                        width: width
                            ? width
                            : height
                            ? aspectRatio * height
                            : image.width / capybara.frames,
                        height: width
                            ? width / aspectRatio
                            : height
                            ? height
                            : image.height,
                    };
                    setSize(size);
                    canvas.width = size.width;
                    canvas.height = size.height;
                });
            }

            if (!ctx || !image || !size) return;

            if (frame % capybara.frameSkip === 0) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.drawImage(
                    image,
                    ((frame / capybara.frameSkip) % capybara.frames) *
                        (image.width / capybara.frames),
                    0,
                    image.width / capybara.frames,
                    image.height,
                    0,
                    0,
                    size.width,
                    size.height
                );
            }
        },
        [ctx, image, size]
    );

    return (
        <div style={style}>
            {/* put a semicolon after the trailing '>' it will be funny */}
            <Canvas ref={canvasRef} />
        </div>
    );
};

export default Capybara;
