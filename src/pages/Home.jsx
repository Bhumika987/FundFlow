import { SimpleGrid, Heading, Box, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../contexts/Web3Context";
import CampaignCard from "../components/CampaignCard";
import Loader from "../components/Loader";

export default function Home() {
  const { contract } = useContext(Web3Context);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if (!contract) return;
        
        const count = await contract.campaignCount();
        const campaignArray = [];

        for (let i = 1; i <= Number(count); i++) {
          const c = await contract.campaigns(i);
          campaignArray.push({
            id: i,
            title: c.title,
            goal: c.fundingGoal,
            raised: c.amountRaised,
            deadline: Number(c.deadline)
          });
        }

        setCampaigns(campaignArray);
      } catch (error) {
        console.error("Failed to load campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [contract]);

  if (loading) return <Loader text="Loading campaigns..." />;

  return (
    <Box p={4}>
      <Heading mb={8} textAlign="center">Active Campaigns</Heading>
      
      {campaigns.length === 0 ? (
        <Text textAlign="center">No campaigns found</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {campaigns.map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}