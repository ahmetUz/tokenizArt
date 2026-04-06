const { ethers } = hre;
const fs = require("fs");
const path = require("path");

/**
 * TokenizArt42 deployment script for Sepolia Testnet.
 *
 * Usage:
 *   cd code && npx hardhat run ../deployment/deploy.js --network sepolia
 *
 * After deployment, the contract address is saved to deployment/addresses.json
 */
async function main() {
	const [deployer] = await ethers.getSigners();

	console.log("=".repeat(60));
	console.log("  DEPLOYING TOKENIZART42 (ERC-721)");
	console.log("=".repeat(60));
	console.log("Deployer :", deployer.address);

	const balance = await ethers.provider.getBalance(deployer.address);
	console.log("Balance  :", ethers.formatEther(balance), "SepoliaETH");
	console.log("-".repeat(60));

	/* Deploy contract */
	console.log("Deploying TokenizArt42...");
	const TokenizArt42 = await ethers.getContractFactory("TokenizArt42");
	const nft = await TokenizArt42.deploy();
	await nft.waitForDeployment();

	const contractAddress = await nft.getAddress();
	console.log("TokenizArt42 deployed at :", contractAddress);

	/* Save address */
	const addressesPath = path.join(__dirname, "addresses.json");
	let addresses = {};
	if (fs.existsSync(addressesPath)) {
		addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
	}
	addresses.nft = contractAddress;
	addresses.deployer = deployer.address;
	fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, "\t") + "\n");

	/* Display info */
	console.log("-".repeat(60));
	console.log("Name     :", await nft.name());
	console.log("Symbol   :", await nft.symbol());
	console.log("Max supply:", (await nft.MAX_SUPPLY()).toString());
	console.log("Owner    :", await nft.owner());
	console.log("=".repeat(60));
	console.log("");
	console.log("Address saved to deployment/addresses.json");
	console.log("");
	console.log("Verify on Etherscan Sepolia:");
	console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
	console.log("");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error("Deployment error:", error);
		process.exit(1);
	});
