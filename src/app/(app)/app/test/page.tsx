"use client";
import BeatLoader from "@/components/shared/beat-loader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/server/actions/image-upload";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { nanoid } from "nanoid";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const fileSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const TestPage = () => {
  const [url, setUrl] = useState("");
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: null,
    },
  });
  const onSubmitHandler = async (data) => {
    console.log(File);
    console.log("Submitted");
    console.log(data);
    const formData = new FormData();
    formData.append("file", data.file[0]);

    const result = await uploadImage(formData);
    console.log("result", result);
    setUrl(result.secure_url);
    // const publicId = nanoid();
    // console.log("Public ID", publicId);

    // await uploadImage(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-1">
      <Label htmlFor="file">File</Label>
      <Input
        type="file"
        accept="image/*"
        id="file"
        {...register("file")}
        multiple={false}
      />
      <Image src={url} width={45} height={45} alt="image" />
      {errors.file && <p className="text-red-500">{errors.file.message}</p>}
      <Button type="submit">Upload</Button>
    </form>
  );
};

export default TestPage;
