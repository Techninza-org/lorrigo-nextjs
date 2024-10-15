import Link from "next/link";
import AuthSideContainer from "../AuthSideContainer";
import LoginForm from "./LoginForm";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="relative h-[800px] flex-col items-center justify-center max-w-lg mx-auto w-full">
      {/* <AuthSideContainer
        title="Login"
        desc="This library has saved me countless hours of work and
          helped me deliver stunning designs to my clients faster than
          ever before."
      /> */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 lg:max-w-lg shadow-xl rounded-md bg-white">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
