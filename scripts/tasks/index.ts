import { task } from "hardhat/config";
import { accounts } from "./accounts"
import { balance } from "./balance"
import { node } from './node'
import { verify } from './verify'

task("node", "Start the local Conflux development node").setAction(node);

task("accounts", "Show the available accounts").setAction(accounts);

task("balance", "Show the balance for the configured networks").setAction(balance);

task("verify", "Verify the deployed contract")
  .addParam("contract", "The name of the contract to verify")
  .addParam("address", "The address of the deployed contract")
  .addOptionalParam("constructorArgs", "The constructor arguments used in deployment (if any)")
  .setAction(verify);
