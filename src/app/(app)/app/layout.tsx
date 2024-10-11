import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import AppFooter from "@/components/app-footer";
import React from "react";
import PetContextProvider from "@/context/pet-context-provider";
import { Pet } from "@prisma/client";
import SearchContextProvider from "@/context/search-context-provider";
import { Toaster } from "@/components/ui/sonner";
import prisma from "@/lib/db";

type Props = {};

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // const response = await fetch(
  //   "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  // );
  // if (!response.ok) {
  //   throw new Error("Failed to fetch pets");
  // }
  // const data: Pet[] = await response.json();
  // console.log(data);
  const pets: Pet[] = await prisma?.pet.findMany();
  console.log(pets);
  // const user = await prisma?.user.findUnique({

  // })

  return (
    <>
      <BackgroundPattern />
      <section className="flex flex-col max-w-[1050px] mx-auto px-5 min-h-screen">
        <AppHeader />
        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>
        <AppFooter />
      </section>
      <Toaster position="top-right" />
    </>
  );
};

export default Layout;
