import { ethers } from "ethers";

// Format wei to ETH (with optional decimal places)
export const formatETH = (wei, decimals = 2) => {
  if (!wei) return "0";
  return parseFloat(ethers.utils.formatEther(wei)).toFixed(decimals);
};

// Convert ETH input to wei (handles string/number inputs)
export const parseETH = (eth) => {
  try {
    return ethers.utils.parseEther(eth.toString());
  } catch (error) {
    console.error("Failed to parse ETH:", error);
    return ethers.constants.Zero;
  }
};

// Format timestamp to readable date
export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

// Calculate days remaining (returns string)
export const daysLeft = (deadline) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = deadline - now;
  if (diff <= 0) return "Ended";
  
  const days = Math.ceil(diff / (60 * 60 * 24));
  return `${days} day${days !== 1 ? 's' : ''} left`;
};

// Shorten Ethereum address
export const shortenAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Calculate funding progress percentage
export const calculateProgress = (raised, goal) => {
  if (!raised || !goal) return 0;
  const raisedNum = Number(ethers.utils.formatEther(raised));
  const goalNum = Number(ethers.utils.formatEther(goal));
  return Math.min(Math.round((raisedNum / goalNum) * 100), 100);
};

// Validate ETH amount input
export const validateETH = (value) => {
  if (!value) return false;
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

// Format contract error messages
export const formatError = (error) => {
  if (error.message.includes("user rejected transaction")) {
    return "Transaction was canceled";
  }
  if (error.message.includes("insufficient funds")) {
    return "Insufficient balance";
  }
  if (error.message.includes("execution reverted")) {
    return error.message.split("execution reverted:")[1]?.trim() || "Transaction failed";
  }
  return error.message;
};

// Convert BigNumber to number safely
export const toNumber = (bigNumber) => {
  try {
    return bigNumber ? Number(bigNumber.toString()) : 0;
  } catch {
    return 0;
  }
};

// Format USD value (requires ETH price feed)
export const formatUSD = (wei, ethPrice) => {
  if (!wei || !ethPrice) return "$0.00";
  const eth = parseFloat(ethers.utils.formatEther(wei));
  return `$${(eth * ethPrice).toFixed(2)}`;
};