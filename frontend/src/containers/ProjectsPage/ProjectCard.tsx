import React, { ReactNode } from 'react';
import Image from 'components/ui/Image';
import Video from 'components/ui/Video';

interface Props {
    name: string;
    description: string;
    url: string;
    logo: string;
    legacy?: boolean;
    capybara?: boolean;
    element?: React.ReactNode;
}

const ProjectCard: React.FC<Props> = (props: Props) => {
    const createMedia = (): ReactNode => {
        if (props.logo.endsWith('.png'))
            return (
                <Image
                    className="project-media"
                    src={props.logo}
                    style={{
                        width: '100%',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                    }}
                    url={props.url}
                />
            );
        if (props.logo.endsWith('.mp4'))
            return (
                <Video
                    className="project-media"
                    src={props.logo}
                    style={{
                        width: '100%',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                    }}
                    url={props.url}
                    blank={true}
                />
            );
    };

    return (
        <div className="project-container">
            {props.element}
            {createMedia()}
            <div className="project-content">
                <p className="project-name">{props.name}</p>
                <p className="project-description">{props.description}</p>
            </div>
            {props.legacy && (
                <a className="legacy-link" href={`${props.url}/legacy`}>
                    Legacy
                </a>
            )}
        </div>
    );
};

export default ProjectCard;
export { Props };
