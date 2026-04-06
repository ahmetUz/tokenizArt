const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test suite for the TokenizArt42 NFT contract.
 * Covers: deployment, minting (URI + on-chain), ownership, supply limits.
 */
describe("TokenizArt42", function () {
	let nft;
	let owner;
	let user1;
	let user2;

	beforeEach(async function () {
		[owner, user1, user2] = await ethers.getSigners();
		const TokenizArt42 = await ethers.getContractFactory("TokenizArt42");
		nft = await TokenizArt42.deploy();
		await nft.waitForDeployment();
	});

	/* ------------------------------------------------------------------
	 *  DEPLOYMENT
	 * ------------------------------------------------------------------ */
	describe("Deployment", function () {
		it("should have the correct name and symbol", async function () {
			expect(await nft.name()).to.equal("TokenizArt42");
			expect(await nft.symbol()).to.equal("TA42");
		});

		it("should set deployer as owner", async function () {
			expect(await nft.owner()).to.equal(owner.address);
		});

		it("should start with 0 supply", async function () {
			expect(await nft.totalSupply()).to.equal(0);
		});

		it("should have max supply of 42", async function () {
			expect(await nft.MAX_SUPPLY()).to.equal(42);
		});
	});

	/* ------------------------------------------------------------------
	 *  MINT WITH URI (IPFS)
	 * ------------------------------------------------------------------ */
	describe("Mint with URI", function () {
		const testURI = "ipfs://QmTest123456789";

		it("should allow owner to mint with URI", async function () {
			await nft.mintWithURI(user1.address, testURI);
			expect(await nft.ownerOf(0)).to.equal(user1.address);
			expect(await nft.tokenURI(0)).to.equal(testURI);
			expect(await nft.totalSupply()).to.equal(1);
		});

		it("should increment token IDs", async function () {
			await nft.mintWithURI(user1.address, testURI);
			await nft.mintWithURI(user2.address, testURI);
			expect(await nft.ownerOf(0)).to.equal(user1.address);
			expect(await nft.ownerOf(1)).to.equal(user2.address);
			expect(await nft.totalSupply()).to.equal(2);
		});

		it("should prevent non-owners from minting", async function () {
			await expect(
				nft.connect(user1).mintWithURI(user1.address, testURI)
			).to.be.reverted;
		});

		it("should emit NFTMinted event", async function () {
			await expect(nft.mintWithURI(user1.address, testURI))
				.to.emit(nft, "NFTMinted")
				.withArgs(0, user1.address, testURI);
		});
	});

	/* ------------------------------------------------------------------
	 *  MINT ON-CHAIN (BONUS)
	 * ------------------------------------------------------------------ */
	describe("Mint on-chain (bonus)", function () {
		it("should allow owner to mint on-chain", async function () {
			await nft.mintOnChain(user1.address);
			expect(await nft.ownerOf(0)).to.equal(user1.address);
			expect(await nft.totalSupply()).to.equal(1);
		});

		it("should generate a valid data URI", async function () {
			await nft.mintOnChain(owner.address);
			const uri = await nft.tokenURI(0);
			expect(uri).to.match(/^data:application\/json;base64,/);
		});

		it("should contain correct metadata in the URI", async function () {
			await nft.mintOnChain(owner.address);
			const uri = await nft.tokenURI(0);

			/* Decode the base64 JSON */
			const base64Data = uri.replace("data:application/json;base64,", "");
			const json = JSON.parse(Buffer.from(base64Data, "base64").toString());

			expect(json.name).to.equal("TokenizArt42 #0");
			expect(json.artist).to.equal("auzun");
			expect(json.image).to.match(/^data:image\/svg\+xml;base64,/);
		});

		it("should generate SVG containing 42", async function () {
			await nft.mintOnChain(owner.address);
			const uri = await nft.tokenURI(0);

			const base64Data = uri.replace("data:application/json;base64,", "");
			const json = JSON.parse(Buffer.from(base64Data, "base64").toString());

			/* Decode the SVG */
			const svgBase64 = json.image.replace("data:image/svg+xml;base64,", "");
			const svg = Buffer.from(svgBase64, "base64").toString();

			expect(svg).to.include(">42<");
			expect(svg).to.include("TokenizArt42");
			expect(svg).to.include("auzun");
		});

		it("should prevent non-owners from minting", async function () {
			await expect(
				nft.connect(user1).mintOnChain(user1.address)
			).to.be.reverted;
		});
	});

	/* ------------------------------------------------------------------
	 *  OWNERSHIP (ownerOf)
	 * ------------------------------------------------------------------ */
	describe("Ownership", function () {
		it("should correctly report the owner of an NFT", async function () {
			await nft.mintOnChain(user1.address);
			await nft.mintOnChain(user2.address);

			expect(await nft.ownerOf(0)).to.equal(user1.address);
			expect(await nft.ownerOf(1)).to.equal(user2.address);
		});

		it("should revert for non-existent token", async function () {
			await expect(nft.ownerOf(99)).to.be.reverted;
		});

		it("should update owner after transfer", async function () {
			await nft.mintOnChain(user1.address);
			await nft.connect(user1).transferFrom(user1.address, user2.address, 0);
			expect(await nft.ownerOf(0)).to.equal(user2.address);
		});
	});

	/* ------------------------------------------------------------------
	 *  SUPPLY LIMIT
	 * ------------------------------------------------------------------ */
	describe("Supply limit", function () {
		it("should enforce max supply", async function () {
			/* Mint all 42 NFTs */
			for (let i = 0; i < 42; i++) {
				await nft.mintOnChain(owner.address);
			}
			expect(await nft.totalSupply()).to.equal(42);

			/* 43rd should fail */
			await expect(
				nft.mintOnChain(owner.address)
			).to.be.revertedWith("TokenizArt42: max supply reached");
		});
	});

	/* ------------------------------------------------------------------
	 *  ERC-721 INTERFACE
	 * ------------------------------------------------------------------ */
	describe("ERC-721 interface", function () {
		it("should support ERC-721 interface", async function () {
			/* ERC-721 interface ID: 0x80ac58cd */
			expect(await nft.supportsInterface("0x80ac58cd")).to.be.true;
		});

		it("should support ERC-721 metadata interface", async function () {
			/* ERC-721 Metadata interface ID: 0x5b5e139f */
			expect(await nft.supportsInterface("0x5b5e139f")).to.be.true;
		});
	});
});
