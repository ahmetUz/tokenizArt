# TokenizArt42 - Whitepaper

## 1. Introduction

TokenizArt42 is a non-fungible token (NFT) collection deployed on the Ethereum
Sepolia Testnet. Each NFT represents a unique piece of generative art featuring
the number "42", created entirely on-chain using SVG rendering.

## 2. Technical Specifications

| Property           | Value                                         |
|--------------------|-----------------------------------------------|
| **Name**           | TokenizArt42                                  |
| **Symbol**         | TA42                                          |
| **Standard**       | ERC-721                                       |
| **Blockchain**     | Ethereum Sepolia Testnet (chainId: 11155111)  |
| **Max Supply**     | 42 NFTs                                       |
| **Language**       | Solidity 0.8.20                               |
| **Framework**      | Hardhat                                       |
| **Image Storage**  | On-chain SVG + IPFS support                   |

## 3. Features

### 3.1 Dual Minting Modes
- **mintWithURI**: mint with external IPFS metadata (mandatory requirement)
- **mintOnChain**: mint with fully on-chain SVG and metadata (bonus)

### 3.2 On-Chain Art Generation
Each NFT generates a unique SVG artwork directly in the smart contract:
- Colors are derived from the token ID, making each piece unique
- The "42" is prominently displayed with gradient effects
- Artist name and token ID are embedded in the artwork

### 3.3 IPFS Support
Images and metadata can be stored on IPFS (InterPlanetary File System),
a distributed storage network that ensures content permanence.

### 3.4 Ownership Verification
The `ownerOf(tokenId)` function allows anyone to verify who owns a specific NFT.

### 3.5 Supply Limit
The collection is limited to 42 NFTs maximum, enforced at the contract level.

## 4. Metadata Structure

```json
{
  "name": "TokenizArt42 #0",
  "description": "On-chain generative art NFT...",
  "artist": "auzun",
  "image": "data:image/svg+xml;base64,...",
  "attributes": [
    {"trait_type": "Token ID", "value": "0"},
    {"trait_type": "Generation", "value": "On-Chain"},
    {"trait_type": "Collection", "value": "42"}
  ]
}
```

## 5. Security

- **Ownable**: only the owner can mint new NFTs
- **Supply cap**: hardcoded maximum of 42 tokens
- **OpenZeppelin**: audited ERC-721 implementation
- **On-chain storage**: metadata cannot be altered or lost (bonus)

## 6. Deployment

Deployed on Ethereum Sepolia Testnet using SepoliaETH (free test tokens).
No real money is used.
