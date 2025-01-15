import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { Interface } from "ethers";

const getSelectors = (contractIface: Interface) => {
  const selectors: string[] = [];
  contractIface.forEachFunction((func) => {
    // The function selector is the first four bytes of the keccak256 hash of the function signature.
    // For example: function transfer(address to, uint256 value) => keccak256("transfer(address,uint256)").slice(0, 10) => 0xa9059cbb,
    // where "transfer(address,uint256)" is the function signature.
    selectors.push(func.selector);
  });

  return selectors;
};

describe("Diamond with DiamondInit", function () {
  async function deployDiamondFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    // 1. Deploy DiamondCutFacet
    const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
    const diamondCutFacet = await DiamondCutFacet.deploy();
    await diamondCutFacet.waitForDeployment();

    // 2. Deploy Diamond Proxy
    const Diamond = await ethers.getContractFactory("Diamond");
    const diamond = await Diamond.deploy(
      owner,
      await diamondCutFacet.getAddress()
    );
    await diamond.waitForDeployment();

    // 3. Deploy other facets
    const DiamondLoupeFacet = await ethers.getContractFactory(
      "DiamondLoupeFacet"
    );
    const diamondLoupeFacet = await DiamondLoupeFacet.deploy();
    await diamondLoupeFacet.waitForDeployment();

    const OwnershipFacet = await ethers.getContractFactory("OwnershipFacet");
    const ownershipFacet = await OwnershipFacet.deploy();
    await ownershipFacet.waitForDeployment();

    const GameTokenFacet = await ethers.getContractFactory("GameTokenFacet");
    const gameTokenFacet = await GameTokenFacet.deploy();
    await gameTokenFacet.waitForDeployment();

    const GameNFTFacet = await ethers.getContractFactory("GameNFTFacet");
    const gameNftFacet = await GameNFTFacet.deploy();
    await gameNftFacet.waitForDeployment();

    // 4. Deploy DiamondInit
    const DiamondInit = await ethers.getContractFactory("DiamondInit");
    const diamondInit = await DiamondInit.deploy();
    await diamondInit.waitForDeployment();

    // 5. Build "cut" with all facets
    const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 } as const;

    const cut = [
      {
        facetAddress: await diamondLoupeFacet.getAddress(),
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(diamondLoupeFacet.interface),
      },
      {
        facetAddress: await ownershipFacet.getAddress(),
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(ownershipFacet.interface),
      },
      {
        facetAddress: await gameTokenFacet.getAddress(),
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(gameTokenFacet.interface),
      },
      {
        facetAddress: await gameNftFacet.getAddress(),
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(gameNftFacet.interface),
      },
    ];

    // 6. We'll encode the call to "init(...)"
    //   Suppose we want:  name="Gold", symbol="GLD", decimals=18, supply=1000, nftName="GameItem", nftSymbol="GITM"
    const initCallData = diamondInit.interface.encodeFunctionData("init", [
      "Gold",
      "GLD",
      18,
      1000,
      "GameItem",
      "GITM",
    ]);

    // 7. diamondCut with DiamondInit as _init and initAll(...) as _calldata
    const diamondAsCutFacet = await ethers.getContractAt(
      "DiamondCutFacet",
      await diamond.getAddress()
    );

    // set contract owner in LibDiamond before or after,
    // but let's do it in a separate call or in the Diamond's constructor:
    // For demonstration, let's do a quick hack:
    await diamondAsCutFacet.diamondCut(
      cut,
      await diamondInit.getAddress(),
      initCallData
    );

    // 9. Connect to the newly added facets at the diamond address
    const diamondAsOwnership = await ethers.getContractAt(
      "OwnershipFacet",
      await diamond.getAddress()
    );
    // Transfer ownership to the `owner` (the deployer)
    await diamondAsOwnership.transferOwnership(await owner.getAddress());

    const diamondAsToken = await ethers.getContractAt(
      "GameTokenFacet",
      await diamond.getAddress()
    );
    const diamondAsNFT = await ethers.getContractAt(
      "GameNFTFacet",
      await diamond.getAddress()
    );

    // Return references
    return {
      owner,
      user1,
      user2,
      diamond,
      diamondAsOwnership,
      diamondAsToken,
      diamondAsNFT,
      diamondAsCutFacet,
    };
  }

  // ---------------------------------------------
  // TESTS
  // ---------------------------------------------
  describe("Initialization via DiamondInit", function () {
    it("Should initialize ERC20 and NFT in a single call", async function () {
      const { diamondAsToken, diamondAsNFT } = await loadFixture(
        deployDiamondFixture
      );

      // Check the ERC20 data
      expect(await diamondAsToken.name()).to.equal("Gold");
      expect(await diamondAsToken.symbol()).to.equal("GLD");
      expect(await diamondAsToken.decimals()).to.equal(18);
      expect(await diamondAsToken.totalSupply()).to.equal(1000);

      // Check the NFT data
      expect(await diamondAsNFT.nftName()).to.equal("GameItem");
      expect(await diamondAsNFT.nftSymbol()).to.equal("GITM");
    });
  });

  describe("Token behavior", function () {
    it("Should transfer tokens", async function () {
      const { diamondAsToken, owner, user1 } = await loadFixture(
        deployDiamondFixture
      );

      // Owner has 1000 from init. Transfer 100 to user1
      await diamondAsToken
        .connect(owner)
        .transfer(await user1.getAddress(), 100);

      expect(await diamondAsToken.balanceOf(await user1.getAddress())).to.eq(
        100
      );
      expect(await diamondAsToken.balanceOf(await owner.getAddress())).to.eq(
        900
      );
    });
  });

  describe("NFT behavior", function () {
    it("Should mint NFT", async function () {
      const { diamondAsNFT, owner, user1 } = await loadFixture(
        deployDiamondFixture
      );

      // Mint to user1
      await diamondAsNFT.connect(owner).mintNFT(await user1.getAddress());

      // Check
      const bal = await diamondAsNFT.balanceOfNFT(await user1.getAddress());
      expect(bal).to.eq(1);
      expect(await diamondAsNFT.ownerOf(0)).to.eq(await user1.getAddress());
    });
  });

  describe("Adding StakingFacet after initial deployment", function () {
    it("Should add StakingFacet and allow staking/unstaking", async function () {
      // 1. Deploy the diamond with your existing fixture
      const { owner, user1, diamond, diamondAsToken, diamondAsCutFacet } =
        await loadFixture(deployDiamondFixture);

      // 2. Deploy new StakingFacet
      const StakingFacet = await ethers.getContractFactory("StakingFacet");
      const stakingFacet = await StakingFacet.deploy();
      await stakingFacet.waitForDeployment();

      // 3. Build the new cut
      const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 } as const;
      const stakeSelectors = getSelectors(stakingFacet.interface);

      const newCut = [
        {
          facetAddress: await stakingFacet.getAddress(),
          action: FacetCutAction.Add,
          functionSelectors: stakeSelectors,
        },
      ];

      // 4. Call diamondCut again to add StakingFacet
      await diamondAsCutFacet
        .connect(owner)
        .diamondCut(newCut, ethers.ZeroAddress, "0x"); // This time, no init

      // 5. Now connect to the new facet
      const diamondAsStaking = await ethers.getContractAt(
        "StakingFacet",
        await diamond.getAddress()
      );

      // 6. Test staking: user1 has no tokens yet, so let's give them some
      //    Owner has 1000 from the init. Transfer 200 to user1.
      await diamondAsToken
        .connect(owner)
        .transfer(await user1.getAddress(), 200);

      // user1 stakes 50
      await diamondAsStaking.connect(user1).stake(50);

      // user1 tries to stake more than they have
      await expect(
        diamondAsStaking.connect(user1).stake(1000)
      ).to.be.revertedWith("Insufficient token balance");

      // 7. Check staked amounts
      expect(await diamondAsStaking.stakedOf(await user1.getAddress())).to.eq(
        50
      );

      // 8. Unstake
      await diamondAsStaking.connect(user1).unstake(20);
      expect(await diamondAsStaking.stakedOf(await user1.getAddress())).to.eq(
        30
      );

      // user1's token balance went up by 20
      expect(await diamondAsToken.balanceOf(await user1.getAddress())).to.eq(
        170
      );
    });
  });

  // ------------------------------------------
  // 1) REPLACING (UPGRADING) A FACET
  // ------------------------------------------
  describe("Replacing an existing facet (GameTokenFacet -> GameTokenFacetV2)", function () {
    it("Should upgrade the token facet and use new logic", async function () {
      const { owner, user1, diamondAsCutFacet, diamondAsToken } =
        await loadFixture(deployDiamondFixture);

      // 1. Deploy the new facet (GameTokenFacetV2)
      const GameTokenFacetV2 = await ethers.getContractFactory(
        "GameTokenFacetV2"
      );
      const gameTokenFacetV2 = await GameTokenFacetV2.deploy();
      await gameTokenFacetV2.waitForDeployment();

      // 2. Gather the function selectors from the new facet
      const facetV2Selectors = getSelectors(gameTokenFacetV2.interface);

      // 3. We'll do a diamondCut with action = Replace
      const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 } as const;
      const replaceCut = [
        {
          facetAddress: await gameTokenFacetV2.getAddress(),
          action: FacetCutAction.Replace,
          functionSelectors: facetV2Selectors,
        },
      ];

      // 4. Perform the cut
      await diamondAsCutFacet
        .connect(owner)
        .diamondCut(replaceCut, ethers.ZeroAddress, "0x");

      // 5. Connect to the diamond again, but the "GameTokenFacet" interface is effectively replaced
      const diamondAsTokenV2 = await ethers.getContractAt(
        "GameTokenFacetV2",
        await diamondAsToken.getAddress() // same diamond address
      );

      // 6. Test new logic
      //    Let's confirm the fee burn mechanism:
      //    - Owner has 1000 from init
      //    - Transfer 100 from owner to user1 now costs 101 from owner
      await diamondAsTokenV2
        .connect(owner)
        .transfer(await user1.getAddress(), 100);

      const user1Balance = await diamondAsTokenV2.balanceOf(
        await user1.getAddress()
      );
      // user1 should have 100
      expect(user1Balance).to.eq(100);

      // The owner's balance should now be 1000 - 101 = 899
      const ownerBalance = await diamondAsTokenV2.balanceOf(
        await owner.getAddress()
      );
      expect(ownerBalance).to.eq(899);

      // totalSupply was 1000, we burned 1, so 999
      const newSupply = await diamondAsTokenV2.totalSupply();
      expect(newSupply).to.eq(999);
    });
  });

  // ------------------------------------------
  // 2) REMOVING A FACET
  // ------------------------------------------
  describe("Removing an entire facet (e.g., the NFT facet)", function () {
    it("Should remove GameNFTFacet from the diamond", async function () {
      const { owner, diamondAsCutFacet, diamondAsNFT, user1 } =
        await loadFixture(deployDiamondFixture);

      // 1. Let's gather the NFT facet's function selectors
      //    We'll remove them all so the facet is effectively gone.
      const nftFactory = await ethers.getContractFactory("GameNFTFacet");
      const nftIface = nftFactory.interface;
      const nftSelectors = getSelectors(nftIface);

      // 2. We'll do a diamondCut with action = Remove for each selector
      const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 } as const;
      const removeCut = [
        {
          facetAddress: ethers.ZeroAddress, // per EIP-2535, removing uses address(0)
          action: FacetCutAction.Remove,
          functionSelectors: nftSelectors,
        },
      ];

      // 3. Perform the cut
      await diamondAsCutFacet
        .connect(owner)
        .diamondCut(removeCut, ethers.ZeroAddress, "0x");

      // 4. Now calling any of GameNFTFacet's functions should revert
      //    with "Diamond: Function does not exist" or a similar error
      await expect(diamondAsNFT.ownerOf(0)).to.be.revertedWith(
        "Diamond: Function does not exist"
      );

      // Or if you had partial removal (some selectors only), you'd test each removed function reverts,
      // and any function not removed still works.
    });
  });
});
