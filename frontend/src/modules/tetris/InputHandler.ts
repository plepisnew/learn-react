/**
 * Handling input for tetris game
 */

export interface KeyProp {
    pressed: boolean;
    handleAt: number;
    initialPress: boolean;
}

export interface UserInput {
    left: KeyProp;
    right: KeyProp;
    spin: KeyProp;
    down: KeyProp;
    drop: KeyProp;
    hold: KeyProp;
    pause: KeyProp;
    restart: KeyProp;
}

export interface MoveCallbacks {
    moveLeft: () => void;
    moveRight: () => void;
    moveDown: () => void;
    spin: () => void;
    drop: () => void;
    // pause: () => void;
    // restart: () => void;
    // hold: () => void;
}

export const initialInput: UserInput = {
    left: { pressed: false, handleAt: 0, initialPress: true },
    right: { pressed: false, handleAt: 0, initialPress: true },
    spin: { pressed: false, handleAt: 0, initialPress: true },
    down: { pressed: false, handleAt: 0, initialPress: true },
    drop: { pressed: false, handleAt: 0, initialPress: true },
    hold: { pressed: false, handleAt: 0, initialPress: true },
    pause: { pressed: false, handleAt: 0, initialPress: true },
    restart: { pressed: false, handleAt: 0, initialPress: true },
};

/**
 * Binds all inputs to update the Input state
 * @param window Window object to which key events will be bound
 * @param input Input state
 */
export const setupKeyBinds = (window: Window, input: UserInput) => {
    window.onkeydown = (e: KeyboardEvent) => {
        if (e.repeat) return;
        if (e.key === 'ArrowLeft') input.left.pressed = true;
        if (e.key === 'ArrowRight') input.right.pressed = true;
        if (e.key === 'ArrowDown') input.down.pressed = true;
        // Handle keys only once
        if (e.key === 'ArrowUp') input.spin.pressed = true;
        if (e.key === ' ') input.drop.pressed = true;
        if (e.key === 'z') input.hold.pressed = true;
        if (e.key === 'p') input.pause.pressed = true;
        if (e.key === 'r') input.restart.pressed = true;
    };

    window.onkeyup = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') input.left.pressed = false;
        if (e.key === 'ArrowRight') input.right.pressed = false;
        if (e.key === 'ArrowDown') input.down.pressed = false;
        // Handle keys only once
        if (e.key === 'ArrowUp') input.spin.pressed = false;
        if (e.key === ' ') input.drop.pressed = false;
        if (e.key === 'z') input.hold.pressed = false;
        if (e.key === 'p') input.pause.pressed = false;
        if (e.key === 'r') input.restart.pressed = false;
    };
};

export const handleInput = (
    frame: number,
    framesPerKeyHandle: number,
    keyPressFrameDelay: number,
    input: UserInput,
    moveCallbacks: MoveCallbacks
): void => {
    [input.right, input.left, input.down].forEach((key) => {
        if (key.pressed) {
            if (frame > key.handleAt) {
                if (key.initialPress) {
                    if (key === input.right) moveCallbacks.moveRight();
                    if (key === input.left) moveCallbacks.moveLeft();
                    if (key === input.down) moveCallbacks.moveDown();
                    key.handleAt = frame + keyPressFrameDelay;
                    key.initialPress = false;
                } else if (frame % framesPerKeyHandle === 0) {
                    if (key === input.right) moveCallbacks.moveRight();
                    if (key === input.left) moveCallbacks.moveLeft();
                    if (key === input.down) moveCallbacks.moveDown();
                }
            }
        } else {
            key.initialPress = true;
        }
    });
    if (input.spin.pressed) {
        moveCallbacks.spin();
        input.spin.pressed = false;
    }
    if (input.drop.pressed) {
        moveCallbacks.drop();
        input.drop.pressed = false;
    }
};
