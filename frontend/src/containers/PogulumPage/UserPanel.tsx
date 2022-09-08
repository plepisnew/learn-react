import React, { useState, useEffect, useRef } from 'react';
import { StyledUserPanel } from './PogulumPage.styled';
import ClipCard from './ClipCard';
import InputPanel from './InputPanel';
import downloadConcat from 'util/downloadConcat';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const UserPanel: React.FC = () => {
    const [ffmpeg] = useState(createFFmpeg({ log: true }));
    const [ready, setReady] = useState(false);

    const loadFFmpeg = async () => {
        await ffmpeg.load();
        setReady(true);
    };

    useEffect(() => {
        loadFFmpeg();
    }, []);

    const firstClipRef = useRef<HTMLInputElement>(null);
    const secondClipRef = useRef<HTMLInputElement>(null);

    const createDefaultClip = (): React.ReactNode => {
        return ready ? (
            <>
                <ClipCard
                    title="Pogulum: Twitch Clip Scraper (this time working)"
                    views={1337}
                    duration={420}
                    author="Ansis"
                    id="generic-id#8008135"
                    img="projects/pogulum.png"
                    url="https://github.com/plepisnew/"
                />
                <button
                    onClick={() => {
                        const firstClip = firstClipRef.current?.value as string;
                        const secondClip = secondClipRef.current
                            ?.value as string;
                        downloadConcat([firstClip, secondClip], ffmpeg);
                    }}
                >
                    Press me :)
                </button>
                <input type="text" ref={firstClipRef} />
                <input type="text" ref={secondClipRef} />
            </>
        ) : (
            <div>Loading...</div>
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
