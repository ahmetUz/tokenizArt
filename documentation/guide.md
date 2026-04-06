# Usage Guide - TokenizArt42

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MetaMask** wallet
- Free SepoliaETH from a faucet

## Installation

```bash
cd code
npm install
cp .env.example .env
# Edit .env with your private key
```

## Compilation

```bash
cd code
npx hardhat compile
```

## Tests

```bash
cd code
npx hardhat test
```

## Deployment

```bash
cd code
npx hardhat run ../deployment/deploy.js --network sepolia
```

The contract address is saved to `deployment/addresses.json`.

## Minting

### On-chain mint (bonus - generates SVG in the contract)

```bash
cd code
npx hardhat run ../mint/mint.js --network sepolia
```

### IPFS mint (using Hardhat console)

1. Upload `mint/tokenizart42.svg` to [Pinata](https://app.pinata.cloud/) (free IPFS pinning)
2. Update `mint/metadata.json` with the IPFS image CID
3. Upload `mint/metadata.json` to Pinata
4. Mint via console:

```bash
cd code
npx hardhat console --network sepolia
```

```javascript
const NFT = await ethers.getContractFactory("TokenizArt42");
const nft = await NFT.attach("CONTRACT_ADDRESS");
await nft.mintWithURI("YOUR_ADDRESS", "ipfs://YOUR_METADATA_CID");
```

## Verifying Ownership

```javascript
// In Hardhat console
const owner = await nft.ownerOf(0);
console.log("Owner of NFT #0:", owner);
```

## Viewing the NFT

### On-chain SVG
```javascript
const uri = await nft.tokenURI(0);
// Decode the base64 JSON to see the SVG
```

### On Etherscan
Visit: `https://sepolia.etherscan.io/address/CONTRACT_ADDRESS`

## Project Structure

```
tokenizArt/
├── README.md                          # Project overview
├── code/                              # Source code
│   ├── contracts/
│   │   └── TokenizArt42.sol           # ERC-721 NFT contract
│   ├── test/
│   │   └── TokenizArt42.test.js       # Test suite
│   ├── hardhat.config.js              # Hardhat configuration
│   ├── package.json                   # npm dependencies
│   └── .env.example                   # Configuration template
├── deployment/                        # Deployment scripts
│   ├── deploy.js                      # Deploy script
│   └── addresses.json                 # Deployed contract addresses
├── mint/                              # Minting resources
│   ├── mint.js                        # On-chain mint script
│   ├── metadata.json                  # IPFS metadata template
│   └── tokenizart42.svg              # NFT artwork (42)
└── documentation/                     # Documentation
    ├── whitepaper.md                  # Token specifications
    └── guide.md                       # This guide
```
