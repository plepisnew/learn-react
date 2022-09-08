import styled from 'styled-components';

export const StyledProjectsPage = styled.div`
    .project-container {
        margin: 10px;
        flex: 1;
        background: rgb(240, 240, 240);
        border-radius: 10px;
        box-shadow: 1px 1px 5px rgb(150, 150, 150);
        position: relative;
    }

    .project-media,
    .project-content {
        opacity: 0.8;
        transition: opacity 500ms;
    }

    .project-media:hover,
    .project-content:hover {
        opacity: 1;
    }

    .project-container:active {
        box-shadow: none;
    }

    .project-container:hover {
        opacity: 1;
    }
    .project-content {
        padding: 4px;
    }

    .project-name {
        font-weight: 700;
        font-size: 17px;
        padding-bottom: 4px;
    }

    .project-description {
        font-weight: 400;
        font-size: 14px;
        padding-bottom: 4px;
    }

    .legacy-link {
        font-size: 14px;
        padding: 3px;
        border-radius: 5px;
        position: absolute;
        top: 0;
        right: 0;
        background: rgb(10, 10, 10);
        color: white;
        transform: translateX(-25%) translateY(50%);
        border: 1px solid black;
        transition: 300ms border;
    }

    .legacy-link:hover {
        border: 1px solid white;
    }

    @media (max-width: 1000px) {
        .projects-container {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
    }

    @media (max-width: 750px) {
        .projects-container {
            grid-template-columns: 1fr 1fr 1fr;
        }
    }

    @media (max-width: 500px) {
        .projects-container {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (min-width: 1000px) {
        .projects-container {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
    }

    .projects-container {
        display: grid;
    }
`;
