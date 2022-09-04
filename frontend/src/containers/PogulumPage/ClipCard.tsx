import React from 'react';
import { StyledClipCard } from './PogulumPage.styled';
import Image from 'components/ui/Image';

interface Props {
    title: string;
    views: number;
    author: string;
    duration: number;
    id: string;
    img: string;
    url: string;
}

const ClipCard: React.FC<Props> = (props: Props) => {
    return (
        <StyledClipCard>
            <div className="image-container">
                <Image
                    src={props.img}
                    url={props.url}
                    height={80}
                    blank={true}
                />
            </div>
            <div className="text-container">
                <p className="line">
                    <span className="bold">{props.title} •</span>{' '}
                    <span className="normal">{props.views} views</span>
                </p>
                <p className="line">
                    <span className="bold">Streamed by:</span>{' '}
                    <span className="normal">
                        {props.author} • {props.duration} s
                    </span>
                </p>
                <p className="line">
                    <span className="bold">Clip ID:</span>{' '}
                    <span className="normal">{props.id}</span>
                </p>
            </div>
        </StyledClipCard>
    );
};
export default ClipCard;
