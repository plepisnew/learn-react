import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
    title: string;
    url: string;
    onClick?: () => void;
    selected?: boolean;
}

const NavItem: React.FC<Props> = (props: Props) => {
    return (
        <Link
            className={`nav-link ${props.selected ? 'selected-link' : ''}`}
            to={props.url}
            onClick={props.onClick}
        >
            {props.title}
        </Link>
    );
};

export { Props };
export default NavItem;
