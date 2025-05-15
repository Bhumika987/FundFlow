import { useState, useEffect, useContext, createContext } from 'react';

// Create a context
const MetaMaskContext = createContext();

export const MetaMaskProvider = ({ children }) => {
  const [wallet, setWallet] = useState({ accounts: [] });
  const hasProvider = typeof window !== 'undefined' && window.ethereum !== undefined;

  const updateWallet = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    setWallet({ accounts });
  };

  useEffect(() => {
    if (hasProvider) {
      updateWallet();
      window.ethereum.on('accountsChanged', updateWallet);
      return () => {
        window.ethereum.removeListener('accountsChanged', updateWallet);
      };
    }
  }, [hasProvider]);

  const connectMetaMask = async () => {
    if (hasProvider) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      updateWallet();
    }
  };
  const disconnectMetaMask = async () => {
    // Note: There's no direct way to disconnect programmatically in MetaMask
    // This just resets the local state
    setWallet({ accounts: [] });
    
    // Alternative: Ask user to disconnect in MetaMask UI
    try {
      // This will trigger the accountsChanged event with empty array
      // await window.ethereum.request({
      //   method: 'wallet_requestPermissions',
      //   params: [{ eth_accounts: {} }]
      // });
    } catch (error) {
      // User likely rejected the permission change
      console.log("MetaMask disconnect:", error);
    }
  };

  const value = {
    wallet,
    hasProvider,
    connectMetaMask,
    disconnectMetaMask
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
};