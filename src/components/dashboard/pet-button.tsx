"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import PetForm from "./pet-form";

type Props = {
  actionType: "add" | "edit" | "checkout";
  children?: string;
  disabled?: boolean;
  onClick: () => void;
};

const PetButton = ({
  children,
  actionType,
  disabled = false,
  onClick,
}: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === "checkout") {
    return (
      <Button variant={"secondary"} onClick={onClick} disabled={disabled}>
        {children}
      </Button>
    );
  }

  // if (actionType === "edit" || actionType === "add")

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        {actionType === "add" ? (
          <Button size={"icon"} onClick={onClick}>
            <PlusIcon className="w-6 h-6" />
          </Button>
        ) : (
          <Button variant={"secondary"} onClick={onClick}>
            {children}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "add" ? "Add a new pet" : "Edit pet details"}
          </DialogTitle>
        </DialogHeader>
        <PetForm
          actionType={actionType}
          onFormSubmission={() => setIsFormOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );

  return <p>No button variant choosen</p>;
};

export default PetButton;
