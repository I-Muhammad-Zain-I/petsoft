import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

type FormErrorProps = {
  message: string | null;
};

const FormError = ({ message }: FormErrorProps) => {
  if (message === null) return <></>;

  return (
    <section className="bg-red-100/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-400 my-5">
      <ExclamationTriangleIcon className="w-4 h-4" />
      <span>{message}</span>
    </section>
  );
};

export default FormError;
