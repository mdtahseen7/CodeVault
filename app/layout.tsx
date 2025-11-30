import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeVault",
  description: "University Practical Manager",
};

import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "bg-slate-950")}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <div className="flex h-screen w-full overflow-hidden">
              <div className="flex flex-col flex-1 h-full overflow-hidden">
                {children}
              </div>
            </div>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
