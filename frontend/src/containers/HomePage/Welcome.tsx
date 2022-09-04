import React, { useEffect, useRef } from 'react';
import sleep from 'util/sleep';
import shuffleArray from 'util/shuffleArray';
import randomWords from 'data/randomWords.json';
import { StyledWelcome } from './HomePage.styled';
import { welcome } from 'util/constants';

const Welcome: React.FC = () => {
    const paraRef = useRef<HTMLParagraphElement>(null);
    const flashRef = useRef<HTMLSpanElement>(null);

    const setText = (
        element: HTMLParagraphElement | HTMLSpanElement,
        title: string
    ) => (element.innerText = title);

    const drawAndErase = async (
        title: string,
        paraElement: HTMLParagraphElement,
        flashElement: HTMLSpanElement
    ) => {
        for (let i = 0; i < title.length; i++) {
            setText(paraElement, title.substring(0, i + 1));
            await sleep(welcome.appendMillis);
        }

        await flashTerminal(
            flashElement,
            welcome.flashingCharacter,
            welcome.flashingCount,
            welcome.flashingDelayMillis
        );

        for (let i = title.length - 1; i >= 0; i--) {
            setText(paraElement, title.substring(0, i));
            await sleep(welcome.eraseMillis);
        }
    };

    const flashTerminal = async (
        element: HTMLSpanElement,
        character: string,
        count: number,
        delay: number
    ) => {
        const unitDelay = delay / count;
        for (let i = 0; i < count; i++) {
            setText(element, character);
            await sleep(unitDelay);
            setText(element, '');
            await sleep(unitDelay);
        }
    };

    const drawAndEraseAll = async (
        arr: string[],
        paraElement: HTMLParagraphElement,
        flashElement: HTMLSpanElement
    ) => {
        for (let i = 0; i < arr.length; i++) {
            await drawAndErase(arr[i], paraElement, flashElement);
            await sleep(welcome.newWordMillis);
        }
    };

    useEffect(() => {
        const words = shuffleArray(randomWords).slice(0, welcome.wordCount);
        words.unshift(...welcome.intro);
        drawAndEraseAll(
            words,
            paraRef.current as HTMLParagraphElement,
            flashRef.current as HTMLSpanElement
        );
    }, []);

    return (
        <StyledWelcome>
            <p>
                <span className="welcome-text" ref={paraRef}></span>
                <span className="welcome-text" ref={flashRef}></span>
            </p>
        </StyledWelcome>
    );
};
export default Welcome;
