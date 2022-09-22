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
    FormControl,
    Input,
    useToast
} from '@chakra-ui/react'
import axios from 'axios'
import { ChatState } from '../../context/ChatContext'
import Search from '../Search'

const GroupModal = ({ children }) => {

    const toast = useToast()
    const { loggedInUser, chat, setChat, setSelectedChat } = ChatState()

    const [loading, setLoading] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchResult, setSearchResult] = useState([])

    const createGroup = async () => {
        if (!groupName) {
            toast({
                title: "Group Name can't be empty.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-center",
            });
            return
        }
        if (selectedUsers.length < 1) {
            toast({
                title: "Add alteast one user.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-center",
            });
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const { data } = await axios.post('/chat/newGroup', { chatName: groupName, users: JSON.stringify(selectedUsers) }, config)
            setSelectedChat(data)
            if (!chat.find(eachChat => eachChat._id === data._id)) {
                setChat([data, ...chat])
            }
            onClose()
            toast({
                title: 'Chat Created',
                status: 'success',
                duration: 2000,
                isClosable: false,
                position: 'bottom-center'
            })
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

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={() => {
                setGroupName('')
                setSearchResult([])
                setSelectedUsers([])
                onClose()
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input type='text' placeholder='Group Name'
                                value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                        </FormControl>
                        <Search
                            searchResult={searchResult} setSearchResult={setSearchResult}
                            selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
                    </ModalBody>
                    <ModalFooter mt='-5'>
                        <Button colorScheme='green' isLoading={loading} loadingText='Creating Chat'
                            onClick={createGroup}
                        >
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupModal
