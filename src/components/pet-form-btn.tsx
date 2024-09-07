import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type Props = {
  actionType: "add" | "edit";
};

const PetFormBtn = ({ actionType }: Props) => {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-5 self-end" disabled={pending} type="submit">
      {actionType === "add" ? "Add a new pet" : "Edit pet details"}
    </Button>
  );
};

export default PetFormBtn;
