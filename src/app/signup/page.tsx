import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Cognito | Signup",
};

const SignupPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-10">
      <section className="flex h-full w-full max-w-sm items-center justify-center lg:max-w-7xl">
        <SignupForm />
      </section>
    </main>
  );
};

export default SignupPage;
