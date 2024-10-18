"use client";
import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import PetButton from "./pet-button";

const PetList = () => {
  const { pets, selectedPetId, handleChangeSelectedPetId } = usePetContext();
  console.log("pets", pets);

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

  return (
    <ul className="bg-white border-b border-light w-full h-full">
      {NoPetFoundContent}
      {NoSearchResultContent}

      {filteredPets.map((pet) => (
        <li key={pet.id}>
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
        </li>
      ))}
    </ul>
  );
};

const EmptyPetFeedBack = ({ message }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      {message}
    </div>
  );
};

export default PetList;
