import { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/config";
import FundFlowABI from "../contracts/FundFlow.json";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize provider and contract
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 1. Set up provider
      let web3Provider;
      if (window.ethereum) {
        web3Provider = new ethers.BrowserProvider(window.ethereum); // Updated for ethers v6
        const network = await web3Provider.getNetwork();
        
        // Check network (Sepolia example)
        if (network.chainId !== 11155111n) { // Note the 'n' for BigInt
          setError("Please connect to Sepolia network (Chain ID: 11155111)");
          return;
        }
      } else {
        setError("MetaMask not detected");
        setIsLoading(false);
        return;
      }

      setProvider(web3Provider);

      // 2. Initialize contract
      const signer = await web3Provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        FundFlowABI.abi,
        signer
      );
      setContract(contractInstance);

      // 3. Get accounts if already connected
      const accounts = await window.ethereum.request({ 
        method: "eth_accounts" 
      });
      if (accounts.length > 0) setAccount(accounts[0]);

    } catch (err) {
      setError(`Initialization failed: ${err.message}`);
      console.error("Web3 initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Please install MetaMask");
        return;
      }
      
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      setAccount(accounts[0]);
      await initialize();
    } catch (err) {
      setError(`Connection failed: ${err.message}`);
      console.error("Wallet connection error:", err);
    }
  };

  // Handle chain/account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || "");
      if (accounts[0]) initialize();
    };

    const handleChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [initialize]);

  // Initial load
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Web3Context.Provider
      value={{
        account,
        contract,
        provider,
        connectWallet,
        isLoading,
        error,
        clearError: () => setError(null)
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};