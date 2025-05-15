import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMetaMask } from '../hooks/useMetamask';
import { ethers } from 'ethers';
// import campaignABI from '../abi/Crowdfunding.json'; // You'll need this ABI
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Countdown from 'react-countdown';
import { CampaignService } from '../services/campaignService';

const CampaignsComponent = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const { wallet, hasProvider, connectMetaMask } = useMetaMask();
  const [isLoading, setIsLoading] = useState(true);
  const [isContributing, setIsContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [campaignsContract, setCampaignContract] = useState(null);

  // Mock data - replace with actual contract calls
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!address) return;
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const campaignService = new CampaignService(signer);
        console.log(address);
        
        const campaignData = await campaignService.getCampaign(address);
        console.log(campaignData);

        setCampaign(campaignData);
        console.log(campaign);
        
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast.error('Failed to load campaign data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [address]);

  
  const handleContribute = async () => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const campaignService = new CampaignService(signer);
      
      await campaignService.pledge(address, contributionAmount);
      toast.success('Contribution successful!');
      
      // Refresh campaign data
      const updatedCampaign = await campaignService.getCampaign(address);
      setCampaign(updatedCampaign);
      setContributionAmount('');
    } catch (error) {
      console.error('Error contributing:', error);
      toast.error(error.reason || error.message || 'Contribution failed');
    } finally {
      setIsLoading(false);
    }
  };
// console.log(campaign? ethers.utils.formatEther(`${campaign.goal}`): 0);
// console.log(ethers.utils.formatEther("1e-18"));
console.log(campaign ? campaign.goal/1e-18 : 0);

// console.log(campaign ? campaign.totalFunded / ethers.utils.formatEther(`${campaign.goal}`): 0);
  
  // Progress bar calculation
  const progressPercentage = campaign ? Math.min(100, (campaign.totalFunded * 1e-18 / campaign.goal) * 100) : 0;
  

  // Countdown renderer
  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className="text-red-500 font-medium">Campaign ended</span>;
    }
    return (
      <span className="text-gray-700">
        {days}d {hours}h {minutes}m {seconds}s left
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            <div className="h-6 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Campaign Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
        <div className="flex items-center space-x-4 mb-4">
          <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
            {campaign.category}
          </span>
          <span className="text-gray-600">
            Created by {campaign.creator.substring(0, 6)}...{campaign.creator.substring(38)}
          </span>
        </div>
      </div>

      {/* Campaign Image */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-8">
        <img 
          src={campaign.image} 
          alt={campaign.title} 
          className="w-full h-96 object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Campaign Description */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this project</h2>
            <p className="text-gray-700 whitespace-pre-line">{campaign.description}</p>
          </div>

          {/* Updates/Comments Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 text-sm">TM</span>
                  </div>
                  <span className="font-medium">Team Member</span>
                  <span className="text-gray-500 text-sm">2 days ago</span>
                </div>
                <p className="text-gray-700">We've reached 50% of our funding goal! Thank you to all our supporters. Here's a preview of our prototype...</p>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 text-sm">TM</span>
                  </div>
                  <span className="font-medium">Team Member</span>
                  <span className="text-gray-500 text-sm">1 week ago</span>
                </div>
                <p className="text-gray-700">Campaign launched! We're excited to share our project with the world.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Ξ{campaign.totalFunded.toString()}</h3>
                <p className="text-gray-600">raised of Ξ{campaign.goal.toLocaleString()} goal</p>
              </div>
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm">{progressPercentage.toFixed(1)}% funded</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{campaign.contributors}</h3>
                <p className="text-gray-600">contributors</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  <Countdown 
                    date={campaign.deadline} 
                    renderer={renderCountdown}
                  />
                </h3>
              </div>
            </div>

            {/* Contribution Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter amount to contribute (ETH)
                </label>
                <input
                  type="number"
                  id="amount"
                  min="0.01"
                  step="0.01"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.1"
                />
              </div>
              <button
                onClick={handleContribute}
                disabled={isContributing || !hasProvider || wallet.accounts.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
                  isContributing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : !hasProvider || wallet.accounts.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary-600 hover:bg-primary-700'
                } transition-colors`}
              >
                {isContributing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : !hasProvider ? (
                  'Install MetaMask to Contribute'
                ) : wallet.accounts.length === 0 ? (
                  'Connect Wallet to Contribute'
                ) : (
                  'Contribute Now'
                )}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Share this campaign</h3>
              <div className="flex space-x-3">
                <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-400 flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignsComponent;