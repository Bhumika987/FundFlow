import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { Web3Context } from "../contexts/Web3Context";
import { parseETH } from "../utils/helpers";

export default function ContributeModal({ isOpen, onClose, campaignId }) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { contract } = useContext(Web3Context);
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await contract.contribute(campaignId, { 
        value: parseETH(amount) 
      });
      toast({
        title: "Success!",
        description: "Your contribution was submitted",
        status: "success"
      });
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contribute to Campaign</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>ETH Amount</FormLabel>
            <Input
              type="number"
              placeholder="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={isLoading}
            isDisabled={!amount}
          >
            Contribute
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}