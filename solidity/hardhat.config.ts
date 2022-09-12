import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import fs from "fs";

const mnemonic = fs.readFileSync(".secret").toString().trim();

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: {
        mnemonic,
      },
      chainId: 44787
    }
  }
};

export default config;
