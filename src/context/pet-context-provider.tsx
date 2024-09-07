"use client";
import React, { ReactNode, useState } from "react";
import { createContext } from "react";
import { PetType } from "../../types";
import { addPet } from "@/lib/actions";

type PetContextProviderProps = {
  data: PetType[] | [];
  children: ReactNode;
};

type PetContextType = {
  pets: PetType[];
  selectedPetId: string | null;
  selectedPet: PetType | undefined;
  numberOfPets: number;
  handleAddPet: (newPet: Omit<PetType, "id">) => void;
  handleEditPet: (petId: string, newPet: Omit<PetType, "id">) => void;
  handleCheckoutPet: (id: string) => void;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<PetContextType>({
  pets: [],
  selectedPetId: null,
  selectedPet: undefined,
  numberOfPets: 0,
  handleAddPet: (newPet: Omit<PetType, "id">) => {},
  handleEditPet: (petId: string, newPet: Omit<PetType, "id">) => {},
  handleCheckoutPet: (id: string) => {},
  handleChangeSelectedPetId: (id: string) => {},
});

const PetContextProvider = ({
  data: pets,
  children,
}: PetContextProviderProps) => {
  const [spets, setPets] = useState(pets);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  const handleAddPet = async (newPet: Omit<PetType, "id">) => {
    setPets((prev) => [...prev, { ...newPet, id: Date.now().toString() }]);
    await addPet(newPet);
  };

  const handleEditPet = (petId: string, newPet: Omit<PetType, "id">) => {
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          return {
            id: petId,
            ...newPet,
          };
        }
        return pet;
      })
    );
  };

  const handleCheckoutPet = (id: string) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleAddPet,
        handleEditPet,
        handleCheckoutPet,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export default PetContextProvider;
