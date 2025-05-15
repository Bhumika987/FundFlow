import { ethers } from 'ethers';
import factoryABI from '../abi/factory.json';
import campaignABI from '../abi/campaign.json';

const factoryAddress = import.meta.env.VITE_FACTORY_ADDRESS;

export class CampaignService {
  constructor(signer) {
    this.signer = signer;
    this.factory = new ethers.Contract(
      factoryAddress,
      factoryABI,
      signer
    );
  }

  async createCampaign(title, description, goal, durationDays) {
    // Create through factory
    const tx = await this.factory.createCrowdfundingCampaign();
    const receipt = await tx.wait();
    
    // Improved event parsing
    let campaignAddress;
    
    // Option 1: Using the contract interface to parse logs
    const eventInterface = new ethers.utils.Interface(factoryABI);
    for (const log of receipt.logs) {
      try {
        const parsedLog = eventInterface.parseLog(log);
  
        
        if (parsedLog.name === 'NewCrowdfundingCampaign') {
          campaignAddress = parsedLog.args.campaignAddress;
          break;
        }
      } catch (e) {
        // This log wasn't from our contract, continue checking
        continue;
      }
    }

    console.log("Step 1 Clearance: campaignAddress", campaignAddress);
    

    // Option 2: Alternative approach if Option 1 fails
    if (!campaignAddress) {
      const eventTopic = ethers.utils.id('NewCrowdfundingCampaign(uint256,address,address,uint256)');
      const eventLog = receipt.logs.find(log => 
        log.topics[0] === eventTopic
      );
      
      if (eventLog) {
        const decodedData = ethers.utils.defaultAbiCoder.decode(
          ['uint256', 'address', 'address', 'uint256'],
          eventLog.data
        );
        campaignAddress = decodedData[2]; // campaignAddress is the third argument
      }
    }
    console.log("Step 2 Clearance: campaignAddress", campaignAddress);
    

    if (!campaignAddress) {
      throw new Error('Could not find campaign address in transaction logs');
    }
    console.log("Step 3 Clearance: campaignAddress", campaignAddress);

    // Initialize the campaign
    const campaign = new ethers.Contract(
      campaignAddress,
      campaignABI,
      this.signer
    );

    console.log("Step 4 Clearance: campaign contract object", campaign);

    console.log(durationDays);
    console.log(durationDays.toString());
    console.log(ethers.utils.parseEther(durationDays.toString()));
    
    // Call createCampaign on the new contract
    const createTx = await campaign.createCampaign(
      title,
      description,
    //   ethers.utils.parseEther(goal.toString()),
    goal,
    durationDays
    );
    await createTx.wait();

    console.log("Step 5 Clearance: createTx", createTx);

    
    return campaignAddress;
  }

  async getCampaign(campaignAddress) {
    const campaign = new ethers.Contract(
      campaignAddress,
      campaignABI,
      this.signer
    );
    
    const details = await campaign.getCampaignDetails(1); // Assuming ID 1 for single campaign per contract
    
    return {
      address: campaignAddress,
      creator: details.creator,
      title: details.title,
      description: details.description,
      goal: parseFloat(ethers.utils.formatEther(details.goal)),
      deadline: new Date(details.deadline * 1000),
      totalFunded: parseFloat(ethers.utils.formatEther(details.totalFunded)),
      withdrawn: details.withdrawn
    };
  }

  async pledge(campaignAddress, amount) {
    const campaign = new ethers.Contract(
      campaignAddress,
      campaignABI,
      this.signer
    );
    
    const tx = await campaign.pledge(1, { // Assuming ID 1
      value: ethers.utils.parseEther(amount.toString())
    });
    await tx.wait();
  }

  // Add other methods like withdraw, refund as needed
}