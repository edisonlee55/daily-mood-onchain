import { ethers } from 'hardhat';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const network = await ethers.provider.getNetwork();
  const accounts = await ethers.getSigners();

  const ownerAddress = await accounts[0].getAddress();
  const allowedAddresses = ["0x0000000000000000000000000000000000000000"];

  console.log(`Deploying to network: ${network.name} (${network.chainId})`);
  console.log(`Owner address: ${ownerAddress}`);
  console.log(`Allowed addresses: ${allowedAddresses}`);

  const dailyMood = await ethers.deployContract("DailyMood", [ownerAddress, allowedAddresses], {
    deterministicDeployment: process.env.DETERMINISTIC_DEPLOYMENT || false
  });

  await dailyMood.waitForDeployment();
  console.log(`DailyMood deployed to: ${dailyMood.target}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
