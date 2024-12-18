import { task } from "hardhat/config";
import { accounts } from "./accounts"
import { balance } from "./balance"
import { node} from './node'

task("node", "Start the local Conflux development node").setAction(node);

task("accounts", "Show the available accounts").setAction(accounts);

task("balance", "Show the balance for the configured networks").setAction(balance);