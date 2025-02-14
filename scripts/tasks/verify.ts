import { HardhatRuntimeEnvironment } from "hardhat/types";
import axios from "axios";
import { base32AddressToHex } from 'cive/utils'
const BASE_URI = "https://api-testnet.confluxscan.io";

interface VerificationResponse {
  code: number;
  message: string;
  data: string;
  status?: string;
  result?: string;
}

export async function verify(
  taskArguments: { contract?: string; id?: string },
  hre: HardhatRuntimeEnvironment
) {
  try {
    // Use the exact contract source code that works
    const contractSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken {
  uint256 public totalSupply;

  constructor(uint256 _initialSupply) {
    totalSupply = _initialSupply;
  }

  function increaseSupply(uint256 _amount) public {
    require(_amount > 0, "Amount must be greater than 0");
    totalSupply += _amount;
  }

  function getCurrentSupply() public view returns (uint256) {
    return totalSupply;
  }
}`;

    // Prepare verification request with exact known working parameters
    const formData = new URLSearchParams();
    // Required parameters
    formData.append('contractaddress', base32AddressToHex({address: 'cfxtest:acf1pgpsba74g31ktb3ycuv5egerc1mspuh7694akr'}));
    formData.append('sourceCode', contractSource);
    formData.append('codeformat', 'solidity-single-file');
    formData.append('contractname', 'MyToken');
    formData.append('compilerversion', 'v0.8.28+commit.7893614a');
    formData.append('optimizationUsed', '1');
    formData.append('runs', '200');
    formData.append('licenseType', '3');
    formData.append('evmversion', 'constantinople');
    formData.append('constructorArguements', ''); // Empty but required

    // Library parameters (empty but required according to swagger)
    for (let i = 1; i <= 10; i++) {
      formData.append(`libraryname${i}`, '');
      formData.append(`libraryaddress${i}`, '');
    }

    console.log("Sending verification request to:", `${BASE_URI}/contract/verifysourcecode`);
    console.log("Request body:", Object.fromEntries(formData));

    // Send verification request
    const response = await axios.post<VerificationResponse>(
      `${BASE_URI}/contract/verifysourcecode`,
      formData,
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { data } = response;
    console.log("Raw response:", response.data);

    if (data.status === '1' || data.code === 0) {
      console.log("Contract verification submitted successfully!");
      console.log("GUID:", data.result);
    } else {
      console.error("Verification failed:", data.message || data.data);
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Verification error:", error.response?.data || error.message);
      console.error("Full error:", error.response);
    } else {
      console.error("Verification error:", error);
    }
    throw error;
  }
}
