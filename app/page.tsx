"use client";

import { useEffect, useState } from "react";
import { useWeb2LoginProvider } from "./Web2LoginProvider";
import { ethers } from "ethers";

export default function Home() {
  const { loggedIn, email, wallet, login, logout } = useWeb2LoginProvider();
  const [address, setAddress] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();

  useEffect(() => {
    if (wallet) {
      wallet.getBalance().then((balance: ethers.BigNumber) => {
        console.log(balance);
        setBalance(balance.toString());
      });
    }
  }, [wallet]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {!loggedIn && (
          <div className="cursor-pointer ml-4" onClick={login}>
            Web2 Login
          </div>
        )}
        {loggedIn && (
          <div className="cursor-pointer ml-4" onClick={logout}>
            {email} - Logout
            <br />
            Address: {address}
            <br />
            Balance: {balance}
          </div>
        )}
      </div>
    </main>
  );
}
