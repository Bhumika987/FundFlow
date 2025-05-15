import { useState, useEffect } from 'react';
import { useMetaMask } from './hooks/useMetamask';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  const { wallet, hasProvider, connectMetaMask, disconnectMetaMask } = useMetaMask();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.navbar-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Format wallet address
  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'}`}>
      <div className="navbar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                //src="/logo.png" // Replace with your logo
                //alt="Fund Flow"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">Fund Flow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium">
              Home
            </Link>
            <Link to="/campaigns" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium">
              Campaigns
            </Link>
            <Link to="/create-campaign" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium">
              Create
            </Link>
            
            {/* Wallet Connection */}
            {hasProvider ? (
              wallet.accounts.length > 0 ? (
                <div className="relative group">
                  <p className="flex items-center cursor-pointer space-x-2 bg-primary-100 hover:bg-primary-200 rounded-full px-4 py-2 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-800 font-medium">
                      {formatAddress(wallet.accounts[0])}
                    
                    </span>
                    <button onClick={() => disconnectMetaMask()} className='text-red-800 border border-1 border-red-800 hover:bg-red-100 hover-border-red-100 p-1 rounded-xl '>Disconnect</button>
                  </p>
                  
                  {/* Dropdown */}
                  {/* <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                    <button
                      onClick={disconnectMetaMask}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Disconnect Wallet
                    </button>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                  </div> */}
                </div>
              ) : (
                <button
                  onClick={connectMetaMask}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Connect Wallet
                </button>
              )
            ) : (
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Install MetaMask
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {hasProvider && wallet.accounts.length > 0 && (
              <div className="mr-4 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-800 font-medium">
                  {formatAddress(wallet.accounts[0])}
                </span>
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/campaigns"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Campaigns
              </Link>
              <Link
                to="/create"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Campaign
              </Link>
              
              {hasProvider ? (
                wallet.accounts.length > 0 ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        disconnectMetaMask();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    >
                      Disconnect Wallet
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      connectMetaMask();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-50"
                  >
                    Connect Wallet
                  </button>
                )
              ) : (
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-50"
                >
                  Install MetaMask
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarComponent;