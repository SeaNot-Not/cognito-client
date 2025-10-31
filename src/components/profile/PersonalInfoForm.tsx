"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useUpdateUserForm from "@/hooks/forms/useUpdateUserForm";
import useConfirmDialog from "../useConfirmDialog";
import { LoaderCircle } from "lucide-react";

const PersonalInfoForm: React.FC = () => {
  const { updateForm, control, handleSubmit, onSubmit, isLoading } = useUpdateUserForm();
  const { openDialog, ConfirmDialog } = useConfirmDialog();

  const onConfirmUpdate = async (data: any) => {
    const confirmed = await openDialog(
      "Confirm Update",
      "Are you sure you want to save changes to your personal information?",
    );
    if (confirmed) {
      await onSubmit(data);
    }
  };
  return (
    <Form {...updateForm}>
      <form onSubmit={handleSubmit(onConfirmUpdate)} className="flex flex-col items-center gap-5">
        <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Your name" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Your age"
                    disabled={isLoading}
                    {...field}
                    {...updateForm.register("age", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full max-w-3xl">
          <FormField
            control={control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full self-end sm:w-auto" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Save Changes"}
        </Button>

        {ConfirmDialog}
      </form>
    </Form>
  );
};

export default PersonalInfoForm;
