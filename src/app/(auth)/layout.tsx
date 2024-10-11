import React from "react";
import Logo from "@/components/logo";
type AuthLayoutProps = {
  children: React.ReactNode;
};

const layout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-5 justify-center items-center min-h-screen">
      {children}
    </div>
  );
};

export default layout;
