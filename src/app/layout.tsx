import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Nav } from "@/components/layout/nav";
import { auth } from "@/server/auth";

export const metadata: Metadata = {
  title: "Cook Memory",
  description: "Mon carnet de recettes personnel",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="fr" className={`${geist.variable}`}>
      <body className="bg-gray-50">
        <TRPCReactProvider>
          {session && <Nav />}
          <main className={session ? "pb-16 md:pl-56 md:pb-0" : ""}>
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}