"use client";

import React from "react";
import Logo from "../logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
  },
  {
    label: "Account",
    path: "/app/account",
  },
];

const AppHeader = () => {
  const activePathname = usePathname();

  const links = routes.map((route) => (
    <li key={route.path}>
      <Link
        href={route.path}
        className={cn(
          `text-white/70 rounded-sm px-2 py-1 hover:text-white focus:text-white transition`,
          {
            "bg-black/10 text-white": route.path === activePathname,
          }
        )}
      >
        {route.label}
      </Link>
    </li>
  ));

  return (
    <header className="flex justify-between items-center border-b border-white/30">
      <Logo />
      <nav>
        <ul className="flex gap-2 text-xs">{links}</ul>
      </nav>
    </header>
  );
};

export default AppHeader;
