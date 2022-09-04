import styled from 'styled-components';

const redColor = '#E91E63';
const blueColor = '#039BE5';
const darkRedColor = '#C2185B';

export const StyledTetrisPage = styled.div`
    & {
        display: flex;
    }

    * {
        font-family: VT323;
    }
`;

export const StyledInfoPanel = styled.div`
    & {
        flex: 1;
        background: ${redColor};
        border-right: 2px solid ${darkRedColor};
        padding: 5px;
    }

    p {
        font-size: 24px;
    }

    a {
        font-size: 24px;
    }
`;

export const StyledGamePanel = styled.div`
    & {
        flex: 2;
        background: ${blueColor};
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tetris-canvas {
        background: white;
        border: 4px solid black;
    }
`;

export const StyledConfigPanel = styled.div`
    & {
        flex: 1;
        background: ${redColor};
        border-left: 2px solid ${darkRedColor};
        padding: 5px;
    }

    p {
        font-size: 24px;
    }
`;

export const StyledConfigurable = styled.div`
    .config-title {
    }

    .config-description {
    }

    .config-checkbox {
    }

    .config-number {
    }
`;
