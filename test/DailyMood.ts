import { ethers } from 'hardhat';
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";

describe("DailyMood", function () {
    async function deployDailyMoodFixture() {
        const accounts = await ethers.getSigners();
        const ownerAddress = await accounts[0].getAddress();

        const allowedAddresses = [ownerAddress, await accounts[1].getAddress(), await accounts[2].getAddress()];

        const dailyMood = await ethers.deployContract("DailyMood", [ownerAddress, allowedAddresses]);
        await dailyMood.waitForDeployment();

        return { dailyMood, ownerAddress, allowedAddresses, accounts };
    }

    it("Should construct the right owner", async function () {
        const { dailyMood, ownerAddress } = await loadFixture(deployDailyMoodFixture);
        expect(await dailyMood.owner()).to.equal(ownerAddress);
    });

    it("Should construct the right allowed addresses", async function () {
        const { dailyMood, allowedAddresses } = await loadFixture(deployDailyMoodFixture);
        const contractAllowedAddresses = await dailyMood.getAllowedAddresses();
        for (let i = 0; i < allowedAddresses.length; i++) {
            expect(contractAllowedAddresses[i]).to.equal(allowedAddresses[i]);
        }
    });

    it("Should return the right length of allowed addresses", async function () {
        const { dailyMood, allowedAddresses } = await loadFixture(deployDailyMoodFixture);
        expect(await dailyMood.getAllowedAddressLength()).to.equal(allowedAddresses.length);
    });

    it("Should add an address to the allowed addresses by owner", async function () {
        const { dailyMood, ownerAddress, accounts } = await loadFixture(deployDailyMoodFixture);
        const allowedAddress = await accounts[3].getAddress();
        await dailyMood.addAllowedAddress(allowedAddress);
        expect(await dailyMood.isAllowedAddress(allowedAddress)).to.equal(true);
    });

    it("Should not add an address to the allowed addresses by non-owner", async function () {
        const { dailyMood, accounts } = await loadFixture(deployDailyMoodFixture);
        const allowedAddress = await accounts[3].getAddress();
        await expect(dailyMood.connect(accounts[1]).addAllowedAddress(allowedAddress)).to.be.revertedWithCustomError(dailyMood, "OwnableUnauthorizedAccount");
    });

    it("Should allow any address if null address is added", async function () {
        const { dailyMood, accounts } = await loadFixture(deployDailyMoodFixture);
        const allowedAddress = await accounts[3].getAddress();
        await dailyMood.addAllowedAddress("0x0000000000000000000000000000000000000000");
        expect(await dailyMood.isAllowedAddress(allowedAddress)).to.equal(true);
    });

    it("Should remove an address from the allowed addresses by owner", async function () {
        const { dailyMood, allowedAddresses } = await loadFixture(deployDailyMoodFixture);
        await dailyMood.removeAllowedAddress(allowedAddresses[2]);
        expect(await dailyMood.isAllowedAddress(allowedAddresses[2])).to.equal(false);
    });

    it("Should not remove an address from the allowed addresses by non-owner", async function () {
        const { dailyMood, allowedAddresses, accounts } = await loadFixture(deployDailyMoodFixture);
        await expect(dailyMood.connect(accounts[1]).removeAllowedAddress(allowedAddresses[2])).to.be.revertedWithCustomError(dailyMood, "OwnableUnauthorizedAccount");
    });

    it("Should return the right length of moods", async function () {
        const { dailyMood, ownerAddress } = await loadFixture(deployDailyMoodFixture);
        await dailyMood.pushMood("OwO");
        expect(await dailyMood.getMoodsLength(ownerAddress)).to.equal(1);
    });

    it("Should push the right mood to the right address", async function () {
        const { dailyMood, ownerAddress } = await loadFixture(deployDailyMoodFixture);
        await dailyMood.pushMood("OwO");
        await dailyMood.pushMood("UwU");
        expect((await dailyMood.getMoodByIndex(ownerAddress, 0)).mood).to.equal("OwO");
        expect((await dailyMood.getMoodByIndex(ownerAddress, 1)).mood).to.equal("UwU");
    });

    it("Should delete moods properly", async function () {
        const { dailyMood, ownerAddress } = await loadFixture(deployDailyMoodFixture);
        await dailyMood.pushMood("OwO");
        await dailyMood.removeMoods(ownerAddress);
        expect(await dailyMood.getMoodsLength(ownerAddress)).to.equal(0);
    });

    it("Should revert removeMoodByIndex if the index is out of bounds", async function () {
        const { dailyMood, ownerAddress } = await loadFixture(deployDailyMoodFixture);
        await expect(dailyMood.removeMoodByIndex(ownerAddress, 0)).to.be.revertedWith("Index out of bounds");
    });

    it("Should revert updateMoodByIndex if the index is out of bounds", async function () {
        const { dailyMood } = await loadFixture(deployDailyMoodFixture);
        await expect(dailyMood.updateMoodByIndex(0, "QwQ")).to.be.revertedWith("Index out of bounds");
    });

    it("Should update the mood properly", async function () {
        const { dailyMood, ownerAddress } = await loadFixture(deployDailyMoodFixture);
        await dailyMood.pushMood("OwO");
        await dailyMood.updateMoodByIndex(0, "QwQ");
        expect((await dailyMood.getMoodByIndex(ownerAddress, 0)).mood).to.equal("QwQ");
    });

    it("Should remove the mood properly", async function () {
        const { dailyMood, ownerAddress } = await loadFixture(deployDailyMoodFixture);
        await dailyMood.pushMood("OwO");
        await dailyMood.pushMood("UwU");
        await dailyMood.pushMood("QwQ");
        await dailyMood.removeMoodByIndex(ownerAddress, 0);
        for (let i = 0; i < 2; i++) {
            expect((await dailyMood.getMoodByIndex(ownerAddress, i)).mood).to.equal(["UwU", "QwQ"][i]);
        }
    });
});
