import React, { useState } from 'react'
import { FormControl, FormLabel, Input, useToast } from '@chakra-ui/react'
import { VStack, Button } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ChatState } from '../../context/ChatContext'

const Signup = ({ isSignup }) => {

    const toast = useToast()
    const navigate = useNavigate()

    const { setLoggedInUser } = ChatState()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleForm = (e) => {
        e.preventDefault()
        if (isSignup && (!name || !email || !password || !confirmPassword)) {
            toast({
                title: 'Error',
                description: 'All fields are required.',
                status: 'error',
                duration: 2000,
                isClosable: true
            })
            return;
        }
        if (!email || !password) {
            toast({
                title: 'Error',
                description: 'All fields are required.',
                status: 'error',
                duration: 2000,
                isClosable: true
            })
            return;
        }
        if (isSignup && password !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Password did not matched.',
                status: 'error',
                duration: 2000,
                isClosable: true
            })
            return;
        }
        auth()
    }

    const auth = async () => {
        try {
            setLoading(true)
            let res;
            if (isSignup) {
                res = await axios.post('/auth/signup', { "name": name, "email": email, "password": password })
                toast({
                    title: 'Success',
                    description: 'Account created.',
                    status: 'success',
                    duration: 2000,
                    isClosable: false
                })
            } else {
                res = await axios.post('/auth/login', { "email": email, "password": password })
                toast({
                    title: 'Success',
                    description: 'Logged in.',
                    status: 'success',
                    duration: 2000,
                    isClosable: false
                })
            }
            setLoggedInUser(res.data)
            navigate('/', { replace: true })
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data,
                status: 'error',
                duration: 2000,
                isClosable: false
            })
        }
        setLoading(false)
    }

    return (
        <VStack spacing='20px' mt='10px'>
            {
                isSignup &&
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type='text' onChange={(e) => setName(e.target.value)} />
                </FormControl>
            }
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            {
                isSignup &&
                <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type='password' onChange={(e) => setConfirmPassword(e.target.value)} />
                </FormControl>
            }
            <FormControl>
                <Button mt='10px' colorScheme='green' color='white' type='submit' width='100%'
                    onClick={(e) => handleForm(e)} isLoading={loading}>{isSignup ? 'Signup' : 'Login'}</Button>
                {
                    !isSignup &&
                    <Button mt='10px' colorScheme='red' color='white' type='submit' width='100%'
                        onClick={() => {
                            setEmail('Guest@gmail.com')
                            setPassword('123456')
                        }} isLoading={loading}>Get Guest Credentials</Button>
                }
            </FormControl>
        </VStack>
    )
}

export default Signup