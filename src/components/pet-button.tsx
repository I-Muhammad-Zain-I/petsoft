"use client";

import React from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";

type Props = {
  actionType: "add" | "edit" | "checkout";
  children?: string;
  onClick: () => void;
};

const PetButton = ({ children, actionType, onClick }: Props) => {
  if (actionType === "checkout") {
    return (
      <Button variant={"secondary"} onClick={onClick}>
        {children}
      </Button>
    );
  }

  // if (actionType === "edit" || actionType === "add")
  return (
    <Dialog>
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
        from here..
        <PetForm actionType="add" />
      </DialogContent>
    </Dialog>
  );

  return <p>No button variant choosen</p>;
};

export default PetButton;
