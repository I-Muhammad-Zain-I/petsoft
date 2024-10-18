import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toastHandler(response) {
  if (response.error) {
    toast.warning(response.error);
    return;
  } else {
    toast.success(response.success);
  }
}

export { cn, sleep, toastHandler };
