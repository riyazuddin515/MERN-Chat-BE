import { ArrowBackIcon, InfoIcon } from '@chakra-ui/icons'
import { Box, Heading, IconButton, Input, useToast, Text, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatContext'
import { getOtherUser, isSenderLastMessage } from '../../utils/UtilityFunctions'
import SingleMessage from '../SingleMessage'
import { io } from 'socket.io-client'
import ProfileModal from '../ProfileModal'
import GroupInfoModal from '../group_chat/GroupInfoModal'
import { useRef } from 'react'
import typingGIF from '../../asset/loading.gif'
let socket = io('https://mern-chat-r515.herokuapp.com/');
let previousTimeout;
let selectedChatCopy;

const ChatBox = () => {

    const { loggedInUser, chat, setChat, selectedChat, setSelectedChat, setNotification } = ChatState()
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [newArrivalMessage, setNewArrivalMessage] = useState(null)
    const [typing, setTyping] = useState(false)
    const lastEmptyElement = useRef()
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    useEffect(() => {
        socket.on('receive-message', message => {
            setNewArrivalMessage(message)
            updateLastMessage(message)
        })
        socket.on('typing', (chatId) => {
            if (selectedChatCopy && selectedChatCopy?._id === chatId) {
                setTyping(true)
            }
        })
        socket.on('stop-typing', (chatId) => {
            if (selectedChatCopy && selectedChatCopy?._id === chatId) {
                setTyping(false)
            }
        })
    })

    useEffect(() => {
        selectedChatCopy = selectedChat
        setNewMessage('')
        setMessages([])
        setNewArrivalMessage(null)
        setTyping(false)
    }, [selectedChat])


    useEffect(() => {
        lastEmptyElement.current?.scrollIntoView();
    }, [typing, messages])

    useEffect(() => {
        if (newArrivalMessage) {
            setTyping(false)
            if (chat.length === 0) {
                setChat([newArrivalMessage.chat]);
                return;
            }

            selectedChat?._id === newArrivalMessage.chat?._id &&
                setMessages(pre => [...pre, newArrivalMessage])

            if (selectedChat?._id !== newArrivalMessage.chat?._id) {
                setNotification(pre =>
                    [newArrivalMessage, ...pre.filter(e => e.chat?._id !== newArrivalMessage.chat._id)]
                )
            }
        }
        // eslint-disable-next-line
    }, [newArrivalMessage])

    useEffect(() => {
        socket.emit('add-user', loggedInUser._id)
    }, [loggedInUser])

    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                setLoading(true)
                try {
                    const config = {
                        headers: {
                            'content-type': 'application/json',
                            Authorization: `Bearer ${loggedInUser.token}`,
                        },
                    };
                    const res = await axios.get(`/chat/messages/${selectedChat._id}`, config)
                    setMessages(res.data)
                } catch (error) {
                    console.log(error)
                    toast({
                        title: 'Error Occured',
                        description: error.response.data,
                        status: 'error',
                        duration: 2000,
                        isClosable: false,
                        position: 'bottom-left'
                    })
                }
                setLoading(false)
            }
            fetchMessages()
        }
    }, [selectedChat, loggedInUser, toast])

    const updateLastMessage = (lastMessage) => {
        const r = chat.map(each => {
            if (each._id === lastMessage.chat._id) {
                each.lastMessage = { ...lastMessage }
            }
            return each
        })
        setChat(r)
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage) {
            return
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const { data } = await axios.post('/chat/messages/', { content: newMessage, chat: selectedChat._id }, config)
            socket.emit('send-message', data)
            setMessages([...messages, data])
            updateLastMessage(data)
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error Occured',
                description: error.response.data,
                status: 'error',
                duration: 2000,
                isClosable: false,
                position: 'bottom-left'
            })
        }
        setNewMessage('')
    }

    const typingHandler = (msg) => {
        setNewMessage(msg)
        if (!socket) {
            return
        }
        socket.emit('typing', selectedChat, loggedInUser._id)
        if (previousTimeout) {
            clearTimeout(previousTimeout)
        }
        previousTimeout = setTimeout(() => {
            socket.emit('stop-typing', selectedChat, loggedInUser._id)
        }, 3000)
    }


    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            width={{ base: selectedChat ? '100%' : '70%', md: '70%' }}
            height='100%' borderRadius='lg'
            backgroundColor='white' p={2}
            flexDir='column'
        >
            {
                selectedChat
                    ?
                    loading
                        ? <Spinner color='green' size='xl' margin='auto' />
                        : <Box height='100%'
                            display='flex' flexDir='column'
                        >
                            <Box
                                p={2}
                                display='flex' justifyContent='space-between'
                            >
                                <IconButton icon={<ArrowBackIcon />}
                                    onClick={() => setSelectedChat(null)}
                                />
                                <Heading size='lg'>{selectedChat.isGroupChat ? selectedChat.chatName : getOtherUser(loggedInUser, selectedChat.users).name}</Heading>
                                {
                                    selectedChat.isGroupChat
                                        ? <GroupInfoModal groupChat={selectedChat}>
                                            <IconButton icon={<InfoIcon />} />
                                        </GroupInfoModal>
                                        : <ProfileModal user={getOtherUser(loggedInUser, selectedChat.users)}>
                                            <IconButton icon={<InfoIcon />} />
                                        </ProfileModal>
                                }

                            </Box>
                            <Box
                                className='chat-box'
                                h="100%" p={3} mb={2}
                                display='flex' flexDir='column-reverse'
                                borderRadius="lg" overflowY="scroll"
                                backgroundColor='#E2E2E2'
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {
                                        messages.length > 0 &&
                                        messages.map((message, index) => (
                                            <SingleMessage key={message._id} message={message} loggedInUser={loggedInUser}
                                                isSenderLastMessage={isSenderLastMessage(messages, index, loggedInUser)}
                                            />
                                        ))
                                    }
                                    {typing && <img src={typingGIF} alt='loading' style={{ width: '80px', height: '60px', marginBottom: '-15px' }}></img>}
                                    <span ref={lastEmptyElement}></span>
                                </div>
                            </Box>
                            <form
                                onSubmit={(e) => sendMessage(e)}
                            >
                                <Input
                                    bg="#E8E8E8" placeholder='Type message here'
                                    type='text' value={newMessage} onChange={(e) => typingHandler(e.target.value)} />
                            </form>
                        </Box>
                    : <Text fontSize='3xl' margin='auto'>Select Chat</Text>
            }
        </Box>
    )
}

export default ChatBox
