import { CheckCircledIcon } from "@radix-ui/react-icons";
import React from "react";

type FormSuccessProps = {
  message: string | null;
};

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (message === null) return <></>;

  return (
    <section className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className="w-4 h-4" />
      <span>{message}</span>
    </section>
  );
};

export default FormSuccess;
