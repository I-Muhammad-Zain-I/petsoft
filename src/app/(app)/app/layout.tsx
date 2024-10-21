import AppHeader from "@/components/layout/app-header";
import BackgroundPattern from "@/components/shared/background-pattern";
import AppFooter from "@/components/layout/app-footer";
import React from "react";
import PetContextProvider from "@/context/pet-context-provider";
import { Pet } from "@prisma/client";
import SearchContextProvider from "@/context/search-context-provider";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { getPetsByUserId } from "@/server/data/pet";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  const pets: Pet[] = await getPetsByUserId(session?.user.id!);

  return (
    <>
      <BackgroundPattern />
      <section className="flex flex-col max-w-[1050px] mx-auto px-5 min-h-screen">
        <AppHeader />
        <SessionProvider session={session}>
          <SearchContextProvider>
            <PetContextProvider data={pets}>{children}</PetContextProvider>
          </SearchContextProvider>
        </SessionProvider>
        <AppFooter />
      </section>
      <Toaster position="top-right" />
    </>
  );
};

export default Layout;
