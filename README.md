# TokenizArt42 (TA42) - ERC-721 NFT on Sepolia Testnet

## Description

TokenizArt42 is a non-fungible token (NFT) collection compliant with the **ERC-721**
standard, deployed on the **Ethereum Sepolia Testnet**. Each NFT features unique
generative art with the number "42", created either on-chain or stored via IPFS.

## Technical Choices

### Blockchain: Ethereum (Sepolia Testnet)
- **ERC-721 standard**: the most widely used NFT standard
- **Sepolia**: stable Ethereum testnet with free faucets
- **Large ecosystem** for NFT tools and explorers

### Framework: Hardhat
- Most popular Solidity development environment
- Built-in testing with Ethers.js and Chai
- Interactive console for debugging and minting

### Library: OpenZeppelin
- Audited ERC-721 implementation
- ERC721URIStorage extension for flexible metadata
- Ownable for access control

### Language: Solidity 0.8.20
- Built-in overflow protection
- Latest stable version compatible with OpenZeppelin v5

## Features

| Feature              | Description |
|----------------------|-------------|
| **mintWithURI**      | Mint with external IPFS metadata URI |
| **mintOnChain**      | Mint with fully on-chain SVG art (bonus) |
| **ownerOf**          | Verify the owner of any NFT |
| **transferFrom**     | Transfer NFTs between addresses |
| **MAX_SUPPLY**       | Limited to 42 unique NFTs |

## Bonus Features

- **On-chain SVG**: artwork generated directly in the smart contract
- **On-chain metadata**: JSON metadata stored entirely on-chain via base64 data URIs
- **Generative art**: each token gets unique colors based on its ID

## NFT Metadata

- **Artist**: auzun
- **Collection name**: TokenizArt42
- **Image**: SVG with "42" (on-chain or IPFS)

## Deployment

- **Network**: Sepolia Testnet (chainId: 11155111)
- **Contract address**: `0xCE6c212603035aB087498086cae32DF7c41519bF`
- **Explorer**: https://sepolia.etherscan.io/

## Quick Start

```bash
# Install
cd code && npm install

# Compile
npx hardhat compile

# Run tests
npx hardhat test

# Deploy (after configuring .env)
npx hardhat run ../deployment/deploy.js --network sepolia

# Mint an NFT
npx hardhat run ../mint/mint.js --network sepolia
```

## Documentation

See the `documentation/` folder:
- [Whitepaper](documentation/whitepaper.md) - NFT specifications
- [Usage Guide](documentation/guide.md) - Full instructions

## Security

- Based on audited OpenZeppelin contracts
- Access control via `Ownable` (only owner can mint)
- Hardcoded supply limit (42 NFTs max)
- On-chain storage ensures metadata permanence

> **Note**: This project uses the Sepolia testnet exclusively. No real money
> is required. Use a Sepolia faucet to get free SepoliaETH for testing.
