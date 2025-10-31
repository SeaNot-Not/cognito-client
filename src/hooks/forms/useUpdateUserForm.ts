"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserFormValues } from "@/schemas/updateUserSchema";
import { toast } from "react-hot-toast";
import handleSupabaseUpload from "@/lib/handleSupabaseUpload";
import useUpdateUserMutation from "@/hooks/mutations/useUpdateUserMutation";
import useAuthStore from "@/hooks/stores/useAuthStore";

const useUpdateUserForm = () => {
  const user = useAuthStore((s) => s.user);
  const setLogin = useAuthStore((s) => s.login);
  const { mutate, isPending } = useUpdateUserMutation();

  const updateForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    mode: "onTouched",
    defaultValues: {
      name: user?.name || "",
      age: user?.age || 18,
      bio: user?.bio || "",
      selectedProfileImage: undefined,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = updateForm;

  const onSubmit = async (data: UpdateUserFormValues) => {
    const { name, age, bio, selectedProfileImage } = data;

    let profileImage = user?.profileImage;

    try {
      if (selectedProfileImage instanceof File) {
        profileImage = await handleSupabaseUpload({
          file: selectedProfileImage,
          folder: "profile_pictures",
          allowedTypes: ["jpg", "jpeg", "png", "webp"],
          maxFileSize: 5 * 1024 * 1024, // 5MB
        });
      }

      mutate(
        { name, age, bio, profileImage },
        {
          onSuccess: (res) => {
            const updated = res?.data;
            if (updated) setLogin({ ...(user as any), ...updated });
            toast.success("Profile updated successfully!", { duration: 4000 });
            reset(updated);
          },
          onError: (err: any) => {
            toast.error(err?.message || "Failed to update profile.", { duration: 4000 });
          },
        },
      );
    } catch (error: any) {
      toast.error(error?.message || "Upload failed. Please try again.", { duration: 4000 });
    }
  };

  const isLoading = isPending || isSubmitting;

  return {
    updateForm,
    register,
    control,
    handleSubmit,
    onSubmit,
    isLoading,
  };
};

export default useUpdateUserForm;
