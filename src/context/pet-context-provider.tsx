"use client";
import React, {
  ReactNode,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { createContext } from "react";

import {
  addPet,
  deletePet,
  editPet,
  getPetImageId,
} from "@/server/actions/pet-actions";

import { PetEssentials } from "../../types";
import { useSession } from "next-auth/react";
import { toastHandler } from "@/lib/utils";
import { replaceImage, uploadImage } from "@/server/actions/image-upload";
import {
  petFormSchemaPostUpload,
  petFormSchemaPreUpload,
} from "@/lib/validations";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";
import { z } from "zod";

type PetContextProviderProps = {
  data: PetEssentials[] | [];
  children: ReactNode;
};

type PetContextType = {
  pets: PetEssentials[];
  selectedPetId: string | null;
  selectedPet: PetEssentials | undefined;
  numberOfPets: number;
  handleAddPet: (newPet: z.infer<typeof petFormSchemaPreUpload>) => void;
  handleEditPet: (
    petId: string,
    newPet: z.infer<typeof petFormSchemaPreUpload>
  ) => void;
  handleCheckoutPet: (id: string) => Promise<void>;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<PetContextType>({
  pets: [],
  selectedPetId: null,
  selectedPet: undefined,
  numberOfPets: 0,
  handleAddPet: (newPet: z.infer<typeof petFormSchemaPreUpload>) => {},
  handleEditPet: (
    petId: string,
    newPet: z.infer<typeof petFormSchemaPreUpload>
  ) => {},
  handleCheckoutPet: (id: string) => new Promise(() => {}),
  handleChangeSelectedPetId: (id: string) => {},
});

const PetContextProvider = ({ data, children }: PetContextProviderProps) => {
  const { data: session } = useSession();
  // console.log("data", session);

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

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const selectedPet: PetEssentials = optimisticPets.find(
    (pet) => pet.id === selectedPetId
  );
  const numberOfPets = optimisticPets.length;

  const handleAddPet = async (
    petData: z.infer<typeof petFormSchemaPreUpload>
  ) => {
    const formDataImageUpload = new FormData();

    let imageUploadData = "";

    // if petData is fileList and image was uploaded
    if (petData?.image instanceof FileList && petData.image.length > 0) {
      formDataImageUpload.append("file", petData.image[0]);
      imageUploadData = await uploadImage(formDataImageUpload);
      console.log("cloud", imageUploadData);
    }

    // if image was not uploaded assign default image
    let newPet: z.infer<typeof petFormSchemaPostUpload> = {
      name: petData.name,
      ownerName: petData.ownerName,
      age: petData.age,
      notes: petData.notes,
      imageUrl: imageUploadData?.secure_url ?? DEFAULT_PET_IMAGE,
      imageId: imageUploadData?.public_id ?? null,
    };

    console.table(newPet);

    startTransition(() => {
      setOptimisticPets({ action: "add", payload: newPet });
    });

    const response = await addPet(newPet, session?.user.id);
    toastHandler(response);
    return response;
  };
  // const handleAddPet = async (newPet: PetEssentials) => {
  //   // setPets((prev) => [...prev, { ...newPet, id: Date.now().toString() }]);
  //   startTransition(() => {
  //     setOptimisticPets({ action: "add", payload: newPet });
  //   });

  //   const response = await addPet(newPet, session?.user.id);
  //   toastHandler(response);
  // };

  const handleEditPet = async (
    petId: string,
    petData: z.infer<typeof petFormSchemaPreUpload>
  ) => {
    const formDataImageUpload = new FormData();

    let imageUploadData = "";

    const imageId = await getPetImageId(petId);

    console.log("imageId in edit", imageId);

    // if petData is fileList and image was uploaded
    if (petData?.image instanceof FileList && petData.image.length > 0) {
      formDataImageUpload.append("file", petData.image[0]);
      imageUploadData = await replaceImage(formDataImageUpload, imageId);
      console.log("cloud", imageUploadData);
    }

    /**
     * cases
     * 1. default image exists, image id null
     * 2. user edit but does not provide new image
     *    - previous image may be default in which imageId will be null
     *    - previous image may be cloudinary image having string imageId
     */
    /**
     * If we have secure url then it means previous image replaced
     * if no secure url it means user didn't provide new image and previous image
     * may be default or cloudinary image. in case of default imageId will be null
     */

    let imageUrl =
      imageUploadData?.secure_url ?? (imageId ? "" : DEFAULT_PET_IMAGE);

    let checkedImageId = imageUploadData?.public_id ?? (imageId || null);

    console.log("imageUrl [context]", imageUploadData);

    let newPet: z.infer<typeof petFormSchemaPostUpload> = {
      name: petData.name,
      ownerName: petData.ownerName,
      age: petData.age,
      notes: petData.notes,
      imageUrl: imageUrl,
      imageId: checkedImageId,
    };

    setOptimisticPets({ action: "edit", payload: { ...newPet, id: petId } });

    const response = await editPet(newPet, petId);

    toastHandler(response);

    return response;
  };
  // const handleEditPet = async (petId: string, newPet: PetEssentials) => {
  //   setOptimisticPets({ action: "edit", payload: { ...newPet, id: petId } });
  //   const response = await editPet(newPet, petId);
  //   toastHandler(response);
  // };

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
