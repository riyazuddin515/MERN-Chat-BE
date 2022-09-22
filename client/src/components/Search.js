import { CloseIcon } from '@chakra-ui/icons'
import { Badge, Box, FormControl, Input, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../context/ChatContext'
import UserItem from './UserItem'
let controller;

const Search = ({ searchResult, setSearchResult, selectedUsers, setSelectedUsers }) => {

    const toast = useToast()
    const { loggedInUser } = ChatState()
    const [loading, setLoading] = useState(false)

    const handleSearch = async (searchInput) => {
        if (!searchInput) {
            setSearchResult([])
            return
        }
        try {
            setLoading(true)
            if (controller) {
                controller.abort();
            }
            controller = new AbortController()
            const signal = controller.signal;
            const config = {
                signal,
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const res = await axios.get(`/users?search=${searchInput}`, config)
            setSearchResult(res.data)
        } catch (error) {
            if (error.message === "canceled") {
                return
            }
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

    const handleOnUserClick = (user) => {
        if (selectedUsers.includes(user)) {
            toast({
                title: "User already selected",
                description: "",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-center",
            });
            return
        }
        setSelectedUsers([user, ...selectedUsers])
    }

    const handleOnClose = (user) => {
        setSelectedUsers(selectedUsers.filter(each => each._id !== user._id))
    }

    return (
        <div>
            <FormControl mt={2}>
                <Input type='text' placeholder='Search Users'
                    onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            <Box display='flex' flexWrap='wrap' gap={1} mt={2} width='100%'>
                {
                    selectedUsers.map(user => (
                        <Badge
                            key={user._id}
                            backgroundColor='green'
                            color='white'
                            borderRadius='md'
                            display='flex'
                            alignItems='center'
                            gap={1}
                        >
                            <Text>{user.name}</Text>
                            <CloseIcon w={2} h={3} cursor='pointer'
                                onClick={() => handleOnClose(user)}
                            />
                        </Badge>
                    ))
                }
            </Box>
            <Box maxH='250px' overflow='scroll' mt={2}>
                {
                    loading
                        ? <p> Loading</p>
                        : searchResult.map(each => (
                            <UserItem key={each._id} user={each}
                                handleOnUserClick={() => handleOnUserClick(each)}
                            />
                        ))
                }
            </Box>
        </div>
    )
}

export default Search
