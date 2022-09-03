import React from 'react';
import { StyledConfigurable } from './TetrisPage.styled';

interface Props {
    title: string;
    description: string;
    type: {
        name: 'number',
        min: number,
        max: number,
        
    } | {
        name: 'boolean'
    };
    value: number | boolean;
    min?: number;
    max?: number;
}

const Configurable: React.FC<Props> = (props: Props) => {
    return (
        <StyledConfigurable>
            <p className="config-title">{props.title}</p>
            <p className="config-description">{props.description}</p>
            {props.type.name === 'boolean' ? 
                (<input
                    type='checkbox'
                    className='config-checkbox'
                    onChange={(e) => console.log(e)}
                ></input>) :
                (<input
                    type='number'
                    className='config-number'
                    onChange={(e) => console.log(e)}
                ></input>)
            }
        </StyledConfigurable>
    );
}
export default Configurable;