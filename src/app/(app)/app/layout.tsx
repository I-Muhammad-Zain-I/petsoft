import AppHeader from "@/components/layout/app-header";
import BackgroundPattern from "@/components/shared/background-pattern";
import AppFooter from "@/components/layout/app-footer";
import React from "react";
import PetContextProvider from "@/context/pet-context-provider";
import { Pet } from "@prisma/client";
import SearchContextProvider from "@/context/search-context-provider";
import { Toaster } from "@/components/ui/sonner";
import prisma from "@/server/config/db";

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
type Props = {};

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  console.log("session Data", session);
  // const response = await fetch(
  //   "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  // );
  // if (!response.ok) {
  //   throw new Error("Failed to fetch pets");
  // }
  // const data: Pet[] = await response.json();
  // console.log(data);
  const pets: Pet[] = await prisma?.pet.findMany({
    where: {
      userId: session?.user.id,
    },
  });
  console.log(pets);
  // const user = await prisma?.user.findUnique({

  // })

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
