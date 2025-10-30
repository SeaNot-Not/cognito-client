import { v4 as uuidv4 } from "uuid";
import supabase from "./supabase";

interface HandleSupabaseUploadParams {
  file: File;
  folder: string;
  allowedTypes: string[];
  maxFileSize: number;
}

interface PublicData {
  data: { publicUrl: string };
  error?: unknown;
}
const handleSupabaseUpload = async ({
  file,
  folder,
  allowedTypes,
  maxFileSize,
}: HandleSupabaseUploadParams): Promise<string> => {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const fileSize = file.size;

  if (!fileExt || !allowedTypes.includes(fileExt)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
  }

  if (fileSize > maxFileSize) {
    throw new Error(`File too large. Max size is ${(maxFileSize / (1024 * 1024)).toFixed(2)}MB.`);
  }

  const fileName = `${folder}/${uuidv4()}.${fileExt}`;

  const { data, error } = await supabase.storage.from("cognito-bucket").upload(fileName, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(`Error on uploading file: ${error.message}`);
  }

  const { data: publicData, error: urlError } = supabase.storage
    .from("cognito-bucket")
    .getPublicUrl(fileName) as PublicData;

  if (urlError || !publicData?.publicUrl) {
    throw new Error("Failed to retrieve public URL.");
  }

  return publicData.publicUrl;
};

export default handleSupabaseUpload;
