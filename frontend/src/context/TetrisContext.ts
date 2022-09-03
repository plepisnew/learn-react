import React, { createContext } from "react";

interface ContextState {
    cancerMode: boolean;
    setCancerMode: React.Dispatch<React.SetStateAction<boolean>>;
    shadowMode: boolean;
    setShadowMode: React.Dispatch<React.SetStateAction<boolean>>;
    placeOnMoveDown: boolean;
    setPlaceOnMoveDown: React.Dispatch<React.SetStateAction<boolean>>;
    projectionOpacity: number;
    setProjectionOpacity: React.Dispatch<React.SetStateAction<number>>;
    rotationFrameDelay: number;
    setRotationFrameDelay: React.Dispatch<React.SetStateAction<number>>;
    keyPressFrameDelay: number;
    setKeyPressFrameDelay: React.Dispatch<React.SetStateAction<number>>;
    framesPerKeyHandle: number;
    setFramesPerKeyHandle: React.Dispatch<React.SetStateAction<number>>;
    millisPerDownMove: number;
    setMillisPerDownMove: React.Dispatch<React.SetStateAction<number>>;
    moveRightOnSpawn: number;
    setMoveRightOnSpawn: React.Dispatch<React.SetStateAction<number>>;
}

export default createContext({} as ContextState);