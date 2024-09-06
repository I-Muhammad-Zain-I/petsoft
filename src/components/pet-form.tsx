"use client";
import React, { FormEvent } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { usePetContext } from "@/lib/hooks";
import { PetType } from "../../types";
import dogAvatar from "../../public/dogAvatar.svg";

type Props = {
  actionType: "add" | "edit";
};

const PetForm = ({ actionType }: Props) => {
  const { handleAddPet } = usePetContext();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(event.currentTarget);

    const newPet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl: (formData.get("imageUrl") as string) || dogAvatar.src,
      age: parseInt(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };
    handleAddPet(newPet);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" name="ownerName" type="text" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" name="imageUrl" type="text" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" name="age" type="number" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} required />
        </div>
      </div>
      <Button className="mt-5 self-end" type="submit">
        {actionType === "add" ? "Add a new pet" : "Edit pet details"}
      </Button>
    </form>
  );
};

export default PetForm;