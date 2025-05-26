import { Box, Heading, Tabs, TabList, Tab, TabPanels, TabPanel, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../contexts/Web3Context";
import CampaignCard from "../components/CampaignCard";

export default function Profile() {
  const { account, contract } = useContext(Web3Context);
  const [created, setCreated] = useState([]);
  const [supported, setSupported] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!contract || !account) return;
        
        // Get created campaigns
        const count = await contract.campaignCount();
        const userCampaigns = [];
        
        for (let i = 1; i <= Number(count); i++) {
          const c = await contract.campaigns(i);
          if (c.creator.toLowerCase() === account.toLowerCase()) {
            userCampaigns.push({ ...c, id: i });
          }
        }
        
        setCreated(userCampaigns);
        setSupported([]); // Replace with actual supported campaigns logic
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account, contract]);

  if (!account) return <Box textAlign="center">Connect your wallet</Box>;

  return (
    <Box p={4}>
      <Heading mb={8}>Your Profile</Heading>
      
      <Tabs>
        <TabList>
          <Tab>Created ({created.length})</Tab>
          <Tab>Supported ({supported.length})</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {created.length > 0 ? (
              <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                {created.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={{ 
                      id: campaign.id,
                      title: campaign.title,
                      goal: campaign.fundingGoal,
                      raised: campaign.amountRaised,
                      deadline: Number(campaign.deadline)
                    }} 
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Text>No campaigns created</Text>
            )}
          </TabPanel>
          
          <TabPanel>
            {supported.length > 0 ? (
              <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                {supported.map(campaign => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </SimpleGrid>
            ) : (
              <Text>No supported campaigns</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}