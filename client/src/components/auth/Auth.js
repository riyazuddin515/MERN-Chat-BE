import React from 'react'
import { Container, Text, VStack } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import SignupORLogin from './SignupORLogin'

const Auth = () => {

    return (
        <VStack>
            <Container mt='15px'>
                <Text fontSize='4xl' bgColor='white' mb='15px' textAlign='center' borderRadius='20px'>MERN Chat</Text>
                <Tabs variant='soft-rounded' colorScheme='green' bgColor='white' borderRadius='20' pt='15' align='center'>
                    <TabList>
                        <Tab width='45%'>Login</Tab>
                        <Tab width='45%'>Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <SignupORLogin />
                        </TabPanel>
                        <TabPanel>
                            <SignupORLogin isSignup={true} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Container>
        </VStack>
    )
}

export default Auth