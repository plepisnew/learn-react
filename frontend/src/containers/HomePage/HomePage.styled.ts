import styled from 'styled-components';
import { ui } from 'util/constants';

export const StyledSidebar = styled.div`
    & {
        color: white;
        position: fixed;
        left: -${ui.sidebar.width};
        top: ${ui.header.height};
        bottom: 0;
        width: ${ui.sidebar.width};
        background: rgb(50, 50, 50);
        border-right: ${ui.sidebar.borderWidth} solid black;
        box-sizing: border-box;
        z-index: 1;
        transition: left 1s;
        padding: 10px;
        font-family: 'Poppins';
        font-weight: 600;
        font-size: 15px;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .expand-config {
        background: rgb(50, 50, 50);
        color: white;
        position: absolute;
        right: -40px;
        top: 30px;
        width: 40px;
        height: 50px;
        box-sizing: border-box;
        border-top: ${ui.sidebar.borderWidth} solid black;
        border-right: ${ui.sidebar.borderWidth} solid black;
        border-bottom: ${ui.sidebar.borderWidth} solid black;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &:hover,
    .expand-config:hover & {
        left: 0;
    }

    .animation-button,
    .updating-button {
        margin: 5px;
        padding: 5px;
        border: none;
        font-weight: 600;
        color: white;
        border-radius: 5px;
        transition: 500ms opacity;
    }

    .animation-button:hover,
    .updating-button:hover {
        opacity: 0.9;
    }

    .socials {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        margin: 10px;
    }

`

export const StyledWelcome = styled.div`
    .welcome-text {
        color: black;
        font-family: 'Poppins';
        font-size: 5vw;
        font-weight: 600;
        display: inline;
    }

    & {
        position: fixed;
        left: 15vw;
        right: 15vw;
        top: 15vw;
        display: flex;
        align-items: center;
    }
`

export const StyledSlider = styled.div`
    margin: 5px;
    vertical-align: top;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
`

export const StyledChatbox = styled.div`

    & {
        margin: 5px;
        vertical-align: top;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    .message-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }

    .chatbox {
        position: fixed;
        right: 100px;
        width: 300px;
        height: 600px;
        z-index: 1;
        background: rgb(50, 50, 50);
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        color: white;
        font-family: 'Poppins';
        font-size: 13px;
        transition: 1s bottom;
    }

    .closed-chatbox {
        bottom: -570px;
    }

    .open-chatbox {
        bottom: 0px;
    }

    .expand-content {
        cursor: pointer;
        height: 30px;
        padding: 5px;
        font-weight: 600;
        font-size: 15px;
    }

    .content-scrollbar {
        overflow-y: scroll;
        background: rgb(60, 60, 60);
        width: 100%;
        height: 540px;
    }

    .content-container {
        background: rgb(60, 60, 60);
        height: 100%;
        padding: 5px;
    }

    .chat-input-container {
        height: 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    .chat-input,
    .chat-submit {
        border-radius: 3px;
        font-family: 'Poppins';
        background: rgb(245, 245, 245);
        border: none;
    }

    .chat-input {
        width: 75%;
        padding: 0 3px;
    }

    .chat-submit {
        width: 20%;
        cursor: pointer;
    }

    .chat-input:focus {
        outline: none;
    }

    .time-stamp {
        font-size: 10px;
        font-family: 'Consolas';
        margin-top: 4px;
        margin-right: 3px;
    }

    .author {
        font-family: 'Poppins';
        font-weight: 600;
    }

    .message-content {
        flex: 1;
    }
`