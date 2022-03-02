module.exports = async ({ getNamedAccounts, deployments }) => {
  {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log(`Deploying Workchain...`);
    log(`Deployer: ${deployer}`);

    const workchain = await deploy("Workchain", {
      from: deployer,
      log: true,
    });

    log(`The contract address is ${workchain.address}.`);

    const workchainObject = await ethers.getContractFactory("Workchain");

    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    log(`The signer is ${signer}`);
    log(`${workchainObject.inteface}`);

    const workchainContract = new ethers.Contract(
      workchain.address,
      workchainObject.interface,
      signer
    );

    const txCreateWork = await workchainContract.createWork(
      "First Contract",
      "QmSyp8sWb8wEYGcZun5GMywwSu3hsiMziJs86o8muT3G7p",
      ethers.utils.parseEther("0.1").toString(),
      { value: ethers.utils.parseEther("0.1").toString() }
    );

    const txCreateWorkReceipt = await txCreateWork.wait(1);

    log("You created a new work request");
    log(`This is the token URI ${await workchainContract.tokenURI(0)}`);
  }
};
