import { Chain, defineChain } from "viem";

const astarZkEVM: Chain = defineChain({
  id: 3_776,
  name: "Astar zkEVM",
  network: "AstarZkEVM",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.startale.com/astar-zkevm"],
    },
    public: {
      http: ["https://rpc.startale.com/astar-zkevm"],
    },
  },
  blockExplorers: {
    default: {
      name: "Astar zkEVM Explorer",
      url: "https://astar-zkevm.explorer.startale.com",
    },
  },
  contracts: {
    multicall3: {
      address: "0x36eabf148272BA81A5225C6a3637972F0EE17771",
      blockCreated: 93528,
    },
  },
  testnet: false,
});

export type NetworkConfiguration = {
  chain: Chain;
  crossmintProjectId: string;
  crossmintEnvironment: "staging" | "production";
  web3AuthNetwork: "sapphire_devnet" | "sapphire_mainnet";
};

export const networkConfiguration: NetworkConfiguration = {
  chain: astarZkEVM,
  crossmintProjectId: "25bfa4db-ee92-412b-91fc-6ddeced0d8c6",
  crossmintEnvironment: "production",
  web3AuthNetwork: "sapphire_mainnet",
};
