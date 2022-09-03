import React, { useState } from 'react';
import { Props as NavItemProps } from './NavItem';
import NavItem from './NavItem';

interface Props {
    items: NavItemProps[]
}

const Navigation: React.FC<Props> = (props: Props) => {

    const [currentNavigator, setCurrentNavigator] = useState('home');

    const createNavigationItems = () => {
        return props.items.map(item => (
        <NavItem
            title={item.title}
            url={item.url}
            onClick={() => setCurrentNavigator(item.title)}
            key={item.title}
            selected={currentNavigator === item.title}
        />));
    }

    return (<div className='navigation'>{createNavigationItems()}</div>);
}

export default Navigation;