"use client";
import React, {
  ReactNode,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { createContext } from "react";

import { addPet, deletePet, editPet } from "@/server/actions/pet-actions";
import { toast } from "sonner";
import { PetEssentials } from "../../types";
import { useSession } from "next-auth/react";
import { toastHandler } from "@/lib/utils";

type PetContextProviderProps = {
  data: PetEssentials[] | [];
  children: ReactNode;
};

type PetContextType = {
  pets: PetEssentials[];
  selectedPetId: string | null;
  selectedPet: PetEssentials | undefined;
  numberOfPets: number;
  handleAddPet: (newPet: PetEssentials) => void;
  handleEditPet: (petId: string, newPet: PetEssentials) => void;
  handleCheckoutPet: (id: string) => Promise<void>;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<PetContextType>({
  pets: [],
  selectedPetId: null,
  selectedPet: undefined,
  numberOfPets: 0,
  handleAddPet: (newPet: PetEssentials) => {},
  handleEditPet: (petId: string, newPet: PetEssentials) => {},
  handleCheckoutPet: (id: string) => new Promise(() => {}),
  handleChangeSelectedPetId: (id: string) => {},
});

const PetContextProvider = ({ data, children }: PetContextProviderProps) => {
  // const [spets, setPets] = useState(pets);
  // console.log(data);
  const { data: session } = useSession();
  console.log("data", session);

  const [isPending, startTransition] = useTransition();

  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, payload];
        case "edit":
          return state.map((pet) => {
            if (pet.id === payload.id) {
              return payload;
            }
            return pet;
          });
        case "delete":
          return state.filter((pet) => pet.id !== payload.id);
        default:
          return state;
      }
    }
  );
  // console.log(optimisticPets);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const selectedPet: PetEssentials = optimisticPets.find(
    (pet) => pet.id === selectedPetId
  );
  const numberOfPets = optimisticPets.length;

  const handleAddPet = async (newPet: PetEssentials) => {
    // setPets((prev) => [...prev, { ...newPet, id: Date.now().toString() }]);
    setOptimisticPets({ action: "add", payload: newPet });
    const response = await addPet(newPet, session?.user.id);
    toastHandler(response);
  };

  const handleEditPet = async (petId: string, newPet: PetEssentials) => {
    setOptimisticPets({ action: "edit", payload: { ...newPet, id: petId } });
    const response = await editPet(newPet, petId);
    toastHandler(response);
  };

  const handleCheckoutPet = async (id: string) => {
    startTransition(() =>
      setOptimisticPets({ action: "delete", payload: { id } })
    );

    const response = await deletePet(selectedPet!.id!);
    toastHandler(response);
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
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
