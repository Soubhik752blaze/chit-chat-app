export const getSender = (loggedUser, users) => {
    if(!loggedUser || !users)
        return '';
    const senderName = users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    return senderName;
}

export const getSenderFull = (loggedUser, users) => {
    if(!loggedUser || !users)
        return {};
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isNotSameSender = (messages, m, i, userId) => {
    return (
        (i < messages.length - 1) &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        (messages[i].sender._id !== userId)
    );
};

export const isLastMessage = (messages, i, userId) => {
    return (
        (i === messages.length - 1) &&
        (messages[messages.length - 1].sender._id !== userId) &&
        (messages[messages.length - 1].sender._id)
    );
};

export const isSameSenderMargin = (messages, m, i, userId) => {

    //if sender is same and not loggedin user
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 45;
    //if sender isnot same or is the last message (not loggedin user)
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    //if sender is loggedin user
    else return "auto";
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const isSameChat = (chats, message) => {
    chats.forEach((chat) => {
        if (chat._id == message.chat._id)
            return true;
    })
    return false;
}