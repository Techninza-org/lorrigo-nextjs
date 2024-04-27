import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import AuthSideContainer from "../AuthSideContainer";
import SignupForm from "./SignupForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LorrigoLogo } from "@/components/Logos";

function Signup() {
  return (
    <div className="relative h-[800px] flex-col items-center justify-center max-w-lg mx-auto w-1/2">

      <div className="lg:p-2 relative">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 lg:max-w-lg shadow-xl rounded-md bg-white">
          <Card>
            <CardHeader className="space-y-1 w-full">
              <CardTitle className="text-2xl mx-auto"><LorrigoLogo /></CardTitle>

            </CardHeader>
            <CardContent>
              <SignupForm />
            </CardContent>
            <CardFooter>
              <div className="text-center mx-auto space-x-2">
                <p className="mt-2 text-xs text-center text-gray-700">Already have an account?
                  <Link href="/auth/login" className="text-blue-600 ml-1">
                    Login
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* <AuthSideContainer
        title="Signup"
        desc="This library has saved me countless hours of work and
          helped me deliver stunning designs to my clients faster than
          ever before."
      /> */}
    </div>
  );
}

export default Signup;
