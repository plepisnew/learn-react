import React, { useState } from 'react';
import { bubbles } from 'util/constants';
import Sidebar from './Sidebar';
import Chatbox from './Chatbox';
import Welcome from './Welcome';
import Background from './Background';
import BubbleContext from 'context/BubbleContext';

const HomePage: React.FC = () => {
    const [bubblesFrozen, setBubblesFrozen] = useState(false);
    const [bubblesOn, setBubblesOn] = useState(true);

    const [floatation, setFloatation] = useState(bubbles.floatation);
    const [inflation, setInflation] = useState(bubbles.inflation);
    const [count, setCount] = useState(bubbles.count);
    const [opacity, setOpacity] = useState(bubbles.opacity);

    return (
        <div className="navpage">
            <BubbleContext.Provider
                value={{
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
                }}
            >
                <Background />
                <Sidebar />
            </BubbleContext.Provider>
            <Chatbox />
            <Welcome />
        </div>
    );
};

export default HomePage;
