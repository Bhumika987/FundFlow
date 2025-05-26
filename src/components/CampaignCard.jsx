import { Box, Progress, Button, Heading, Text, Badge } from "@chakra-ui/react";
import { Web3Context } from "../contexts/Web3Context";
import { formatETH } from "../utils/helpers";

export default function CampaignCard({ campaign }) {
  const { contract, account } = useContext(Web3Context);
  const [isContributing, setIsContributing] = useState(false);

  const progress = (campaign.amountRaised / campaign.fundingGoal) * 100;
  const daysLeft = Math.max(0, Math.ceil((campaign.deadline - Date.now()/1000) / 86400));

  const handleContribute = async () => {
    setIsContributing(true);
    try {
      const amount = prompt("Enter ETH amount to contribute:");
      if (amount) {
        await contract.contribute(campaign.id, { 
          value: ethers.utils.parseEther(amount) 
        });
      }
    } finally {
      setIsContributing(false);
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
      <Heading size="md">{campaign.title}</Heading>
      <Text mt={2}>{campaign.description}</Text>
      
      <Progress 
        value={progress} 
        size="lg" 
        colorScheme={progress >= 100 ? "green" : "blue"} 
        my={3}
      />
      
      <Flex justify="space-between">
        <Text>
          <strong>{formatETH(campaign.amountRaised)} ETH</strong> raised of {formatETH(campaign.fundingGoal)} ETH
        </Text>
        <Badge colorScheme={daysLeft > 3 ? "green" : "red"}>
          {daysLeft}d left
        </Badge>
      </Flex>

      <Button
        mt={3}
        colorScheme="blue"
        onClick={handleContribute}
        isLoading={isContributing}
        isDisabled={!account || daysLeft <= 0}
        w="full"
      >
        {daysLeft <= 0 ? "Expired" : "Contribute"}
      </Button>
    </Box>
  );
}