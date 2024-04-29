"use client";

import { useWeb2LoginProvider } from "./Web2LoginProvider";

export default function Home() {
  const { loggedIn, email, login, logout } = useWeb2LoginProvider();

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
          </div>
        )}
      </div>
    </main>
  );
}
