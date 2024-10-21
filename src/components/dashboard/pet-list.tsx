"use client";
import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const PetList = () => {
  const { pets, selectedPetId, handleChangeSelectedPetId } = usePetContext();

  const { searchQuery } = useSearchContext();

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery)
  );

  const selectPetHandler = (petId: string) => {
    if (petId === selectedPetId) {
      handleChangeSelectedPetId("");
    } else handleChangeSelectedPetId(petId);
  };

  const NoPetFoundContent = pets.length == 0 && (
    <EmptyPetFeedBack message={"You didn't left any pet"} />
  );

  const NoSearchResultContent = filteredPets.length == 0 && (
    <EmptyPetFeedBack message={"No Pet Found"} />
  );

  const variants = {
    initial: {
      x: "-100%",
      opacity: 0,
      height: 0,
    },
    animate: {
      x: "0%",
      opacity: 1,
      height: "auto",
    },
    exit: {
      x: "-100%",
      opacity: 0,
      height: 0,
    },
  };

  return (
    <ul className="bg-white border-b border-light w-full h-full">
      {NoPetFoundContent}
      {NoSearchResultContent}
      <AnimatePresence initial={false}>
        {filteredPets.map((pet) => (
          <motion.li
            key={pet.id}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => selectPetHandler(pet.id)}
              className={cn(
                "flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition"
              )}
              style={{
                backgroundColor: pet.id === selectedPetId ? "#EFF1F2" : "white",
              }}
            >
              <Image
                src={pet.imageUrl}
                alt="Pet Image"
                width={45}
                height={45}
                className="w-[45px] h-[45px] rounded-full object-cover"
              />
              <p className="font-semibold">{pet.name}</p>
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};

const EmptyPetFeedBack = ({ message }: { message: string }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      {message}
    </div>
  );
};

export default PetList;
