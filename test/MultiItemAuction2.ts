const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiItemAuction", function () {
  let MultiItemAuction2, startingBids: any[], itemIds: any[], multiItemAuction2: {
    [x: string]: any; deployed: () => any; auctioneer: () => any; auctionEndTime: () => any;
  }, auctioneer: { address: any; }, bidder1: { address: any; }, bidder2: any, addrs;

  beforeEach(async () => {
    MultiItemAuction2 = await ethers.getContractFactory("MultiItemAuction2");
    [auctioneer, bidder1, bidder2, ...addrs] = await ethers.getSigners();

    itemIds = [1, 2, 90];
    startingBids = [100, 200, 4200];
    const biddingTime = 600; // 10 minutes

    multiItemAuction2 = await MultiItemAuction2.deploy(biddingTime, itemIds, startingBids);
    await multiItemAuction2.deployed();
  });

  it("Should initialize auction with correct parameters", async function () {
    expect(await multiItemAuction2.auctioneer()).to.equal(auctioneer.address);
    expect(await multiItemAuction2.auctionEndTime()).to.be.within(
      (await ethers.provider.getBlock('latest')).timestamp,
      (await ethers.provider.getBlock('latest')).timestamp + 600
    );

    for (let i = 0; i < 3; i++) {
      const item = await multiItemAuction2.items(i);
      expect(item.itemId).to.equal(itemIds[i]);
      expect(item.startingBid).to.equal(startingBids[i]);
      expect(item.highestBid).to.equal(0);
      expect(item.highestBidder).to.equal(ethers.constants.AddressZero);
      expect(item.active).to.equal(true);
    }
  });

  it("Should allow bidding on an item", async function () {
    await multiItemAuction2.connect(bidder1).bid(1, { value: ethers.utils.parseEther("0.1") });

    const item = await multiItemAuction2.items(1);
    expect(item.highestBid).to.equal(ethers.utils.parseEther("0.1"));
    expect(item.highestBidder).to.equal(bidder1.address);
  });

  it("Should not allow bidding below starting bid", async function () {
    await expect(multiItemAuction2.connect(bidder1).bid(1, { value: ethers.utils.parseEther("0.05") })).to.be.revertedWith(
      "Bid must be equal or higher than the item's starting bid."
    );
  });

  it("Should not allow bidding after auction end", async function () {
    await ethers.provider.send("evm_increaseTime", [601]); // Increase time by 601 seconds
    await ethers.provider.send("evm_mine");

    await expect(multiItemAuction2.connect(bidder1).bid(1, { value: ethers.utils.parseEther("0.1") })).to.be.revertedWith(
      "Auction already ended."
    );
  });

  it("Should allow withdrawing pending returns", async function () {
    await multiItemAuction2.connect(bidder1).bid(1, { value: ethers.utils.parseEther("0.1") });
    await multiItemAuction2.connect(bidder2).bid(1, { value: ethers.utils.parseEther("0.2") });

    expect(await multiItemAuction2.withdraw(1, { from: bidder1.address })).to.emit(multiItemAuction2, "Withdrawn").withArgs(bidder1.address, ethers.utils.parseEther("0.1"));
  });

  it("Should end auction and transfer funds to auctioneer", async function () {
    await multiItemAuction2.connect(bidder1).bid(1, { value: ethers.utils.parseEther("0.1") });

    await ethers.provider.send("evm_increaseTime", [601]); // Increase time by 601 seconds
    await ethers.provider.send("evm_mine");

    const auctioneerInitialBalance = await ethers.provider.getBalance(auctioneer.address);

    await multiItemAuction2.connect(auctioneer).endAuction(1);

    const item = await multiItemAuction2.items(1);
    expect(item.active).to.equal(false);

    const auctioneerFinalBalance = await ethers.provider.getBalance(auctioneer.address);
    expect(auctioneerFinalBalance.sub(auctioneerInitialBalance)).to.equal(ethers.utils.parseEther("0.1"));
  });

  it("Should not allow ending auction by non-auctioneer", async function () {
    await ethers.provider.send("evm_increaseTime", [601]); // Increase time by 601 seconds
    await ethers.provider.send("evm_mine");

    await expect(multiItemAuction2.connect(bidder1).endAuction(1)).to.be.revertedWith("Only the auctioneer can end the auction.");
  });

  it("Should not allow ending auction before auction end time", async function () {
    await expect(multiItemAuction2.connect(auctioneer).endAuction(1)).to.be.revertedWith("Auction not yet ended.");
  });
});