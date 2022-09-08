import React, { useState } from 'react';
import { StyledTetrisPage } from './TetrisPage.styled';
import InfoPanel from './InfoPanel';
import ConfigPanel from './ConfigPanel';
import GamePanel from './GamePanel';
import TetrisContext from 'context/TetrisContext';
import { tetris } from 'util/constants';

const TetrisPage: React.FC = () => {
    const [cancerMode, setCancerMode] = useState(tetris.cancerMode);
    const [shadowMode, setShadowMode] = useState(tetris.shadowMode);
    const [placeOnMoveDown, setPlaceOnMoveDown] = useState(
        tetris.placeOnMoveDown
    );
    const [projectionOpacity, setProjectionOpacity] = useState(
        tetris.projectionOpacity
    );
    const [rotationDelay, setRotationDelay] = useState(tetris.rotationDelay);
    const [keyPressFrameDelay, setKeyPressFrameDelay] = useState(
        tetris.keyPressFrameDelay
    );
    const [framesPerKeyHandle, setFramesPerKeyHandle] = useState(
        tetris.framesPerKeyHandle
    );
    const [fallInterval, setFallInterval] = useState(tetris.fallInterval);
    const [moveRightOnSpawn, setMoveRightOnSpawn] = useState(
        tetris.moveRightOnSpawn
    );

    return (
        <StyledTetrisPage className="navpage">
            <TetrisContext.Provider
                value={{
                    cancerMode,
                    setCancerMode,
                    shadowMode,
                    setShadowMode,
                    placeOnMoveDown,
                    setPlaceOnMoveDown,
                    projectionOpacity,
                    setProjectionOpacity,
                    rotationDelay,
                    setRotationDelay,
                    keyPressFrameDelay,
                    setKeyPressFrameDelay,
                    framesPerKeyHandle,
                    setFramesPerKeyHandle,
                    fallInterval,
                    setFallInterval,
                    moveRightOnSpawn,
                    setMoveRightOnSpawn,
                }}
            >
                <InfoPanel />

                <GamePanel />

                <ConfigPanel />
            </TetrisContext.Provider>
        </StyledTetrisPage>
    );
};

export default TetrisPage;
