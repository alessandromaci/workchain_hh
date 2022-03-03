const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Workchain", async function () {
  it("Should return the owner of the NFT after being created", async function () {
    const Workchain = await ethers.getContractFactory("Workchain");
    const workchain = await Workchain.deploy();
    await workchain.deployed();

    const accounts = await hre.ethers.getSigners();
    const signer1 = accounts[0].address;
    const signer2 = accounts[1].address;
    const txCreateWork = await workchain.createWork(
      "First Contract",
      "QmSyp8sWb8wEYGcZun5GMywwSu3hsiMziJs86o8muT3G7p",
      ethers.utils.parseEther("0.1").toString(),
      { value: ethers.utils.parseEther("0.1").toString() }
    );

    // wait until the transaction is mined
    await txCreateWork.wait();

    expect(await workchain.ownerOf(0)).to.equal(signer1);
  });

  it("Should return the new owner after requesting NFT work", async function () {
    const Workchain = await ethers.getContractFactory("Workchain");
    const workchain = await Workchain.deploy();
    await workchain.deployed();

    const accounts = await hre.ethers.getSigners();
    const signer2Address = accounts[1].address;
    const signer2 = accounts[1];

    const txCreateWork = await workchain.createWork(
      "First Contract",
      "QmSyp8sWb8wEYGcZun5GMywwSu3hsiMziJs86o8muT3G7p",
      ethers.utils.parseEther("0.1").toString(),
      { value: ethers.utils.parseEther("0.1").toString() }
    );

    // wait until the transaction is mined
    await txCreateWork.wait();

    const workchainSigner2 = new ethers.Contract(
      workchain.address,
      Workchain.interface,
      signer2
    );

    const txRequestWork = await workchainSigner2.requestWork(0);

    // wait until the transaction is mined
    await txRequestWork.wait();

    expect(await workchain.ownerOf(0)).to.equal(signer2Address);
    expect(await workchain.workIdStatus(0)).to.equal(1);
  });
});
