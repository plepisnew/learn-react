import React from 'react';
import { StyledUserPanel } from './PogulumPage.styled';
import ClipCard from './ClipCard';
import InputPanel from './InputPanel';

const UserPanel: React.FC = () => {
    const createDefaultClip = (): React.ReactNode => {
        return (
            <ClipCard
                title="Pogulum: Twitch Clip Scraper (this time working)"
                views={1337}
                duration={420}
                author="Ansis"
                id="generic-id#8008135"
                img="projects/pogulum.png"
                url="https://github.com/plepisnew/"
            />
        );
    };

    return (
        <StyledUserPanel>
            <InputPanel />
            {createDefaultClip()}
        </StyledUserPanel>
    );
};
export default UserPanel;
