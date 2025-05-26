import { Spinner, Center, Box } from "@chakra-ui/react";

export default function Loader({ text = "Loading..." }) {
  return (
    <Center h="200px">
      <Box textAlign="center">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text mt={4}>{text}</Text>
      </Box>
    </Center>
  );
}