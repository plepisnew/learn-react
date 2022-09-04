import React, { useRef, useContext } from 'react';
import Image from 'components/ui/Image';
import BubbleContext from 'context/BubbleContext';
import Slider from './Slider';
import { StyledSidebar } from './HomePage.styled';

const Sidebar: React.FC = () => {
    const frozenRef = useRef(null);
    const onRef = useRef(null);

    const {
        bubblesFrozen,
        setBubblesFrozen,
        bubblesOn,
        setBubblesOn,
        floatation,
        setFloatation,
        inflation,
        setInflation,
        count,
        setCount,
        opacity,
        setOpacity,
    } = useContext(BubbleContext);

    return (
        <StyledSidebar>
            <Slider
                title="Bubble Floatation"
                min={30}
                max={200}
                default={floatation}
                onChange={(e) => setFloatation(parseInt(e.target.value))}
            />
            <Slider
                title="Bubble Inflation"
                min={50}
                max={500}
                default={inflation}
                onChange={(e) => setInflation(parseInt(e.target.value))}
            />
            <Slider
                title="Bubble Count"
                min={0}
                max={6}
                default={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
            />
            <Slider
                title="Bubble Opacity"
                min={1}
                max={100}
                default={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
            />
            <button
                className="updating-button"
                ref={frozenRef}
                onClick={() => setBubblesFrozen(!bubblesFrozen)}
                style={{
                    backgroundColor: bubblesFrozen
                        ? 'rgb(230, 74, 25)'
                        : 'rgb(21, 101, 192)',
                }}
            >
                <span>
                    {bubblesFrozen
                        ? 'UNFREEZE BUBBLES 🥵'
                        : 'FREEZE BUBBLES 🥶'}
                </span>
            </button>
            <button
                className="animation-button"
                ref={onRef}
                onClick={() => setBubblesOn(!bubblesOn)}
                style={{
                    backgroundColor: bubblesOn
                        ? 'rgb(198, 40, 40)'
                        : 'rgb(67, 160, 71)',
                }}
            >
                <span>{bubblesOn ? 'BUBBLES OFF ⏸' : 'BUBBLES ON ▶️'}</span>
            </button>
            <div className="socials">
                <Image
                    src="home/facebook.png"
                    url="https://www.facebook.com/ansis.plepsis"
                    blank={true}
                    width={50}
                />
                <Image
                    src="home/github.png"
                    url="https://github.com/plepisnew"
                    blank={true}
                    width={50}
                />
                <Image
                    src="home/linkedin.png"
                    url="https://www.linkedin.com/in/ansis-plepis-597a84164/"
                    blank={true}
                    width={50}
                />
            </div>

            <div className="expand-config">
                <Image
                    className="hamburger"
                    src="home/hamburger.png"
                    width={30}
                />
            </div>
        </StyledSidebar>
    );
};
export default Sidebar;
