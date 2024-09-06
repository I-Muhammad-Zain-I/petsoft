"use client";
import { usePetContext } from "@/lib/hooks";
import React from "react";

const Stats = () => {
  const { numberOfPets } = usePetContext();
  return (
    <section className="text-center">
      <p className="text-2xl font-bold leading-6">{numberOfPets}</p>
      <p className="opacity-80">current pets</p>
    </section>
  );
};

export default Stats;
