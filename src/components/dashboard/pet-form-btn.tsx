import React from "react";
import { Button } from "../ui/button";
import BeatLoader from "../shared/beat-loader";

type Props = {
  actionType: "add" | "edit";
  disabled?: boolean;
};

const PetFormBtn = ({ actionType, disabled = false }: Props) => {
  let content = disabled ? (
    <BeatLoader className="w-4 h-4 bg-white" />
  ) : actionType === "add" ? (
    "Add a new pet"
  ) : (
    "Edit pet details"
  );

  return (
    <Button className="mt-5 self-end" type="submit" disabled={disabled}>
      {content}
    </Button>
  );
};

export default PetFormBtn;
