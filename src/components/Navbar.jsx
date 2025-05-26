import { Flex, Button, Text, Spacer, Link } from "@chakra-ui/react";
import { Web3Context } from "../contexts/Web3Context";

export default function Navbar() {
  const { account, connectWallet, isLoading } = useContext(Web3Context);

  return (
    <Flex p={4} bg="gray.100" alignItems="center">
      <Link href="/" fontWeight="bold">FundFlow</Link>
      <Spacer />
      {isLoading ? (
        <Button isLoading colorScheme="blue" />
      ) : (
        <Button 
          onClick={connectWallet}
          colorScheme={account ? "green" : "blue"}
        >
          {account ? (
            <Text as="span" fontFamily="monospace">
              {`${account.slice(0, 6)}...${account.slice(-4)}`}
            </Text>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      )}
    </Flex>
  );
}