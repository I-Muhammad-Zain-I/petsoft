import Image from "next/image";
import React from "react";
import notFound from "../../public/notfound.png";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Image src={notFound} width={200} height={200} alt="sad dog image" />
        <h1 className="text-3xl">
          Please go back to where &nbsp;
          <Link
            href="/app/dashboard"
            className={
              "font-bold text-[#6cb6a1] hover:text-[#2c9679] underline underline-offset-2"
            }
          >
            Your Pet
          </Link>
          &nbsp; is.
        </h1>
      </div>
    </div>
  );
};

export default NotFound;
