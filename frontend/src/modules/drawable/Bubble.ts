import { bubbles as constants } from 'util/constants';

class Bubble {
    x: number;
    y: number;
    r: number;
    rEnd: number;
    dx: number;
    dy: number;
    fill: string;

    constructor(
        x: number,
        y: number,
        r: number,
        rEnd: number,
        dx: number,
        dy: number,
        fill: string
    ) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rEnd = rEnd;
        this.dx = dx;
        this.dy = dy;
        this.fill = fill;
    }

    draw(context: CanvasRenderingContext2D, opacity: number) {
        context.beginPath();
        context.fillStyle = this.fill;
        context.globalAlpha = opacity / 100;
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        context.fill();
    }

    update(dt: number, floatation: number, inflation: number) {
        this.r += (this.rEnd - this.r) / inflation;
        this.y -= (floatation * dt) / (this.r ** 2 / 7000); // random magic number
    }

    static factory() {
        return new BubbleFactory();
    }
}

class BubbleFactory {
    bunchStill(
        count: number,
        startX: number,
        endX: number,
        startY: number,
        endY: number,
        startR: number,
        endR: number,
        fill?: string
    ) {
        const bubbles: Bubble[] = [];
        first(count).forEach(() => {
            const determinedFill = fill || randomColor();
            const radius = randInt(startR, endR);
            bubbles.push(
                new Bubble(
                    randInt(startX, endX),
                    randInt(startY, endY),
                    radius,
                    radius +
                        randInt(
                            constants.inflationDifferenceFloor,
                            constants.inflationDifferenceCeiling
                        ),
                    0,
                    0,
                    determinedFill
                )
            );
        });
        return bubbles;
    }
}

const first = (count: number): number[] => [...Array(count).keys()];

const randInt = (floor: number, ceiling: number): number => {
    return floor + Math.floor(Math.random() * (ceiling - floor + 1));
};

const randomColor = (): string =>
    `rgb(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)})`;

export default Bubble;
