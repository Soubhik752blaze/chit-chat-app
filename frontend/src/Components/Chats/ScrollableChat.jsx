import React from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ScrollableFeed from 'react-scrollable-feed'
import animationData from "../../Animations/typing.json"
import {
    isLastMessage,
    isNotSameSender,
    isSameSenderMargin,
    isSameUser,
} from '../../Config/ChatLogics';
import { ChatState } from '../../Context/ChatProvider';
import Lottie from 'react-lottie'
import { findTime } from '../../Config/Enhancements';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};


const ScrollableChat = ({ messages, istyping }) => {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: 'flex' }} key={m._id}>
                        {/* User Picture  */}
                        {(isNotSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                                    <Avatar
                                        size="sm"
                                        sx={{ mt: 1, mr: 0.5, cursor: 'pointer', border: "2px solid white" }}
                                        alt={m.sender.name}
                                        src={m.sender.picture}
                                    />
                                </Tooltip>
                            )}
                        {/* User message  */}
                        <span
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'start',
                                justifyContent: "center",
                                backgroundColor: `${m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`,
                                fontSize: '13px',
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 5 : 10,
                                borderRadius: '8px',
                                padding: '5px 15px',
                                maxWidth: '75%',
                            }}
                        >
                            {m.content}
                            <span style={{ fontSize: '7px', fontWeight: 'bold' }}>{findTime(m.createdAt)}</span>
                        </span>

                    </div>
                ))
            }
            {istyping && <div>
                <Lottie
                    options={defaultOptions}
                    width={60}
                    style={{ borderRaFdius: '10px', marginLeft: 3 }}
                />
            </div>
            }
        </ScrollableFeed >
    );
};

export default ScrollableChat;
