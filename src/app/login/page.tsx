import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Cognito | Login",
};

const LoginPage: React.FC = () => {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center p-5 sm:p-0">
        <div className="w-full max-w-sm text-center">
          <LoginForm />
        </div>
      </section>

      <section className="bg-primary relative hidden items-center justify-center lg:flex">
        <Logo className="size-72" />
      </section>
    </main>
  );
};

export default LoginPage;
