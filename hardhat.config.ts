import type { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";
import "hardhat-gas-reporter"
import "@civex/hardhat-cive";

import "./scripts/tasks"
const deployer_account = vars.get("DEPLOYER_ACCOUNT_CORE")

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,  // Optimize for average number of contract calls
      },
      viaIR: false, // if Enabled IR-based code generation the tests will fail (TODO: fix)
      metadata: {
        bytecodeHash: "none",  // Remove metadata hash from bytecode to ensure consistent deployments
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"], // Enable storage layout for all contracts
        },
      },
    },
  },
  defaultNetwork: "hardhat",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 1000,
      },
      gasPrice: "auto",
      gas: "auto",
      allowUnlimitedContractSize: false,  // Enforce contract size limits
    },
    confluxCoreLocal: {
      url: "http://localhost:12537",
      chainId: 2030,
      accounts: [deployer_account],
      timeout: 20000,  // 20 seconds
      gasMultiplier: 1.2,  // Add 20% to gas estimation
    },
    confluxCoreTestnet: {
      url: "https://test.confluxrpc.com",
      chainId: 1,
      accounts: [deployer_account],
      timeout: 20000,
      gasMultiplier: 1.2,
    },
    confluxCore: {
      url: "https://main.confluxrpc.com",
      chainId: 1030,
      accounts: [deployer_account],
      timeout: 20000,
      gasMultiplier: 1.2,
    },
  },
  mocha: {
    timeout: 40000,  // 40 seconds for test timeout
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    excludeContracts: ['contracts/mocks/'],
  },
};

export default config;