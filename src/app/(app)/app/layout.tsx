import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import AppFooter from "@/components/app-footer";
import React from "react";
import PetContextProvider from "@/context/pet-context-provider";
import { PetType } from "../../../../types";
import SearchContextProvider from "@/context/search-context-provider";

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
  // const data: PetType[] = await response.json();
  // console.log(data);
  const pets: PetType = (await prisma?.pet.findMany()) ?? [];

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
    </>
  );
};

export default Layout;
