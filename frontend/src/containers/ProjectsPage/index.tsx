import React from "react";
import { StyledProjectsPage } from './ProjectsPage.styled';
import ProjectList from './ProjectList';
import data from 'data/projects.json';

const ProjectsPage: React.FC = () => {
    return (<StyledProjectsPage className='navpage'>
        <ProjectList projects={data} />
    </StyledProjectsPage>)
}

export default ProjectsPage;