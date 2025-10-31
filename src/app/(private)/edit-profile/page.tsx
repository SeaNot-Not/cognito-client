import type { Metadata } from "next";
import ProfileEditTabs from "@/components/profile/EditProfileTabs";

export const metadata: Metadata = {
  title: "Cognito | Edit Profile",
};

export default function EditProfilePage() {
  return (
    <section className="flex min-h-full w-full items-center justify-center p-10">
      <ProfileEditTabs />
    </section>
  );
}
