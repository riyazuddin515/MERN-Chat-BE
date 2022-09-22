import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    AvatarGroup,
    Avatar,
    WrapItem,
    Heading,
    useToast,
} from '@chakra-ui/react'
import Search from '../Search'
import axios from 'axios'
import { ChatState } from '../../context/ChatContext'

const GroupInfoModal = ({ groupChat, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { loggedInUser, setSelectedChat, setChat } = ChatState()
    const toast = useToast()

    const [loading, setLoading] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [addMembers, setAddMembers] = useState(false)

    const handleCancelAdding = () => {
        setAddMembers(false)
        setSelectedUsers([])
        setSearchResult([])
    }

    const handleAdd = async () => {
        if (selectedUsers.length < 1) {
            toast({
                title: "Add alteast one user.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-center",
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const { data } = await axios.post('/chat/addMembers', { chatId: groupChat._id, users: JSON.stringify(selectedUsers) }, config)
            toast({
                title: "Members Added",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom-center",
            });
            setSelectedChat(data)
            setChat((pre) => [data, ...(pre.filter(e => e._id !== data._id))])
            handleCancelAdding()
        } catch (error) {
            console.log(error)
            toast({
                title: "Error Occured!",
                description: error.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left",
            });
        }
        setLoading(false)
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={() => {
                handleCancelAdding()
                onClose()
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{groupChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {!addMembers ?
                            <>
                                <WrapItem display='flex' justifyContent='center'>
                                    <Avatar name={groupChat.chatName} src='' size='2xl' />
                                </WrapItem>
                                <AvatarGroup size='md' max={10} mt={3}>
                                    {
                                        groupChat.users.map(user => {
                                            return <Avatar key={user._id} name={user.name} src={user.profilePic} />
                                        })
                                    }
                                </AvatarGroup>
                            </>
                            : <>
                                <Heading fontSize='lg'>Add Members</Heading>
                                <Search
                                    searchResult={searchResult} setSearchResult={setSearchResult}
                                    selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
                            </>
                        }
                    </ModalBody>

                    <ModalFooter>
                        {
                            addMembers ?
                                <>
                                    {
                                        !loading &&
                                        <Button colorScheme='red' mr={3} onClick={handleCancelAdding}>
                                            Cancel Adding
                                        </Button>
                                    }
                                    <Button colorScheme='green' mr={3} onClick={handleAdd}
                                        isLoading={loading} loadingText='Adding Members'>
                                        Add
                                    </Button>
                                </>
                                : <>
                                    <Button colorScheme='green' mr={3} onClick={() => setAddMembers(true)}>
                                        Add Memebers
                                    </Button>
                                </>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupInfoModal
