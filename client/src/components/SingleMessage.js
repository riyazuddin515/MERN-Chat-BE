import { Avatar } from '@chakra-ui/react'
import React from 'react'

const SingleMessage = ({ message, loggedInUser, isSenderLastMessage }) => {
    return (
        <div style={{
            marginBottom: `${isSenderLastMessage ? '5px' : '1px'}`,
            marginLeft: `${isSenderLastMessage ? '0px' : '38px'}`,
            marginTop: '2px',
            display: 'flex',
            justifyContent: `${message.sender._id === loggedInUser._id ? 'flex-end' : 'flex-start'}`,
            alignItems: 'center',
            gap: '5px'
        }}
        >
            {
                isSenderLastMessage &&
                <Avatar src={message.sender.profilePic} name={message.sender.name} size='sm' />
            }
            <span style={{
                padding: '10px',
                backgroundColor: `${message.sender._id === loggedInUser._id ? 'green' : 'white'}`,
                color: `${message.sender._id === loggedInUser._id ? 'white' : 'balck'}`,
                borderRadius: '5px',
                maxWidth: '75%'
            }}>{message.content}</span>
        </div>
    )
}

export default SingleMessage