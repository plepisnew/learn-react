import styled, { createGlobalStyle } from 'styled-components';
import { ui } from 'util/constants';

export const StyledApp = createGlobalStyle`

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Raleway';
    }

    a {
        text-decoration: none;
    }

    * {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    *::-webkit-scrollbar {
        display: none;
    }

    .navpage {
        padding-top: ${ui.header.height};
        box-sizing: border-box;
        height: 100vh;
        width: 100vw;
    }

`

export const StyledHeader = styled.div`
    & {
        width: 100%;
        height: ${ui.header.height};
        position: fixed;
        background: rgb(20, 20, 20);
        display: flex;
        align-items: center;
        padding: 10px;
    }    

    .logo-image {
        max-width: 50px;
        width: 4vw;
    }

    .header-text {
        color: white;
        font-weight: 600;
        font-size: ${ui.header.titleFontSize};
    }

    .logo-container {
        padding: 10px;
    }

    .text-container {
        flex: 2;
    }

    .navigation-container {
        flex: 1;
        display: flex;
    }

    .nav-link {
        color: white;
        font-weight: 600;
        font-size: ${ui.header.navFontSize};
        border-bottom: 1px solid white;
        padding: 2px 0;
        margin: 5px;
        text-transform: uppercase;
        transition: opacity 400ms;
    }

    .nav-link:hover {
        opacity: 0.8;
    }

    .selected-link {
        color: #66BB6A;
        border-bottom: 1px solid #66BB6A;
    }
`