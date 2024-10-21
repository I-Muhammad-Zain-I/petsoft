"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const BeatLoader = ({ className = "w-6 h-6" }: Props) => {
  return (
    <div className="flex justify-center items-center gap-x-2">
      <CirclularBeat className={className} />
      <CirclularBeat className={className} />
      <CirclularBeat className={className} />
    </div>
  );
};

const CirclularBeat = ({ className }: Props) => {
  return (
    <motion.div
      className={cn(className, "rounded-full")}
      initial={{
        scale: 0.5,
      }}
      animate={{
        scale: [0.5, 1, 0.5],
        opacity: [0.3, 1],
      }}
      transition={{ repeat: Infinity, duration: 2 }}
    ></motion.div>
  );
};

export default BeatLoader;
