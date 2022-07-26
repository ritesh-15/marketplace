const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },
    goerli: {
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      timeoutBlocks: 200,
      provider: () => {
        return new HDWalletProvider(
          "<account_hash>",
          "https://eth-goerli.g.alchemy.com/v2/GLG1-8dnFvbgXXcsusfqXJNsQPhiv9WY"
        );
      },
      network_id: 5,
    },
  },

  mocha: {},

  compilers: {
    solc: {
      version: "0.8.15",
    },
  },
};
