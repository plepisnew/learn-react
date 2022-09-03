import React, { ReactNode } from 'react'
import ProjectCard, { Props as ProjectProps } from './ProjectCard';

interface Props {
    projects: ProjectProps[],
}

const ProjectList: React.FC<Props> = (props: Props) => {

    const createProjectList = (projects: ProjectProps[]): ReactNode[] => {
        return projects.map(project => <ProjectCard
            name={project.name}
            description={project.description}
            url={project.url}
            logo={project.logo}
            legacy={project.legacy}
            key={project.description}
        />)
    }

    return (<div className="projects-container">{createProjectList(props.projects)}</div>);
}

export default ProjectList;