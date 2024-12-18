import { formatEther } from 'viem'

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getPublicClient, getWalletClients } from "./utils";

export async function balance(
  taskArguments: { stop: boolean; status: boolean },
  hre: HardhatRuntimeEnvironment,
  runSuper: unknown,
) {
  const clients = await getWalletClients(hre);
  const publicClient = await getPublicClient(hre)
  let table = []
  if (clients) {
    for (let index = 0; index < clients.length; index++) {
      const address = clients[index].account.address
      const balance = formatEther(await publicClient.getBalance({
        address: address,
      }))
      table.push({
        address: address,
        balance: `${balance} CFX`
      })
    }
    console.table(table)
  } else {
    console.error("Impossible to retrive wallet clients, validate the rpc connection")
  }
}
