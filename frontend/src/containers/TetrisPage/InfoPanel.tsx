import React from 'react'
import { StyledInfoPanel } from './TetrisPage.styled';

const InfoPanel: React.FC = () => {
    return (
        <StyledInfoPanel>
            <p>Panel for selecting game-mode and other configuration</p>
            <p>See more <a href="https://github.com/plepisnew/learn-js/milestone/1" target={'_blank'}>here</a></p>
        </StyledInfoPanel>
    );
}

export default InfoPanel;