import React, { forwardRef } from 'react'

interface Props {
    width?: number;
    height?: number;
    className?: string;
}

const Canvas = forwardRef((props: Props, ref: React.LegacyRef<HTMLCanvasElement>) => {

    return (
        <canvas 
            width={props.width} 
            height={props.height} 
            ref={ref} 
            className={props.className}
        ></canvas>
    );
});

export default Canvas;