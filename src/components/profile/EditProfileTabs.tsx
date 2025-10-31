"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PersonalInfoForm from "./PersonalInfoForm";
import ChangeProfilePicture from "./ChangeProfilePicture";

interface Tab {
  label: string;
  value: string;
}

const tabs: Tab[] = [
  {
    label: "Personal Info",
    value: "info",
  },
  {
    label: "Profile Picture",
    value: "picture",
  },
];

const ProfileEditTabs: React.FC = () => {
  return (
    <section className="flex h-full w-full items-center justify-center">
      <Card className="bg-background w-full max-w-xl gap-5">
        <CardHeader>
          <CardTitle className="text-primary">Edit Profile Settings</CardTitle>
          <CardDescription>Manage your personal info or profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="text-foreground!">
          <Tabs defaultValue="info" className="w-full gap-8">
            <TabsList className="bg-background grid h-fit w-full grid-cols-2 gap-2 rounded-none">
              {tabs.map(({ label, value }, index) => (
                <TabsTrigger
                  key={index}
                  value={value}
                  className="bg-background data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-primary cursor-pointer rounded-none border-b-4 transition-opacity hover:opacity-80"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="info">
              <PersonalInfoForm />
            </TabsContent>

            <TabsContent value="picture">
              <ChangeProfilePicture />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default ProfileEditTabs;
