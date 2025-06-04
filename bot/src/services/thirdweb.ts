import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Using a read-only SDK for fetching info.
// For actions like admin minting (not covered in detail here for simplicity/security),
// you'd need a signer with your admin private key (highly sensitive).
const sdk = new ThirdwebSDK(process.env.CHAIN_NAME || "mumbai"); // e.g., "mumbai", "mainnet", "sepolia"
                                                               // Ensure CHAIN_NAME is in your .env or default to a testnet

export const nftContractAddress = process.env.THIRDWEB_NFT_CONTRACT_ADDRESS;
export const nftClaimPageUrl = process.env.THIRDWEB_NFT_CLAIM_PAGE_URL;

export async function getNFTContract() {
  if (!nftContractAddress) {
    throw new Error("THIRDWEB_NFT_CONTRACT_ADDRESS is not defined in .env");
  }
  return await sdk.getContract(nftContractAddress);
}

// In discord-bot/src/services/thirdweb.ts
export const erc20TokenContractAddress = process.env.ERC20_TOKEN_CONTRACT_ADDRESS;

export async function getERC20TokenContract() {
  if (!erc20TokenContractAddress) {
    throw new Error("ERC20_TOKEN_CONTRACT_ADDRESS is not defined in .env");
  }
  // Assuming you've initialized 'sdk' as in the previous example
  return await sdk.getContract(erc20TokenContractAddress, "token"); // "token" for ERC20
}

// You can add more specific functions to interact with Thirdweb here
