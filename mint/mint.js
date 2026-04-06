const { ethers } = hre;
const fs = require("fs");
const path = require("path");

/**
 * Mint script for TokenizArt42 NFTs on Sepolia Testnet.
 *
 * Usage:
 *   cd code && npx hardhat run ../mint/mint.js --network sepolia
 *
 * This script mints an NFT using on-chain SVG generation (bonus).
 * For IPFS minting, use mintWithURI in the Hardhat console.
 */
async function main() {
	const [minter] = await ethers.getSigners();

	/* Load contract address */
	const addressesPath = path.join(__dirname, "../deployment/addresses.json");
	if (!fs.existsSync(addressesPath)) {
		console.error("Error: deployment/addresses.json not found.");
		console.error("Deploy the contract first: npx hardhat run ../deployment/deploy.js --network sepolia");
		process.exit(1);
	}
	const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

	console.log("=".repeat(60));
	console.log("  MINTING TOKENIZART42 NFT");
	console.log("=".repeat(60));
	console.log("Minter   :", minter.address);
	console.log("Contract :", addresses.nft);
	console.log("-".repeat(60));

	/* Attach to deployed contract */
	const TokenizArt42 = await ethers.getContractFactory("TokenizArt42");
	const nft = await TokenizArt42.attach(addresses.nft);

	/* Check current supply */
	const supplyBefore = await nft.totalSupply();
	console.log("Supply before :", supplyBefore.toString());

	/* Mint on-chain NFT */
	console.log("Minting on-chain NFT...");
	const tx = await nft.mintOnChain(minter.address);
	const receipt = await tx.wait();
	console.log("TX hash :", tx.hash);

	/* Get the minted token ID */
	const tokenId = supplyBefore;
	console.log("Token ID :", tokenId.toString());

	/* Verify ownership */
	const nftOwner = await nft.ownerOf(tokenId);
	console.log("NFT owner :", nftOwner);

	/* Get token URI */
	const tokenURI = await nft.tokenURI(tokenId);
	console.log("Token URI :", tokenURI.substring(0, 80) + "...");

	const supplyAfter = await nft.totalSupply();
	console.log("Supply after :", supplyAfter.toString());

	console.log("=".repeat(60));
	console.log("  NFT MINTED SUCCESSFULLY");
	console.log("=".repeat(60));
	console.log("");
	console.log("View on Etherscan:");
	console.log(`https://sepolia.etherscan.io/address/${addresses.nft}`);
	console.log("");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error("Mint error:", error.message);
		process.exit(1);
	});
