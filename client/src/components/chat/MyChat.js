import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, Stack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect } from 'react'
import { ChatState } from '../../context/ChatContext'
import { getOtherUser } from '../../utils/UtilityFunctions'
import ChatItem from '../chat/ChatItem'
import GroupModal from '../group_chat/GroupModal'

const MyChat = () => {

    const toast = useToast()
    const { loggedInUser, chat, setChat, selectedChat } = ChatState()

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const config = {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: `Bearer ${loggedInUser.token}`,
                    },
                };
                const { data } = await axios.get('/chat', config)
                setChat(data)
            } catch (error) {
                if (error.response.data === "User not found") {
                    localStorage.removeItem('user')
                    return
                }
                console.error(error)
                toast({
                    title: 'Error Occured',
                    description: error.response.data,
                    status: 'error',
                    duration: 2000,
                    isClosable: false,
                    position: 'bottom-left'
                })
            }
        }
        fetchChat()
        // eslint-disable-next-line
    }, [toast])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir='column'
            width={{ base: '100%', md: '30%' }}
            height='100%' borderRadius='lg'
            backgroundColor='white' p={3}
        >
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Heading size='md'>My Chats</Heading>
                <GroupModal>
                    <Button leftIcon={<AddIcon />}>New Group</Button>
                </GroupModal>
            </Box>
            <Stack overflowY='scroll' width='100%' mt={5}>
                {
                    chat && loggedInUser &&
                    chat.map(each => (
                        <ChatItem key={each._id} chat={each} otherUser={getOtherUser(loggedInUser, each.users)} />
                    ))
                }
            </Stack>
        </Box>
    )
}

export default MyChat
