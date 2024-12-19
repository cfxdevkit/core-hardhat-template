import hre from "hardhat";

async function main() {
  const myToken = await hre.cive.deployContract("MyToken", [1_000_000n]);
  console.log("MyToken address:", myToken.address)
  const initialSupply = await myToken.read.totalSupply();
  console.log(`Initial supply of MyToken: ${initialSupply}`); // Initial supply of MyToken: 1000000
  const hash = await myToken.write.increaseSupply([500_000n]);
  // increaseSupply sends a tx, so we need to wait for it to be mined
  const publicClient = await hre.cive.getPublicClient();

  await publicClient.waitForTransactionReceipt({ hash });

  const newSupply = await myToken.read.getCurrentSupply();
  console.log(`New supply of MyToken: ${newSupply}`); // New supply of MyToken: 1500000
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
