import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMetaMask } from '../hooks/useMetamask.jsx';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import factoryABI from '../abi/factory.json';



const HomeComponent = () => {
  const { wallet, hasProvider, connectMetaMask } = useMetaMask();
  const [campaignCount, setCampaignCount] = useState(0);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);

  const factoryAddress = import.meta.env.VITE_FACTORY_ADDRESS

  const fetchCampaigns = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Get factory instance
    const factory = new ethers.Contract(
      factoryAddress,
      factoryABI,
      signer
    );
    
    // Get all campaigns from factory
    const campaignAddresses = await factory.getAllCampaigns();
    
    // Get details for each campaign
    const campaignService = new CampaignService(signer);
    const campaignDetails = await Promise.all(
      campaignAddresses.map(addr => campaignService.getCampaign(addr))
    );
    
    setCampaigns(campaignDetails);
  };
  
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Mock data for campaigns (would be replaced with actual contract calls)
  useEffect(() => {
    const mockCampaigns = [
      {
        id: 1,
        title: "Save the Ocean Cleanup",
        description: "Funding for our next generation ocean cleaning technology to remove plastic waste.",
        category: "Environment",
        raised: 12500,
        goal: 50000,
        image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      },
      {
        id: 2,
        title: "Community Solar Project",
        description: "Bringing renewable energy to our local neighborhood with shared solar panels.",
        category: "Energy",
        raised: 32000,
        goal: 75000,
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      },
      {
        id: 3,
        title: "Blockchain Education Hub",
        description: "Creating free educational resources about blockchain technology for underserved communities.",
        category: "Education",
        raised: 8500,
        goal: 30000,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      }
    ];

    setFeaturedCampaigns(mockCampaigns);
    setCampaignCount(42); // Mock count
    setLoading(false);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.section 
        className="text-center py-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          variants={itemVariants}
        >
          Fund the Future with <span className="text-primary-600">Fund Flow</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
          variants={itemVariants}
        >
          A decentralized crowdfunding platform powered by blockchain technology. Support innovative projects or launch your own with complete transparency.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          variants={itemVariants}
        >
          {hasProvider ? (
            wallet.accounts.length > 0 ? (
                <Link 
                to="/create-campaign"
                className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >   Create Campaign
              </Link>
            ) : (
              <button 
                onClick={connectMetaMask}
                className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Connect Wallet
              </button>
            )
          ) : (
            <a 
              href="https://metamask.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Install MetaMask
            </a>
          )}
          <button className="px-8 py-3 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors">
            Explore Campaigns
          </button>
        </motion.div>

        <motion.div 
          className="mt-16 flex justify-center"
          variants={itemVariants}
        >
          <div className="relative w-full max-w-4xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl blur opacity-75 animate-pulse-slow"></div>
            <div className="relative bg-white rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Blockchain crowdfunding" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">Transparent Funding on the Blockchain</h3>
                <p className="mt-2 text-gray-600">Every transaction is recorded on-chain for complete transparency and trust.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-4xl font-bold text-primary-600">{campaignCount}+</h3>
              <p className="mt-2 text-gray-600">Campaigns Launched</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-primary-600">$250K+</h3>
              <p className="mt-2 text-gray-600">Total Funds Raised</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-primary-600">98%</h3>
              <p className="mt-2 text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Campaigns */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Campaigns</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Discover innovative projects changing the world</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCampaigns.map((campaign) => (
              <motion.div 
                key={campaign.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={campaign.image} 
                    alt={campaign.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {campaign.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Raised</span>
                      <span>${campaign.raised.toLocaleString()} of ${campaign.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    View Campaign
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How Fund Flow Works</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Simple steps to create or support campaigns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-primary-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Create or Discover</h3>
            <p className="text-gray-600">Launch your own campaign or browse existing projects to support.</p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-primary-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Fund Securely</h3>
            <p className="text-gray-600">Contribute using cryptocurrency with smart contract security.</p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-primary-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
            <p className="text-gray-600">Monitor campaign milestones and fund usage transparently.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 text-center bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 opacity-90">Join the decentralized crowdfunding revolution today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Start a Campaign
            </button>
            <button className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomeComponent;