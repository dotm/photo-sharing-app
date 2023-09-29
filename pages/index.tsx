import {
  Box,
  ChakraProvider,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

// Dummy user data for demonstration purposes
const users = [
  'User 1',
  'User 2',
  'User 3',
  'User 4',
  'User 5',
  'User 6',
  // Add more users as needed
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ChakraProvider>
      <Box p={4}>
        <Stack direction="column" align="center">
          <Input
            type="text"
            placeholder="Search for a user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <VStack align="left" spacing={2} mt={4}>
            {filteredUsers.length === 0 ? (
              <Text>No users found</Text>
            ) : (
              filteredUsers.map((user, index) => (
                <Text key={index}>{user}</Text>
              ))
            )}
          </VStack>
        </Stack>
      </Box>
    </ChakraProvider>
  );
}
