import { Avatar, Box, Button, Divider, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, WrapItem } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../context/ChatContext'
import { storage } from '../utils/FirebaseSetup'
import {
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";
import ImageResizer from '../utils/ImageResizer'

const ProfileModal = ({ user, isLoggedInUserProfile, children }) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { loggedInUser, setLoggedInUser } = ChatState()

    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState("")
    const [name, setName] = useState(user.name)

    const handleImageSelect = async (e) => {
        const file = await ImageResizer(e.target.files[0])
        setImage(file)
    }

    const handleRemoveProfilePic = () => {
        setImage('')
        handleProfileInfoUpdate()
    }

    const handleUploadImage = async () => {
        const storageRef = ref(storage, `/images/${loggedInUser._id}`);
        setLoading(true)
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    handleProfileInfoUpdate(url)
                });
            }
        );
    }

    const handleProfileInfoUpdate = async (url) => {
        try {
            if (!loading) {
                setLoading(true)
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const update = {
                name: name,
                profilePic: url
            }
            const res = await axios.put('/users/update', update, config)
            setLoggedInUser(res.data)
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error Occured',
                description: error.response.data,
                status: 'error',
                duration: 2000,
                isClosable: false,
                position: 'center'
            })
        }
        setLoading(false)
        setImage('')
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={() => {
                setName(() => isLoggedInUserProfile ? loggedInUser.name : user.name)
                onClose()
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isLoggedInUserProfile ? 'My Profile' : `${user.name} Profile`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDir='column' alignItems='center' gap={2}>
                        {
                            <>
                                <WrapItem>
                                    <Avatar name={user.name} src={user.profilePic} size='2xl' />
                                </WrapItem>
                                {
                                    isLoggedInUserProfile &&
                                    <Box width='100%' display='flex' alignItems='center' justifyContent='center'>
                                        {
                                            user.profilePic.length !== 0 &&
                                            <Button colorScheme='red' variant='ghost' mr={3} onClick={handleRemoveProfilePic}>
                                                Remove Image
                                            </Button>
                                        }
                                        <label htmlFor='image-input' style={{ fontWeight: 'bold', cursor: 'pointer' }}>Choose Image</label>
                                        <input type='file' id='image-input' style={{ display: 'none' }}
                                            onChange={(e) => handleImageSelect(e)}
                                        />
                                        {
                                            image &&
                                            <Button colorScheme='green' variant='ghost' ml={3} onClick={handleUploadImage}
                                                isLoading={loading} loadingText='Uploading'>
                                                Upload Image
                                            </Button>
                                        }
                                    </Box>
                                }
                                <Divider orientation='horizontal' />
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input type='text' value={name} disabled={!isLoggedInUserProfile}
                                        onChange={(e) => setName(e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input type='email' value={user.email} disabled />
                                </FormControl>
                            </>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {
                            isLoggedInUserProfile &&
                            <Button colorScheme='green' marginLeft='auto' disabled={name === user.name ? true : false}
                                onClick={handleProfileInfoUpdate}>
                                Update Profile
                            </Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
