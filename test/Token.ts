import { ethers } from "hardhat";

const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();
    const all = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();
    console.log(all)
    console.log(owner.address)

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    console.log(ownerBalance)
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});