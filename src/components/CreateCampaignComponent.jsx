import { useState } from 'react';
import { useMetaMask } from '../hooks/useMetamask';
import { ethers } from 'ethers';
import factoryABI from '../abi/factory.json';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CampaignService } from '../services/campaignService';

const CreateCampaignComponent = () => {
  const { wallet, hasProvider } = useMetaMask();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    deadline: '',
    category: 'technology'
  });

  // Contract address and ABI
  const factoryAddress = import.meta.env.VITE_FACTORY_ADDRESS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

//  Function: Calculates number of days from date
  const calculateNoOfDays = (date) => {
    const currentDate = new Date()
    return formData.deadline.split("-")[2] - parseInt(currentDate.toString().split(" ")[2])
    
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasProvider || wallet.accounts.length === 0) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      console.log(formData.deadline);
      console.log(parseInt(formData.deadline.split("-")[2]));
      let durationDays = calculateNoOfDays(formData.deadline)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      
      
      const campaignService = new CampaignService(signer);
      console.log(formData.deadline);
      
      const campaignAddress = await campaignService.createCampaign(
        formData.title,
        formData.description,
        formData.goalAmount,
        durationDays
        // 5 // Default Value
      );
      
      toast.success(`Campaign created at ${campaignAddress}`);
      navigate(`/campaign/${campaignAddress}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.reason || error.message || 'Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto px-4 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Campaign</h1>
        <p className="text-gray-600 mb-8">
          Launch your crowdfunding campaign on the blockchain. Fill out the details below to get started.
        </p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit}
        variants={containerVariants}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        {/* Form fields remain the same as before */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g. Save the Ocean Cleanup"
            required
          />
        </motion.div>
        <motion.div className="mb-6" variants={itemVariants}>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g. Save the Ocean Cleanup"
            required
          />
        </motion.div>

        <motion.div className="mb-6" variants={itemVariants}>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Tell people about your project and why it matters..."
            required
          />
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" variants={itemVariants}>
          <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Funding Goal (ETH) *
            </label>
            <input
            //   type="number"
              id="goalAmount"
              name="goalAmount"
              value={formData.goalAmount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. 10"
              required
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Deadline *
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </motion.div>

        <motion.div className="mb-8" variants={itemVariants}>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="technology">Technology</option>
            <option value="art">Art</option>
            <option value="environment">Environment</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="community">Community</option>
          </select>
        </motion.div>


        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={isLoading || !hasProvider || wallet.accounts.length === 0}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : !hasProvider || wallet.accounts.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700'
            } transition-colors`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : !hasProvider ? (
              'Install MetaMask to Continue'
            ) : wallet.accounts.length === 0 ? (
              'Connect Wallet to Continue'
            ) : (
              'Launch Campaign'
            )}
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default CreateCampaignComponent;