import { Button, useToast } from "@chakra-ui/react";
import { Web3Context } from "../contexts/Web3Context";

export default function MetaMaskBtn() {
  const toast = useToast();
  const { account, connectWallet, error } = useContext(Web3Context);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error]);

  return (
    <Button
      onClick={connectWallet}
      colorScheme={account ? "green" : "blue"}
      variant={account ? "outline" : "solid"}
    >
      {account ? "Connected" : "Connect MetaMask"}
    </Button>
  );
}