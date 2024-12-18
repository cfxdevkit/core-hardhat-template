import { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";
import "@civex/hardhat-cive";

import "./scripts/tasks"
const deployer_mnemonic = vars.get("DEPLOYER_MNEMONIC")

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    confluxCoreLocal: {
      url: "http://localhost:12537",
      chainId: 2029,
      accounts: {
        mnemonic: deployer_mnemonic,
        path: "m/44'/503'/0'/0",
        initialIndex: 0,
        count: 10,
        passphrase: "",
      },
    },
    confluxCoreTestnet: {
      url: "https://test.confluxrpc.com",
      chainId: 1,
      accounts: {
        mnemonic: deployer_mnemonic,
        path: "m/44'/503'/0'/0",
        initialIndex: 0,
        count: 10,
        passphrase: "",
      },
    },
    confluxCore: {
      url: "https://main.confluxrpc.com",
      chainId: 1029,
      accounts: {
        mnemonic: deployer_mnemonic,
        path: "m/44'/503'/0'/0",
        initialIndex: 0,
        count: 10,
        passphrase: "",
      },
    },
  },
};


export default config;
