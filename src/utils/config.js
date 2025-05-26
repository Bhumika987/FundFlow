/**
 * FundFlow DApp Configuration Module
 * @module config
 * @description Centralized configuration for contract address and UI settings
 */

// --- Environment Validation ---
const validateContractAddress = () => {
  const address = import.meta.env.VITE_CONTRACT_ADDRESS?.trim();
  
  if (!address) {
    const errorMessage = 'Missing required environment variable: VITE_CONTRACT_ADDRESS';
    if (import.meta.env.MODE === 'production') {
      throw new Error(errorMessage);
    }
    console.error(errorMessage);
    return null;
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    const warnMessage = `Invalid contract address format: ${address}`;
    if (import.meta.env.MODE === 'production') {
      throw new Error(warnMessage);
    }
    console.warn(warnMessage);
  }

  return address;
};

// --- Network Configuration ---
export const NETWORK_CONFIG = {
  name: "Sepolia",
  chainId: 11155111,
  explorer: "https://sepolia.etherscan.io"
};

// --- Contract Configuration ---
export const CONTRACT_ADDRESS = validateContractAddress();

// --- UI Configuration ---
export const UI_CONFIG = {
  currencySymbol: "ETH",
  decimals: 4,
  dateFormat: "MMM d, yyyy",
  maxDisplayDecimals: 6
};

// --- Helper Functions ---
export const formatAddress = (address, start = 6, end = 4) => {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const formatBalance = (balance, decimals = UI_CONFIG.decimals) => {
  return parseFloat(balance).toFixed(decimals);
};

// --- Configuration Export ---
export default {
  network: NETWORK_CONFIG,
  contractAddress: CONTRACT_ADDRESS,
  ui: UI_CONFIG,
  formatAddress,
  formatBalance,
  isProduction: import.meta.env.MODE === 'production'
};