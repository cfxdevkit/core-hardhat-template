import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getWalletClients } from "./utils";

export async function accounts(
  taskArguments: { stop: boolean; status: boolean },
  hre: HardhatRuntimeEnvironment,
  runSuper: unknown,
) {
  const clients = await getWalletClients(hre);
  let table = []
  if (clients) {
    for (let index = 0; index < clients.length; index++) {
      table.push({ address: clients[index].account.address })
    }
    console.table(table)
  } else {
    console.error("Impossible to retrive wallet clients, validate the rpc connection")
  }
}

