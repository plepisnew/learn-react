import React, { useEffect, useRef, useState } from 'react'
import useLoopFetch from 'hooks/useLoopFetch';
import parseTime from 'util/parseTime';
import usernames from 'data/usernames.json';
import axios from 'axios';
import { StyledChatbox } from './HomePage.styled';
import { chat } from 'util/constants';

const Chatbox: React.FC = () => {

    const [open, setOpen] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const url = chat.messagesUrl;
    const { apparentData, loading } = useLoopFetch(url, chat.latencyMillis);

    const [currentUser, setCurrentUser] = useState(usernames[Math.floor(Math.random()*usernames.length)]);

    useEffect(() => {
        scroll();
    }, [apparentData]);

    const scroll = () => {
        const scrollbar = scrollRef.current;
        if(scrollbar) scrollbar.scrollTop = scrollbar.scrollHeight - scrollbar.clientHeight;
    }

    const getMessages = () => {
        if(loading) return <p>Loading Messages...</p>
        if(apparentData) return apparentData.map(message => (<div className='message-container' key={message.createdAt}>
            <span className='time-stamp'>{parseTime(message.createdAt)}</span>
            <span className='message-content'>
                <span className='author'>{message.user}:</span> {message.content}
            </span>
        </div>));
    }

    const submitMessage = () => {
        if(inputRef.current) {
            const inputField = inputRef.current;
            const message = inputField.value;
            inputField.value = '';
            
            axios.post(url, {
                content: message,
                user: currentUser,
            });
        }
    }

    return (
        <StyledChatbox>
            <div className={`chatbox ${open ? 'open-chatbox' : 'closed-chatbox'}`}>
                <div className="expand-content" onClick={() => {
                    setOpen(!open);
                    if(!open) scroll();
                }}>
                    <p>Open Chat</p>
                </div>
                <div className="content-scrollbar" ref={scrollRef}>
                    <div className="content-container">{getMessages()}</div>
                </div>
                <div className="chat-input-container">
                    <input type="text" className="chat-input" ref={inputRef} onKeyDown={(e) => {
                        if(e.key === 'Enter') submitMessage();
                    }}/>
                    <button className="chat-submit" onClick={submitMessage}>Submit</button>
                </div>
            </div>
        </StyledChatbox>
    );
}
export default Chatbox;