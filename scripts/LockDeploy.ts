import hre from "hardhat";
import { parseCFX } from "cive";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = parseCFX("0.001");

async function main() {
  const lock = await hre.cive.deployContract("Lock" as any, [JAN_1ST_2030], {
    value: ONE_GWEI,
  });
  console.log("Lock address:", lock.address) 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
