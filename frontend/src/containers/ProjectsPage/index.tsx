import React from 'react';
import { StyledProjectsPage } from './ProjectsPage.styled';
import ProjectList from './ProjectList';
import data from 'data/projects.json';

const ProjectsPage: React.FC = () => {
    return (
        <div className="navpage">
            <StyledProjectsPage>
                <ProjectList projects={data} />
            </StyledProjectsPage>
        </div>
    );
};

export default ProjectsPage;
