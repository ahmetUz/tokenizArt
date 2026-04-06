// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title TokenizArt42
 * @author auzun
 * @notice ERC-721 NFT contract with on-chain SVG art generation.
 * @dev Supports two minting modes:
 *      - mintWithURI: mint with an external IPFS metadata URI (mandatory)
 *      - mintOnChain: mint with fully on-chain SVG and metadata (bonus)
 *
 * The on-chain SVG features a "42" artwork generated directly in the contract,
 * making it permanent and independent of any external storage.
 */
contract TokenizArt42 is ERC721, ERC721URIStorage, Ownable {

	/* ========================================================================
	 *                          STATE VARIABLES
	 * ======================================================================== */

	/// @notice Counter for the next token ID to mint
	uint256 private _nextTokenId;

	/// @notice Maximum supply of NFTs (42 total)
	uint256 public constant MAX_SUPPLY = 42;

	/* ========================================================================
	 *                             EVENTS
	 * ======================================================================== */

	/// @notice Emitted when a new NFT is minted
	event NFTMinted(uint256 indexed tokenId, address indexed to, string tokenURI);

	/* ========================================================================
	 *                            CONSTRUCTOR
	 * ======================================================================== */

	/**
	 * @notice Deploys the TokenizArt42 NFT collection.
	 * @dev Sets the collection name to "TokenizArt42" and symbol to "TA42".
	 *      The deployer becomes the owner.
	 */
	constructor() ERC721("TokenizArt42", "TA42") Ownable(msg.sender) {}

	/* ========================================================================
	 *                         MINTING FUNCTIONS
	 * ======================================================================== */

	/**
	 * @notice Mints a new NFT with an external metadata URI (e.g. IPFS).
	 * @dev Only the owner can mint. Used for IPFS-hosted metadata.
	 * @param to  Recipient address.
	 * @param uri Metadata URI (e.g. ipfs://Qm...).
	 * @return tokenId The ID of the newly minted token.
	 */
	function mintWithURI(address to, string calldata uri) external onlyOwner returns (uint256 tokenId) {
		require(_nextTokenId < MAX_SUPPLY, "TokenizArt42: max supply reached");

		tokenId = _nextTokenId;
		_nextTokenId++;

		_safeMint(to, tokenId);
		_setTokenURI(tokenId, uri);

		emit NFTMinted(tokenId, to, uri);
	}

	/**
	 * @notice Mints a new NFT with fully on-chain SVG and metadata (bonus).
	 * @dev The SVG artwork and JSON metadata are generated and stored
	 *      entirely on the blockchain. No external storage needed.
	 * @param to Recipient address.
	 * @return tokenId The ID of the newly minted token.
	 */
	function mintOnChain(address to) external onlyOwner returns (uint256 tokenId) {
		require(_nextTokenId < MAX_SUPPLY, "TokenizArt42: max supply reached");

		tokenId = _nextTokenId;
		_nextTokenId++;

		_safeMint(to, tokenId);

		/* Generate on-chain metadata with embedded SVG */
		string memory onChainURI = _buildTokenURI(tokenId);
		_setTokenURI(tokenId, onChainURI);

		emit NFTMinted(tokenId, to, onChainURI);
	}

	/* ========================================================================
	 *                         VIEW FUNCTIONS
	 * ======================================================================== */

	/**
	 * @notice Returns the total number of minted NFTs.
	 * @return Current supply count.
	 */
	function totalSupply() external view returns (uint256) {
		return _nextTokenId;
	}

	/* ========================================================================
	 *                      ON-CHAIN SVG GENERATION
	 * ======================================================================== */

	/**
	 * @dev Generates a complete data URI containing JSON metadata with
	 *      an embedded SVG image, all encoded in base64.
	 * @param tokenId The token ID to generate metadata for.
	 * @return A data:application/json;base64 URI.
	 */
	function _buildTokenURI(uint256 tokenId) internal pure returns (string memory) {
		string memory svg = _generateSVG(tokenId);
		string memory imageURI = string(
			abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(svg)))
		);

		string memory json = string(
			abi.encodePacked(
				'{"name":"TokenizArt42 #',
				Strings.toString(tokenId),
				'","description":"On-chain generative art NFT from the TokenizArt42 collection by auzun.",'
				'"artist":"auzun",'
				'"image":"',
				imageURI,
				'","attributes":[{"trait_type":"Token ID","value":"',
				Strings.toString(tokenId),
				'"},{"trait_type":"Generation","value":"On-Chain"},{"trait_type":"Collection","value":"42"}]}'
			)
		);

		return string(
			abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json)))
		);
	}

	/**
	 * @dev Generates a unique SVG artwork featuring "42".
	 *      Each token gets slightly different colors based on its ID.
	 * @param tokenId Used to vary the artwork per token.
	 * @return SVG markup as a string.
	 */
	function _generateSVG(uint256 tokenId) internal pure returns (string memory) {
		/* Derive colors from tokenId for uniqueness */
		uint256 hue1 = (tokenId * 37) % 360;
		uint256 hue2 = (hue1 + 120) % 360;
		uint256 hue3 = (hue1 + 240) % 360;

		return string(
			abi.encodePacked(
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">'
				'<defs>'
				'<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">'
				'<stop offset="0%" style="stop-color:hsl(',
				Strings.toString(hue1),
				',70%,15%)"/>'
				'<stop offset="100%" style="stop-color:hsl(',
				Strings.toString(hue2),
				',70%,10%)"/>'
				'</linearGradient>'
				'<linearGradient id="txt" x1="0%" y1="0%" x2="100%" y2="100%">'
				'<stop offset="0%" style="stop-color:hsl(',
				Strings.toString(hue2),
				',80%,60%)"/>'
				'<stop offset="100%" style="stop-color:hsl(',
				Strings.toString(hue3),
				',80%,60%)"/>'
				'</linearGradient>'
				'</defs>'
				'<rect width="500" height="500" fill="url(#bg)"/>'
				'<circle cx="250" cy="200" r="120" fill="none" stroke="url(#txt)" stroke-width="2" opacity="0.3"/>'
				'<circle cx="250" cy="200" r="80" fill="none" stroke="url(#txt)" stroke-width="1" opacity="0.2"/>'
				'<text x="250" y="230" font-family="monospace" font-size="140" font-weight="bold" '
				'fill="url(#txt)" text-anchor="middle">42</text>'
				'<text x="250" y="380" font-family="monospace" font-size="20" '
				'fill="url(#txt)" text-anchor="middle" opacity="0.7">TokenizArt42</text>'
				'<text x="250" y="410" font-family="monospace" font-size="14" '
				'fill="url(#txt)" text-anchor="middle" opacity="0.5">by auzun</text>'
				'<text x="250" y="440" font-family="monospace" font-size="12" '
				'fill="url(#txt)" text-anchor="middle" opacity="0.3">#',
				Strings.toString(tokenId),
				'</text>'
				'</svg>'
			)
		);
	}

	/* ========================================================================
	 *                       REQUIRED OVERRIDES
	 * ======================================================================== */

	/// @dev Override required by Solidity for ERC721 + ERC721URIStorage
	function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		return super.tokenURI(tokenId);
	}

	/// @dev Override required by Solidity for ERC721 + ERC721URIStorage
	function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
