import React, { useState } from 'react';
import { StyledTetrisPage } from './TetrisPage.styled';
import InfoPanel from './InfoPanel';
import ConfigPanel from './ConfigPanel';
import GamePanel from './GamePanel';
import TetrisContext from 'context/TetrisContext';

const TetrisPage: React.FC = () => {
    const [cancerMode, setCancerMode] = useState(false);
    const [shadowMode, setShadowMode] = useState(false);
    const [placeOnMoveDown, setPlaceOnMoveDown] = useState(false);
    const [projectionOpacity, setProjectionOpacity] = useState(0.4);
    const [rotationFrameDelay, setRotationFrameDelay] = useState(100);
    const [keyPressFrameDelay, setKeyPressFrameDelay] = useState(100);
    const [framesPerKeyHandle, setFramesPerKeyHandle] = useState(2);
    const [millisPerDownMove, setMillisPerDownMove] = useState(2000);
    const [moveRightOnSpawn, setMoveRightOnSpawn] = useState(3);

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
                    rotationFrameDelay,
                    setRotationFrameDelay,
                    keyPressFrameDelay,
                    setKeyPressFrameDelay,
                    framesPerKeyHandle,
                    setFramesPerKeyHandle,
                    millisPerDownMove,
                    setMillisPerDownMove,
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
