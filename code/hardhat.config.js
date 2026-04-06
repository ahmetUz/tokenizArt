require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
 * Hardhat configuration for TokenizArt42 NFT deployment.
 *
 * Available networks:
 * - hardhat: local network for testing
 * - sepolia: Ethereum Sepolia Testnet (chainId 11155111)
 *
 * Required environment variables (.env file):
 * - SEPOLIA_URL: Sepolia RPC node URL
 * - PRIVATE_KEY: deployment wallet private key
 */
module.exports = {
	solidity: {
		version: "0.8.28",
		settings: {
			evmVersion: "cancun",
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	},
	networks: {
		sepolia: {
			url: process.env.SEPOLIA_URL || "https://ethereum-sepolia-rpc.publicnode.com",
			chainId: 11155111,
			accounts: [process.env.PRIVATE_KEY].filter(Boolean)
		}
	}
};
