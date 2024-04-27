"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import SubmitButton from "../SubmitButton";
  
const SignupForm = () => {
  const formRef = useRef<HTMLFormElement>();
  const { handleUserSignup, loading } = useAuth()
  if (loading === true) {
    formRef.current?.reset();
  }
  return (
    <form action={handleUserSignup}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter Full Name"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="company@domain.com"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="******"
          />
        </div>
        <SubmitButton title={"Signup"} />
      </div>
    </form>
  );
};

export default SignupForm;
