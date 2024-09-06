import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type ContentBlockProps = {
  children: ReactNode;
  className?: string;
};

const ContentBlock = ({ children, className }: ContentBlockProps) => {
  return (
    <div
      className={cn(
        "bg-[#F7F8FA] shadow-sm rounded-md overflow-hidden h-full w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContentBlock;
