import Capybara from 'components/misc/Capybara';
import React, { ReactNode, useState } from 'react';
import ProjectCard, { Props as ProjectProps } from './ProjectCard';

interface Props {
    projects: ProjectProps[];
}

const ProjectList: React.FC<Props> = (props: Props) => {
    const createCapybara = () => (
        <Capybara
            width={100}
            height={60}
            style={{
                position: 'absolute',
                zIndex: '2',
                top: '-55px',
                right: '10px',
            }}
        />
    );

    const createProjectList = (projects: ProjectProps[]): ReactNode[] => {
        return projects.map((project) => (
            <ProjectCard
                name={project.name}
                description={project.description}
                url={project.url}
                logo={project.logo}
                legacy={project.legacy}
                key={project.description}
                element={project.capybara && createCapybara()}
            />
        ));
    };

    const [projectCards] = useState(createProjectList(props.projects));

    return (
        <div className="projects-container">
            {projectCards}
            {/* {createProjectList(props.projects)} */}
        </div>
    );
};

export default ProjectList;
