require("dotenv").config();
const cli = require("@aptos-labs/ts-sdk/dist/common/cli/index.js");
const aptosSDK = require("@aptos-labs/ts-sdk");

async function compile() {

  if (!process.env.MODULE_PUBLISHER_ACCOUNT_ADDRESS) {
    throw new Error(
      "MODULE_PUBLISHER_ACCOUNT_ADDRESS variable is not set, make sure you have set the publisher account address",
    );
  }

  const move = new cli.Move();

  await move.compile({
    packageDirectoryPath: "contract",
    namedAddresses: {
      // Compile module with account address
      aptos_share: process.env.MODULE_PUBLISHER_ACCOUNT_ADDRESS,
    },
    extraArguments: [
      '--skip-fetch-latest-git-deps',
    ],
  });
}
compile();
