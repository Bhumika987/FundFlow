import { useState, useEffect } from 'react';
import { useMetaMask } from '../hooks/useMetamask';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CampaignService } from '../services/campaignService';
import { FiSearch, FiFilter, FiArrowUp, FiArrowDown, FiClock, FiTrendingUp } from 'react-icons/fi';

const CampaignsListComponent = () => {
  const { wallet, hasProvider, connectMetaMask } = useMetaMask();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 9;

  const categories = [
    'all',
    'technology',
    'art',
    'environment',
    'education',
    'health',
    'community'
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'successful', label: 'Successful' },
    { value: 'ended', label: 'Ended' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: <FiArrowDown /> },
    { value: 'oldest', label: 'Oldest', icon: <FiArrowUp /> },
    { value: 'most_funded', label: 'Most Funded', icon: <FiTrendingUp /> },
    { value: 'ending_soon', label: 'Ending Soon', icon: <FiClock /> }
  ];

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const campaignService = new CampaignService(signer);

        
        
        // In a real app, you would fetch from your factory contract
        // const campaignAddresses = await campaignService.getCampaign(signer._address);
        // const campaignData = await Promise.all(campaignAddresses.map(addr => campaignService.getCampaign(addr)));
        
        // Mock data for demonstration
        const mockCampaigns = [
          {
            id: 1,
            address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            title: "Ocean Cleanup Initiative",
            description: "Help us remove plastic waste from the Pacific Ocean with our innovative cleanup technology.",
            category: "environment",
            goal: 50,
            raised: 28.5,
            deadline: Date.now() + 86400000 * 7, // 7 days from now
            contributors: 142,
            image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          },
          // Add more mock campaigns...
        ];

        setCampaigns(mockCampaigns);
        setFilteredCampaigns(mockCampaigns);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (hasProvider) {
      fetchCampaigns();
    }
  }, [hasProvider]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...campaigns];

    // Search filter
    if (searchTerm) {
      result = result.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(campaign => campaign.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const now = Date.now();
      result = result.filter(campaign => {
        if (statusFilter === 'active') return campaign.deadline > now && campaign.raised < campaign.goal;
        if (statusFilter === 'successful') return campaign.deadline > now && campaign.raised >= campaign.goal;
        if (statusFilter === 'ended') return campaign.deadline <= now;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      const now = Date.now();
      
      switch (sortBy) {
        case 'newest':
          return b.created - a.created;
        case 'oldest':
          return a.created - b.created;
        case 'most_funded':
          return b.raised - a.raised;
        case 'ending_soon':
          return (a.deadline - now) - (b.deadline - now);
        default:
          return 0;
      }
    });

    setFilteredCampaigns(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [campaigns, searchTerm, categoryFilter, statusFilter, sortBy]);

  // Pagination
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  // Calculate time remaining
  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const endDate = new Date(deadline);
    const diff = endDate - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  // Calculate progress percentage
  const getProgressPercentage = (raised, goal) => {
    return Math.min(100, (raised / goal) * 100);
  };

  if (!hasProvider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">MetaMask Required</h2>
          <p className="text-gray-600 mb-6">
            Please install MetaMask to view and participate in campaigns.
          </p>
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Campaigns</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Campaigns</h1>
          <p className="text-gray-600 mb-8">
            Discover and support innovative projects on the blockchain
          </p>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search Input */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="flex-shrink-0">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-lg"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex-shrink-0">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-lg"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex-shrink-0">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-lg"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <AnimatePresence>
                {currentCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/campaign/${campaign.address}`}>
                      <div className="h-48 overflow-hidden">
                        <img
                          src={campaign.image}
                          alt={campaign.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{campaign.title}</h3>
                          <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                            {campaign.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Raised</span>
                            <span>Ξ{campaign.raised.toLocaleString()} of Ξ{campaign.goal.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{campaign.contributors} supporters</span>
                          <span className="font-medium">{getTimeRemaining(campaign.deadline)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
                        currentPage === page 
                          ? 'bg-primary-600 text-white border-primary-600' 
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignsListComponent;