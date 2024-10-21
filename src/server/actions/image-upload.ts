"use server";

import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (formData: FormData) => {
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "petSoft-gallery",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
  return result;
};

const replaceImage = async (formData: FormData, imageId: string | null) => {
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  let result;

  if (imageId) {
    result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(imageId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
    console.log("delete result", result);
  }

  const response = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "petSoft-gallery",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
  console.log("upload result", response);

  return response;
};

export { uploadImage, replaceImage };
