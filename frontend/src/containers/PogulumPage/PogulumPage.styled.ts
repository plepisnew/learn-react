import styled from 'styled-components';

const StyledClipCard = styled.div`

    & {
        display: flex;
        height: 80px;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 1px 1px 2px rgb(40, 40, 40);
        background: #673AB7;
        color: white;
    }

    &:active {
        box-shadow: none;
    }

    .image-container {
        display: inline-block;
        border-right: 1px solid black;
    }

    .line {
        padding: 2px;
    }

    .text-container {
        margin: 3px;
        overflow: scroll;
    }

    .bold {
        font-weight: 700;
        font-size: 17px;
    }

    .normal {
        font-weight: 500;
        fonnt-size: 18px;
    }
    
`

const StyledInputPanel = styled.div`
    
`

const StyledUserPanel = styled.div`
    margin: 20px;
`

export { StyledClipCard, StyledInputPanel, StyledUserPanel };