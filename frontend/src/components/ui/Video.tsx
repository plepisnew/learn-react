import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    src: string;
    url?: string | string[];
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    blank?: boolean;
    className?: string;
}

const Video: React.FC<Props> = (props: Props) => {

    const createVideo = (): React.ReactElement => {
        return (
            <video autoPlay muted loop
                src={`/videos/${props.src}`}
                width={props.width}
                height={props.height}
                style={props.style}
                className={props.className}
            ></video>
        );
    }

    const createLink = (url: string, element: React.ReactNode): React.ReactElement => {
        return <Link to={url}>{element}</Link>
    }

    const createAnchor = (url: string, element: React.ReactNode): React.ReactElement => {
        return <a href={url} target={props.blank ? '_blank' : ''}>{element}</a>
    }

    if(props.url === undefined) return createVideo();
    if(typeof props.url === 'string') return props.url.startsWith('/') ? createLink(props.url, createVideo()) : createAnchor(props.url, createVideo());
    
    const randomVideo = props.url[Math.floor(Math.random()*props.url.length)];
    return randomVideo.startsWith('/') ? createLink(randomVideo, createVideo()) : createAnchor(randomVideo, createVideo());
}

export default Video;