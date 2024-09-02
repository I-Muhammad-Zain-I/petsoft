import React from "react";
import Image from "next/image";
import logo from "../../public/logo.svg";
import Link from "next/link";
const Logo = () => {
  return (
    <Link href="/">
      <Image src={logo} alt="Petsoft Logg" />
    </Link>
  );
};

export default Logo;
