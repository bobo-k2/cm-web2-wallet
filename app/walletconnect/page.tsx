"use client";

import {
  CrossmintWalletConnect,
  WalletConnectEVMAAWallet,
} from "@crossmint/client-sdk-walletconnect";
import "@crossmint/client-sdk-walletconnect/index.css";
import { useWeb2LoginProvider } from "../Web2LoginProvider";
import { EVMAAWallet } from "@crossmint/client-sdk-aa";

export default function WalletConnectPage() {
  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "";
  const { wallet, login } = useWeb2LoginProvider();
  console.log(wallet);

  return (
    <div>
      <div onClick={login}>Login</div>
      <CrossmintWalletConnect
        wcProjectId={projectId}
        uiConfig={{
          metadata: {
            name: "Yoki",
            description: "Yoki Web3 Wallet",
            url: "https://yoki.astar.network",
            icon: "https://yoki.astar.network/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_with_leaves.c9508d1f.webp&w=3840&q=75",
          },
        }}
        wallets={[new WalletConnectEVMAAWallet(wallet as EVMAAWallet)]}
      />
    </div>
  );
}
