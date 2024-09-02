import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import AppFooter from "@/components/app-footer";
import React from "react";

type Props = {};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <BackgroundPattern />
      <section className="flex flex-col max-w-[1050px] mx-auto px-5 min-h-screen">
        <AppHeader />
        {children}
        <AppFooter />
      </section>
    </>
  );
};

export default Layout;
