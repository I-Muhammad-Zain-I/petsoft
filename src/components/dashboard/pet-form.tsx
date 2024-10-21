"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { usePetContext } from "@/lib/hooks";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petFormSchemaPreUpload } from "@/lib/validations";
import { PetFormType } from "@/lib/validations";
import { sleep } from "@/lib/utils";

type Props = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

const PetForm = ({ actionType, onFormSubmission }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleAddPet, handleEditPet, selectedPet } = usePetContext();

  let addDefaultValues = {
    name: "",
    ownerName: "",
    image: undefined,
    age: 1,
    notes: "",
  };
  let editDefaultValues = {
    name: selectedPet?.name,
    ownerName: selectedPet?.ownerName,
    image: undefined,
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
    resolver: zodResolver(petFormSchemaPreUpload),
    defaultValues: actionType === "add" ? addDefaultValues : editDefaultValues,
  });

  return (
    <form
      action={async () => {
        const result = await trigger();
        if (!result) return;

        setIsSubmitting(true);

        const petData = getValues();

        if (actionType === "add") await handleAddPet(petData);
        else await handleEditPet(selectedPet!.id, petData);

        sleep(2000);

        setIsSubmitting(false);

        onFormSubmission();
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
          <Label htmlFor="file">Image File</Label>
          <Input
            type="file"
            accept="image/*"
            id="file"
            {...register("image")}
            multiple={false}
            required={false}
          />
          {errors.image && (
            <p className="text-red-500">{errors.image.message}</p>
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
      <PetFormBtn actionType={actionType} disabled={isSubmitting} />
    </form>
  );
};

export default PetForm;

/**
 * 
 *   const result = await trigger();
        console.log("result", result);
        console.log("formData");
        if (!result) return;

        onFormSubmission();
        const petData = getValues();
        console.log("petData", petData);
        const formData = new FormData();

        // for (let field in petData) {
        //   // Check if the field is 'image' (or your specific file input field name)
        //   if (field === "image" && petData.image instanceof FileList) {
        //     if (petData.image.length > 0) {
        //       // Append the first file if it exists
        //       formData.append(field, petData.image[0]);
        //     }
        //   } else {
        //     // For other fields, append the value directly
        //     formData.append(field, petData[field]);
        //   }
        // }

        // console.log("formData", formData);
        // // retrieve fields from formData
        // const data = Object.fromEntries(formData.entries());
        // console.log("data", data);

        const formDataImageUpload = new FormData();
        if (typeof petData.image !== "string" && petData?.image) {
          if (petData.image.length > 0) {
            formDataImageUpload.append("file", petData.image[0]);
          } else {
            handleAddPet({
              name: petData.name,
              ownerName: petData.ownerName,
              age: petData.age,
              notes: petData.notes,
              imageUrl: dogAvatar.src,
            });
          }
        }

        const imageUploadData = await uploadImage(formDataImageUpload);

        const petDataPostUpload = {
          name: petData.name,
          ownerName: petData.ownerName,
          age: petData.age,
          notes: petData.notes,
          imageUrl: imageUploadData.secure_url || dogAvatar.src,
        };
        console.log("petDataPostUpload", petDataPostUpload);

        if (actionType === "add") {
          // console.log("petData", petData);
          handleAddPet(petDataPostUpload);
        } else if (actionType === "edit") {
          // handleEditPet(selectedPet!.id, petData);
        }
 */
