import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PetSoft - Pet daycare and grooming",
  description:
    "Take responsibility for your pet's health and well-being. We offer daycare, grooming, and training services for your pet.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} text-sm text-zinc-900 bg-[#E5E8EC]`}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
