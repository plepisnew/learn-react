/**
 * Handling input for tetris game
 */
import React from 'react';

export interface UserInput {
    left: boolean;
    right: boolean;
    spin: boolean;
    down: boolean;
    drop: boolean;
    hold: boolean;
    pause: boolean;
    restart: boolean;
}

export const initialInput: UserInput = {} as UserInput;

/**
 * Binds all inputs to update the Input state
 * @param window Window object to which key events will be bound
 * @param input Input state
 * @param setInput Input state setter
 */
export const setupKeyBinds = (
    window: Window,
    input: typeof initialInput,
    setInput: React.Dispatch<React.SetStateAction<typeof initialInput>>
) => {
    window.onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') setInput({ ...input, left: true });
        if (e.key === 'ArrowRight') setInput({ ...input, right: true });
        if (e.key === 'ArrowDown') setInput({ ...input, down: true });
        // Handle keys only once
        if (e.key === 'ArrowUp') setInput({ ...input, spin: true });
        if (e.key === ' ') setInput({ ...input, drop: true });
        if (e.key === 'z') setInput({ ...input, hold: true });
        if (e.key === 'p') setInput({ ...input, pause: true });
        if (e.key === 'r') setInput({ ...input, restart: true });
    };

    window.onkeyup = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') setInput({ ...input, left: false });
        if (e.key === 'ArrowRight') setInput({ ...input, right: false });
        if (e.key === 'ArrowDown') setInput({ ...input, down: false });
        // if (e.key === 'ArrowUp') setInput({ ...input, spin: false });
        // if (e.key === ' ') setInput({ ...input, drop: false });
        // if (e.key === 'z') setInput({ ...input, hold: false });
        // if (e.key === 'p') setInput({ ...input, pause: false });
        // if (e.key === 'r') setInput({ ...input, restart: false });
    };
};
