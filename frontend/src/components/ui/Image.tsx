import React from 'react'
import { Link } from 'react-router-dom';

interface Props {
    src: string;
    url?: string;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    blank?: boolean;
    className?: string;
}

const Image: React.FC<Props> = (props: Props) => {

    const createImage = (): React.ReactElement => {
        return (
            <img
                src={`/images/${props.src}`}
                width={props.width}
                height={props.height}
                style={props.style}
                className={props.className}
            ></img>
        );
    }

    const createLink = (url: string, element: React.ReactNode): React.ReactElement => {
        return <Link to={url}>{element}</Link>
    }

    const createAnchor = (url: string, element: React.ReactNode): React.ReactElement => {
        return <a href={url} target={props.blank ? '_blank' : ''}>{element}</a>
    }

    return props.url ? (props.url.startsWith('/') ? createLink(props.url, createImage()) : createAnchor(props.url, createImage())) : createImage();
}

export default Image;