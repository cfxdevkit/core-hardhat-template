import { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";
import "@civex/hardhat-cive";

import "./scripts/tasks"
const deployer_account = vars.get("DEPLOYER_ACCOUNT_CORE")

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    confluxCoreLocal: {
      url: "http://localhost:12537",
      chainId: 2029,
      accounts: [deployer_account]
    },
    confluxCoreTestnet: {
      url: "https://test.confluxrpc.com",
      chainId: 1,
      accounts: [deployer_account]

    },
    confluxCore: {
      url: "https://main.confluxrpc.com",
      chainId: 1029,
      accounts: [deployer_account]
    },
  },
};

export default config;
