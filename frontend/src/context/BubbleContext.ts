import React, { createContext } from 'react';

interface ContextState {
    bubblesFrozen: boolean,
    setBubblesFrozen: React.Dispatch<React.SetStateAction<boolean>>,
    bubblesOn: boolean,
    setBubblesOn: React.Dispatch<React.SetStateAction<boolean>>,
    floatation: number,
    setFloatation: React.Dispatch<React.SetStateAction<number>>,
    inflation: number,
    setInflation: React.Dispatch<React.SetStateAction<number>>,
    count: number,
    setCount: React.Dispatch<React.SetStateAction<number>>,
    opacity: number;
    setOpacity: React.Dispatch<React.SetStateAction<number>>,
}

export default createContext({} as ContextState);