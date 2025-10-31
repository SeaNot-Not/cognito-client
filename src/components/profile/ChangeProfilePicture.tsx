"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/stores/useAuthStore";
import useUpdateUserForm from "@/hooks/forms/useUpdateUserForm";
import { Form } from "@/components/ui/form";
import useConfirmDialog from "../useConfirmDialog";
import { LoaderCircle } from "lucide-react";

const ChangeProfilePicture: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { updateForm, handleSubmit, onSubmit, isLoading } = useUpdateUserForm();
  const [previewUrl, setPreviewUrl] = useState<string>(user?.profileImage || "");
  const { openDialog, ConfirmDialog } = useConfirmDialog();

  const onConfirmUpdate = async (data: any) => {
    const confirmed = await openDialog(
      "Confirm Update",
      "Are you sure you want to update your profile picture?",
    );
    if (confirmed) {
      await onSubmit(data);
    }
  };
  return (
    <Form {...updateForm}>
      <form onSubmit={handleSubmit(onConfirmUpdate)} className="flex flex-col items-center gap-5">
        <div className="flex flex-col items-center justify-center gap-2">
          <Avatar className={`border-primary size-40 border-4`}>
            <AvatarImage src={previewUrl || ""} />
            <AvatarFallback className="text-xl font-semibold">
              {user?.name?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            id="file_upload"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                updateForm.setValue("selectedProfileImage", file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
          <label
            htmlFor="file_upload"
            className="text-primary cursor-pointer text-sm font-medium hover:underline"
          >
            Upload Picture
          </label>
        </div>

        <Button type="submit" className="w-full self-end sm:w-auto" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Save Picture"}
        </Button>

        {ConfirmDialog}
      </form>
    </Form>
  );
};

export default ChangeProfilePicture;
