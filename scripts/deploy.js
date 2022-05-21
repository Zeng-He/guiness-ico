const { ethers } = require("hardhat");

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contracts to deploy
  const TOTAL_AMOUNT_OF_GUINESS = process.env.INITIAL_TOKENS;
  const Guiness = await hre.ethers.getContractFactory("GuinessToken");
  const guiness = await Guiness.deploy("Guiness", "GNS", TOTAL_AMOUNT_OF_GUINESS);

  const GuinessKyc = await hre.ethers.getContractFactory("GuinessKyc");
  const guinessKyc = await GuinessKyc.deploy();

  const GuinessSale = await hre.ethers.getContractFactory("GuinessSale");
  const guinessSale = await GuinessSale.deploy(1, deployer.address, guiness.address, guinessKyc.address);

  await guiness.deployed();
  await guinessKyc.deployed();
  await guinessSale.deployed();

  console.log("Guiness deployed to:", guiness.address);
  console.log("GuinessKyc deployed to:", guinessKyc.address);
  console.log("GuinessSale deployed to:", guinessSale.address);

  console.log("GuinessSale balance", await guiness.balanceOf(guinessSale.address));
  console.log("Deployer balance", await guiness.balanceOf(deployer.address));
  console.log("Tranfering the Guiness...");
  await guiness.transfer(guinessSale.address, TOTAL_AMOUNT_OF_GUINESS);
  console.log("GuinessSale balance", await guiness.balanceOf(guinessSale.address));
  console.log("Deployer balance", await guiness.balanceOf(deployer.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
