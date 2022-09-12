import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
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

  async function setValidElectionWindow(urna: any): Promise<[number, number]> {
    const currentTime = await time.latest();
    const finalTime = currentTime + 500;
    await urna.setElectionWindow(currentTime, finalTime);
    return [currentTime, currentTime ];

  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { urna, manager } = await loadFixture(deployUrnaFixture);

      expect(await urna.manager()).to.equal(manager.address);
    });

    it("Should fail if the election end", async function () {
      const { urna } = await loadFixture(deployUrnaFixture);
      const [, finalTime] = await setValidElectionWindow(urna);

      await time.increaseTo(finalTime + 1000);

      await expect(urna.vote(1)).to.be.revertedWith("election has ended");
    });

    it("Should fail if the candidate dont exists", async function () {
      const { urna } = await loadFixture(deployUrnaFixture);
      await setValidElectionWindow(urna);
      await expect(urna.vote(1)).to.be.revertedWith("candidate dont exists");
    });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { urna } = await loadFixture(deployUrnaFixture);

  //       await expect(urna.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { urna, unurnaTime, otherAccount } = await loadFixture(
  //         deployUrnaFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unurnaTime);

  //       // We use urna.connect() to send a transaction from another account
  //       await expect(urna.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unurnaTime has arrived and the owner calls it", async function () {
  //       const { urna, unurnaTime } = await loadFixture(
  //         deployUrnaFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unurnaTime);

  //       await expect(urna.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { urna, unurnaTime, urnaedAmount } = await loadFixture(
  //         deployUrnaFixture
  //       );

  //       await time.increaseTo(unurnaTime);

  //       await expect(urna.withdraw())
  //         .to.emit(urna, "Withdrawal")
  //         .withArgs(urnaedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { urna, unurnaTime, urnaedAmount, owner } = await loadFixture(
  //         deployUrnaFixture
  //       );

  //       await time.increaseTo(unurnaTime);

  //       await expect(urna.withdraw()).to.changeEtherBalances(
  //         [owner, urna],
  //         [urnaedAmount, -urnaedAmount]
  //       );
  //      });
  //   });
  // });
});
