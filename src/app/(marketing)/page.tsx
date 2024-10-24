"use client";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
export default function Home() {
  return (
    <main className="bg-[#5DC9AB] min-h-screen flex flex-col-reverse xl:flex-row items-center justify-center gap-10 relative">
      <Image
        src="https://bytegrad.com/course-assets/react-nextjs/petsoft-preview.png"
        alt="Preview of Petsoft"
        width={519}
        height={472}
      />
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <Logo />
        <h1 className="text-5xl font-semibold my-6 max-w-[500px]">
          Manage your
          <span className="font-extrabold"> pet daycare</span> with ease
        </h1>
        <p className="text-2xl font-medium max-w-[600px]">
          Use PetSoft to easily keep track of pets under your care. Get lifetime
          access for $299
        </p>
        <div className="mt-10 space-x-3">
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant={"secondary"}>
            <Link href="/login">login</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
