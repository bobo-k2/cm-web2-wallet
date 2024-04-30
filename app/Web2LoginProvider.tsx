"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { networkConfiguration } from "./configuration";
import { CHAIN_NAMESPACES, CustomChainConfig, IProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  CrossmintAASDK,
  Blockchain,
  EVMAAWallet,
} from "@crossmint/client-sdk-aa";
import { ethers } from "ethers";

interface Web2LoginContextType {
  loggedIn: boolean;
  email?: string;
  wallet: EVMAAWallet | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const Web2LoginContext = createContext<Web2LoginContextType | null>(null);

const clientId = process.env.NEXT_PUBLIC_W3A_CLIENT_ID || ""; // get from https://dashboard.web3auth.io

const chainConfig: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: networkConfiguration.chain.id.toString(16),
  rpcTarget: networkConfiguration.chain.rpcUrls.default.http[0],
  displayName: networkConfiguration.chain.name,
  blockExplorerUrl: networkConfiguration.chain.blockExplorers?.default.url,
  ticker: networkConfiguration.chain.nativeCurrency.symbol,
  tickerName: networkConfiguration.chain.nativeCurrency.name,
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: networkConfiguration.web3AuthNetwork,
  privateKeyProvider,
});

export function Web2LoginProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | undefined>();
  const [wallet, setWallet] = useState<EVMAAWallet | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
          setEmail(await getEmail());
        }
      } catch (error) {
        console.error(error);
      }
    };

    initWeb3Auth();
  }, []);

  const login = async (): Promise<void> => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    const email = await getEmail();
    setEmail(email);

    const ethersProvider = new ethers.providers.Web3Provider(
      web3auth.provider as IProvider
    );
    const ethSigner = ethersProvider.getSigner();
    setSigner(ethSigner);
    const wallet = await createAAWalletHelper(ethSigner, email);
    console.log(wallet);
    setWallet(wallet);

    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const logout = async (): Promise<void> => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    setWallet(null);
    setSigner(null);
  };

  const getEmail = async (): Promise<string | undefined> => {
    const userInfo = await web3auth.getUserInfo();

    return userInfo.email;
  };

  const createAAWalletHelper = async (
    signer: ethers.Signer,
    email?: string
  ) => {
    const xm = CrossmintAASDK.init({
      apiKey: process.env.NEXT_PUBLIC_CROSSMINT_API_KEY || "",
    });

    const walletInitParams = {
      signer,
    };

    return xm.getOrCreateWallet(
      { email },
      Blockchain.ASTAR_ZKEVM,
      walletInitParams
    );
  };

  return (
    <Web2LoginContext.Provider
      value={{ loggedIn, email, wallet, login, logout }}
    >
      {children}
    </Web2LoginContext.Provider>
  );
}

export const useWeb2LoginProvider = () => {
  const context = useContext(Web2LoginContext);
  if (!context) {
    throw new Error(
      "useWeb2LoginProvider must be used within a Web2LoginProvider"
    );
  }
  return context;
};
