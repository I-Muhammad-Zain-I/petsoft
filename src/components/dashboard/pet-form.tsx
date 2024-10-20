"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { usePetContext } from "@/lib/hooks";
import dogAvatar from "../../../public/dogAvatar.svg";
import PetFormBtn from "./pet-form-btn";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { petFormSchema } from "@/lib/validations";
import { PetFormType } from "@/lib/validations";

type Props = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

const PetForm = ({ actionType, onFormSubmission }: Props) => {
  const { handleAddPet, handleEditPet, selectedPet } = usePetContext();

  let addDefaultValues = {
    name: "",
    ownerName: "",
    imageUrl: "",
    age: 1,
    notes: "",
  };
  let editDefaultValues = {
    name: selectedPet?.name,
    ownerName: selectedPet?.ownerName,
    imageUrl: selectedPet?.imageUrl,
    age: selectedPet?.age,
    notes: selectedPet?.notes,
  };

  const {
    register,
    formState: { errors },
    reset: resetForm,
    trigger,
    getValues,
  } = useForm<PetFormType>({
    resolver: zodResolver(petFormSchema),
    defaultValues: actionType === "add" ? addDefaultValues : editDefaultValues,
  });

  const fileTypeValidation = (value) => {
    console.log("validate invoked");
    return false;
  };

  return (
    <form
      action={async (formData) => {
        const result = await trigger();
        if (!result) return;

        onFormSubmission();
        const petData = getValues();
        petData.imageUrl = petData.imageUrl || dogAvatar.src;

        if (actionType === "add") {
          console.log("petData", petData);

          handleAddPet(petData);
        } else if (actionType === "edit") {
          handleEditPet(selectedPet!.id, petData);
        }
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register("ownerName")} />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            {...register("age", { valueAsNumber: true })}
          />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  );
};

export default PetForm;
