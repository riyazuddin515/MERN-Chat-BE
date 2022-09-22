import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../context/ChatContext'

const ChatItem = ({ chat, otherUser }) => {
    const { selectedChat, setSelectedChat, loggedInUser } = ChatState()
    return (
        <Box key={chat._id} width='100%' display='flex' alignItems='center' gap={2}
            backgroundColor={selectedChat === chat ? 'green' : '#E8E8E8'}
            color={selectedChat === chat ? 'white' : 'black'}
            borderRadius='md' p={3} cursor='pointer'
            onClick={() => setSelectedChat(chat)}
        >
            <Avatar
                src={chat.isGroupChat ? "" : otherUser.profilePic}
                name={chat.isGroupChat ? chat.chatName : otherUser.name} size='sm' />
            <Box>
                <b>{chat.isGroupChat ? chat.chatName : otherUser.name}</b>
                {chat.lastMessage && chat.isGroupChat
                    ? <Text> {`${chat.lastMessage.sender._id === loggedInUser._id
                        ? 'ME'
                        : chat.lastMessage.sender.name
                        }: ${chat.lastMessage.content}`}</Text>
                    : <Text>{chat.lastMessage?.content}</Text>
                }
            </Box>
        </Box>
    )
}

export default ChatItem
