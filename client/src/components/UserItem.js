import { Box, Avatar, Text } from '@chakra-ui/react'
import React from 'react'

const UserItem = ({ user, handleOnUserClick }) => {
    return (
        <Box
            width='100%' display='flex'
            alignItems='center' cursor='pointer'
            backgroundColor='#E8E8E8'
            _hover={{
                backgroundColor: 'green',
                color: 'white'
            }}
            mb={2} p={2} borderRadius='10'
            onClick={() => handleOnUserClick(user._id)}>
            <Avatar src={user.profilePic} name={user.name} size='sm' />
            <Box ml={2}>
                <Text><b>{user.name}</b></Text>
                <Text fontSize='xs'><b>Email: </b> {user.email}</Text>
            </Box>
        </Box>
    )
}

export default UserItem