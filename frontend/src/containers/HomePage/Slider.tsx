import React from 'react';
import { StyledSlider } from './HomePage.styled';

interface Props {
    title: string;
    min: number;
    max: number;
    default?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<Props> = (props: Props) => {
    return (
        <StyledSlider>
            <span>{props.title}</span>
            <input
                type="range"
                min={props.min}
                max={props.max}
                value={props.default}
                onChange={props.onChange}
                className="slider float-input"
            />
        </StyledSlider>
    );
};
export default Slider;
