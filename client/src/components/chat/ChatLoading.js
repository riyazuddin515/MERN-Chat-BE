import React from 'react'
import { Skeleton, Stack } from '@chakra-ui/react'

const ChatLoading = () => {
    return (
        <Stack>
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
            <Skeleton height='45px' borderRadius='10' />
        </Stack>
    )
}

export default ChatLoading