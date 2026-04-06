# Questions pour comprendre TokenizArt42 (NFT)

Tu as deja fait le projet Tokenizer (ERC-20). Ce document liste uniquement ce qui est NOUVEAU dans TokenizArt (ERC-721 NFT).

## Contexte a donner a Claude

Copie-colle ce prompt pour que Claude t'explique tout :

---

Je suis etudiant a 42 et je viens de finir un projet de token ERC-20 (Tokenizer). Maintenant je fais le projet TokenizArt42 qui est un NFT ERC-721 sur Ethereum Sepolia testnet. J'ai besoin de comprendre les concepts suivants en profondeur pour reussir mon evaluation peer-to-peer. Explique-moi chaque point de maniere simple et progressive, avec des exemples concrets. Mon login est "auzun".

Voici les questions auxquelles je dois savoir repondre :

### 1. Difference entre ERC-20 et ERC-721

- C'est quoi la difference fondamentale entre un token ERC-20 (fungible) et un NFT ERC-721 (non-fungible) ?
- Pourquoi on dit que les tokens ERC-20 sont "interchangeables" et que les NFT ne le sont pas ?
- Donne-moi un exemple concret dans la vie reelle pour chaque type.
- Est-ce que le code Solidity est completement different entre les deux ?

### 2. Qu'est-ce qu'un NFT

- C'est quoi un NFT exactement au niveau technique ?
- Comment un NFT est stocke sur la blockchain ? (est-ce que l'image est sur la blockchain ?)
- C'est quoi un tokenId ? Pourquoi chaque NFT a un ID unique ?
- Comment on sait qui possede un NFT ? (la fonction ownerOf)
- Quelle est la difference entre ownerOf (ERC-721) et balanceOf (ERC-20) ?

### 3. Les metadata d'un NFT

- C'est quoi les metadata d'un NFT ?
- A quoi sert la fonction tokenURI ?
- C'est quoi la structure JSON standard des metadata d'un NFT ? (name, description, image, attributes)
- Dans mon projet, l'artiste doit etre "auzun" et le nom doit contenir "42" — ou est-ce que je definis ca ?
- C'est quoi la difference entre metadata on-chain et metadata off-chain (IPFS) ?

### 4. IPFS (InterPlanetary File System)

- C'est quoi IPFS et pourquoi on l'utilise pour les NFT ?
- Quelle est la difference entre un serveur web classique et IPFS pour stocker une image ?
- C'est quoi un CID (Content Identifier) ?
- C'est quoi Pinata et comment ca fonctionne ?
- Pourquoi le sujet exige que l'image soit stockee sur IPFS ou un systeme distribue ?
- Si un serveur IPFS tombe, est-ce que mon image disparait ?

### 5. Le contrat TokenizArt42.sol

- Explique-moi chaque import du contrat :
  - ERC721
  - ERC721URIStorage
  - Ownable
  - Base64
  - Strings
- Pourquoi on herite de ERC721URIStorage et pas juste ERC721 ?
- C'est quoi _setTokenURI et pourquoi on en a besoin ?
- Explique la fonction mintWithURI : que fait-elle etape par etape ?
- Explique la fonction mintOnChain : que fait-elle etape par etape ?
- C'est quoi _safeMint et pourquoi on utilise ca plutot que _mint ?
- Pourquoi on a un MAX_SUPPLY de 42 et comment c'est enforce ?
- Pourquoi on a besoin des overrides tokenURI et supportsInterface ?

### 6. La generation SVG on-chain (bonus)

- C'est quoi un SVG ?
- Comment on genere du SVG directement dans un smart contract Solidity ?
- C'est quoi abi.encodePacked et pourquoi on l'utilise pour construire des strings ?
- C'est quoi Base64.encode et pourquoi on encode en base64 ?
- C'est quoi un data URI ? (data:application/json;base64,...)
- Comment les couleurs sont generees a partir du tokenId ? (le calcul avec les hue)
- Pourquoi stocker l'image on-chain est mieux que sur IPFS ? (permanence)

### 7. Le processus de mint

- C'est quoi "minter" un NFT ?
- Quelle difference entre deployer le contrat et minter un NFT ?
- Comment on mint avec une URI IPFS ? (mintWithURI)
- Comment on mint avec le SVG on-chain ? (mintOnChain)
- Apres le mint, comment je verifie que le NFT existe et qui le possede ?
- Comment je vois l'image/metadata de mon NFT ?

### 8. Structure du projet

- Pourquoi il y a un dossier "mint/" en plus par rapport au projet Tokenizer ?
- A quoi sert le fichier metadata.json dans mint/ ?
- A quoi sert le fichier tokenizart42.svg dans mint/ ?
- A quoi sert addresses.json dans deployment/ ?

### 9. Securite et controle d'acces

- Qui peut minter un NFT ? Pourquoi c'est restreint au owner ?
- Comment on transfere un NFT d'une adresse a une autre ?
- C'est quoi approve et setApprovalForAll dans ERC-721 ?
- Comment le MAX_SUPPLY protege contre le minting infini ?

### 10. Commandes a connaitre pour l'evaluation

- Comment compiler le contrat ?
- Comment lancer les tests ?
- Comment deployer sur Sepolia ?
- Comment minter un NFT apres deploiement ?
- Comment verifier l'owner d'un NFT dans la console Hardhat ?
- Comment voir le tokenURI d'un NFT ?

### 11. Les bonus du sujet

- Qu'est-ce que "on-chain metadata" et pourquoi c'est un bonus ?
- Comment le SVG est genere dans le contrat ? Montre-moi le flux complet.
- Qu'est-ce qu'un "NFT Inscription" mentionne dans le sujet ?

### 12. Questions pieges possibles en evaluation

- Pourquoi tu utilises Sepolia et pas BSC Testnet ?
- Pourquoi tu utilises OpenZeppelin ?
- Ou est stockee l'image de ton NFT exactement ?
- Si la blockchain est supprimee, est-ce que ton NFT existe encore ?
- C'est quoi la difference entre ton projet Tokenizer (ERC-20) et TokenizArt (ERC-721) ?
- Pourquoi MAX_SUPPLY est une constante et pas une variable ?
- Que se passe-t-il si quelqu'un essaie de minter le 43eme NFT ?
- Comment prouver que tu es le proprietaire d'un NFT ?

---

Reponds a chaque question de maniere detaillee, avec des exemples de code quand c'est pertinent. Utilise un langage simple, je suis debutant en Web3.
