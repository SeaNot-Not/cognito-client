"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DialogContent {
  title: string;
  description: string;
}

type OpenDialogFn = (title: string, description: string) => Promise<boolean>;

const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<DialogContent>({ title: "", description: "" });
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null);

  const openDialog: OpenDialogFn = (title, description) => {
    return new Promise<boolean>((resolve) => {
      setContent({ title, description });
      setResolveCallback(() => resolve);
      setIsOpen(true);
    });
  };

  const handleClose = (result: boolean) => {
    setIsOpen(false);
    if (resolveCallback) {
      resolveCallback(result);
    }
  };

  const ConfirmDialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.title}</AlertDialogTitle>
          <AlertDialogDescription>{content.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="text-destructive-foreground"
            onClick={() => handleClose(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleClose(true)}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { openDialog, ConfirmDialog };
};

export default useConfirmDialog;
