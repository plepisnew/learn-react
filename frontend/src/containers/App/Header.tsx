import React from 'react';
import { StyledHeader } from './App.styled';
import Image from 'components/ui/Image';
import Navigation from './Navigation';
import navItems from 'data/navbarItems.json';

const Header: React.FC = () => {
    return (
        <StyledHeader>
            <div className="logo-container">
                <Image src="home/double-a.png" className="logo-image" />
            </div>
            <div className="text-container">
                <span className="header-text">
                    Suh, dude; peep my projects. Or not idc
                </span>
            </div>
            <div className="navigation-container">
                <Navigation items={navItems} />
            </div>
        </StyledHeader>
    );
};

export default Header;
