export const getOtherUser = (loggedInUser, users) => {
    return users[0]._id === loggedInUser._id ? users[1] : users[0]
}

export const isSenderLastMessage = (messages, index, loggedInUser) => {
    return messages && messages.length > 1 &&
        index < messages.length &&
        messages[index]?.sender?._id !== loggedInUser._id &&
        messages[index]?.sender?._id !== messages[index + 1]?.sender?._id
}