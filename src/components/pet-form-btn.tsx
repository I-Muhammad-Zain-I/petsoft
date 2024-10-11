import React from "react";
import { Button } from "./ui/button";

type Props = {
  actionType: "add" | "edit";
};

const PetFormBtn = ({ actionType }: Props) => {
  return (
    <Button className="mt-5 self-end" type="submit">
      {actionType === "add" ? "Add a new pet" : "Edit pet details"}
    </Button>
  );
};

export default PetFormBtn;
