import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Urna", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployUrnaFixture() {
    // Contracts are deployed using the first signer/account by default
    const [manager, otherAccount] = await ethers.getSigners();

    const Urna = await ethers.getContractFactory("Urna");
    const urna = await Urna.deploy();

    return { urna, manager, otherAccount };
  }

  async function setValidElectionWindow(
    urna: any,
    baseTime?: number
  ): Promise<[number, number]> {
    const currentTime = baseTime ?? (await time.latest());
    const finalTime = currentTime + 500;
    await urna.setElectionWindow(currentTime, finalTime);
    return [currentTime, currentTime];
  }

  describe("Deployment", function () {
    it("Should set the right manager", async function () {
      const { urna, manager } = await loadFixture(deployUrnaFixture);

      expect(await urna.manager()).to.equal(manager.address);
    });
  });

  describe("Manager", function () {
    it("Should set election window", async function () {
      const { urna } = await loadFixture(deployUrnaFixture);
      await setValidElectionWindow(urna);

      const currentTime = await time.latest();

      expect(await urna.startDate()).to.be.lessThanOrEqual(currentTime);
      expect(await urna.endDate()).to.be.greaterThan(currentTime);
    });

    it("Should create candidate", async function () {
      const { urna } = await loadFixture(deployUrnaFixture);
      const currentTime = await time.latest();

      await setValidElectionWindow(urna, currentTime + 1000);

      expect(
        await urna.createCandidate(
          ethers.utils.formatBytes32String("Bolsonaro"),
          22
        )
      ).to.not.be.reverted;

      // expect(await urna.availableCandidates()).to.be.eq(1); TODO

    });

    it("Shouldn't fail if candidate already exists", async function () {
      const { urna } = await loadFixture(deployUrnaFixture);

      const currentTime = await time.latest();

      await setValidElectionWindow(urna, currentTime + 1000);

      await urna.createCandidate(
        ethers.utils.formatBytes32String("Bolsonaro"),
        22
      );

      expect(
        urna.createCandidate(ethers.utils.formatBytes32String("Bolsonaro"), 22)
      ).to.be.revertedWith("candidate already exists");
    });
  });

  describe("Voting", function () {
    it("Should fail if the election end", async function () {
      const { urna } = await loadFixture(deployUrnaFixture);
      const [, finalTime] = await setValidElectionWindow(urna);

      await time.increaseTo(finalTime + 1000);

      await expect(urna.vote(1)).to.be.revertedWith("election has ended");
    });

    it("Should fail if the candidate does not exists", async function () {
      const { urna } = await loadFixture(deployUrnaFixture);
      await setValidElectionWindow(urna);
      await expect(urna.vote(1)).to.be.revertedWith(
        "candidate does not exists"
      );
    });

    it("Should vote in a candidate", async function () {
      const { urna } = await loadFixture(deployUrnaFixture);
      const currentTime = await time.latest();

      await setValidElectionWindow(urna, currentTime + 1000);

      await urna.createCandidate(
        ethers.utils.formatBytes32String("Bolsonaro"),
        22
      );

      expect(await urna.vote(22)).to.not.be.reverted;
    });
  });
});
