import { Box, Heading, Text, Progress, Button, Badge } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../contexts/Web3Context";
import { formatEther, parseEther } from "ethers";  // New way
import ContributeModal from "../components/ContributeModal";

export default function Campaign({ id }) {
  const { contract, account } = useContext(Web3Context);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const c = await contract.campaigns(id);
        setCampaign({
          title: c.title,
          description: c.description,
          goal: c.fundingGoal,
          raised: c.amountRaised,
          deadline: Number(c.deadline),
          creator: c.creator
        });
      } catch (error) {
        console.error("Failed to load campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, contract]);

  if (loading) return <Loader />;
  if (!campaign) return <Text>Campaign not found</Text>;

  const progress = (Number(formatEther(campaign.raised)) / Number(formatEther(campaign.goal)) * 100);
  const isExpired = campaign.deadline <= Math.floor(Date.now() / 1000);

  return (
    <Box maxW="800px" mx="auto" p={4}>
      <Heading mb={4}>{campaign.title}</Heading>
      <Badge colorScheme={isExpired ? "red" : "green"} mb={4}>
        {isExpired ? "Ended" : "Active"}
      </Badge>

      <Text mb={6}>{campaign.description}</Text>

      <Progress value={progress} size="lg" mb={2} />
      <Text mb={6}>
        {formatEther(campaign.raised)} ETH / {formatEther(campaign.goal)} ETH ({Math.round(progress)}%)
      </Text>

      {!isExpired && (
        <Button 
          colorScheme="blue" 
          onClick={() => setIsOpen(true)}
          isDisabled={!account}
          mb={6}
        >
          Contribute
        </Button>
      )}

      <ContributeModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        campaignId={id}
      />
    </Box>
  );
}