import { Header } from "@/components/Layouts/header";
import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-2 dark:bg-[#020d1a]">
      <Header />

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
