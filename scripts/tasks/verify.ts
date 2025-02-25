import { HardhatRuntimeEnvironment } from "hardhat/types";

interface VerificationResponse {
  code: number;
  message: string;
  data: string;
  status?: string;
  result?: string;
}

interface TaskArguments {
  contract?: string;
  address?: string;
  constructorArgs?: string;
}

function getVerificationApiUrl(network: string): string {
  switch (network) {
    case 'confluxCoreTestnet':
      return "https://api-testnet.confluxscan.io";
    case 'confluxCore':
      return "https://api.confluxscan.io";
    default:
      throw new Error("Please use --network confluxCoreTestnet or --network confluxCore for contract verification");
  }
}

export async function verify(
  taskArguments: TaskArguments,
  hre: HardhatRuntimeEnvironment
) {
  try {
    if (!taskArguments.contract || !taskArguments.address) {
      throw new Error("Contract name and address are required. Usage: npx hardhat verify --contract MyToken --address <address> [--constructorArgs <args>]");
    }

    // Get the API URL based on the network
    const BASE_URI = getVerificationApiUrl(hre.network.name);

    // Get contract name and file path
    const contractName = taskArguments.contract;
    const contractPath = `contracts/${contractName}.sol`;
    
    // Get the build info using Hardhat's internal functions
    const buildInfo = await hre.artifacts.getBuildInfo(`${contractPath}:${contractName}`);
    if (!buildInfo) {
      throw new Error(`Build info not found for ${contractName}. Make sure the contract is compiled.`);
    }

    // Check if the contract exists in the build info
    if (!buildInfo.input.sources[contractPath]) {
      throw new Error(`Contract ${contractName} not found in ${contractPath}. Make sure the contract name and path are correct.`);
    }

    // Extract verification info from build info
    const contractSource = buildInfo.input.sources[contractPath].content;
    const compilerVersion = `v${buildInfo.solcLongVersion}` || `v${buildInfo.solcVersion}`;
    const optimizerSettings = buildInfo.input.settings.optimizer || { enabled: false, runs: 200 };
    const evmVersion = buildInfo.input.settings.evmVersion || 'paris';

    // Prepare verification request
    const formData = new URLSearchParams();
    
    // Required parameters
    formData.append('contractaddress', taskArguments.address);
    formData.append('sourceCode', contractSource);
    formData.append('codeformat', 'solidity-single-file');
    formData.append('contractname', contractName);
    formData.append('compilerversion', compilerVersion);
    formData.append('optimizationUsed', optimizerSettings.enabled ? '1' : '0');
    formData.append('runs', (optimizerSettings.runs || 200).toString());
    formData.append('licenseType', '3'); // MIT License
    formData.append('evmversion', evmVersion);
    formData.append('constructorArguements', taskArguments.constructorArgs || '');

    // Library parameters (empty but required according to swagger)
    for (let i = 1; i <= 10; i++) {
      formData.append(`libraryname${i}`, '');
      formData.append(`libraryaddress${i}`, '');
    }

    console.log(`Verifying contract on ${hre.network.name}...`);
    console.log("Sending verification request to:", `${BASE_URI}/contract/verifysourcecode`);

    // Send verification request using fetch
    const response = await fetch(`${BASE_URI}/contract/verifysourcecode`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: VerificationResponse = await response.json();

    if (data.status === '1' || data.code === 0) {
      console.log("Contract verification submitted successfully!");
      console.log("GUID:", data.data);
    } else if (data.data === 'Contract source code already verified') {
      console.log("✅ Contract is already verified on the network");
    } else {
      console.error("Verification failed:", data);
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error("Verification error:", error.message);
    } else {
      console.error("Verification error:", error);
    }
    throw error;
  }
}
