import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function node(
    taskArguments: unknown,
    hre: HardhatRuntimeEnvironment,
    runSuper: unknown,
): Promise<void> {
      const { spawnSync } = require('child_process');

      // Define the command and arguments      
      const command = '/usr/local/bin/deno';
      const args = [
          '--allow-env',
          '--allow-read',
          '--allow-write',
          '--allow-ffi',
          '--allow-net=127.0.0.1',
          '/opt/conflux/src/cli.ts',
          'start',
      ];
      const result = spawnSync(command, args, {
          stdio: 'inherit',
      });
      
      // Handle the result of the child process
      if (result.error) {
          console.error(`Error occurred: ${result.error.message}`);
      }
}
