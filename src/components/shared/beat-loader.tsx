"use client";
import React from "react";
import { motion } from "framer-motion";

const BeatLoader = () => {
  return (
    <div className="flex justify-center items-center gap-x-2">
      <CirclularBeat />
      <CirclularBeat />
      <CirclularBeat />
    </div>
  );
};

const CirclularBeat = () => {
  return (
    <motion.div
      className="w-6 h-6 bg-black/80 rounded-full"
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
