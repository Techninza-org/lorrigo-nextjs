"use client"
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/AuthProvider";
import SubmitButton from "../SubmitButton";
import { buttonVariants } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { LorrigoLogo } from "@/components/Logos";
import { usePathname } from "next/navigation";

const LoginForm = () => {
  const { handleUserLogin, handleAdminLogin } = useAuth();
  const pathname = usePathname()
  const isAdminLogin = pathname.includes("/admin");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordType = isPasswordVisible ? "text" : "password";
  const PasswordIcon = isPasswordVisible ? Eye : EyeOff;
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl mx-auto"><LorrigoLogo /></CardTitle>
      </CardHeader>
      <CardContent>
        <form action={isAdminLogin ? handleAdminLogin : handleUserLogin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="flex w-full items-center justify-center border pr-2">
                <Input
                  id="password"
                  name="password"
                  type={passwordType}
                  placeholder="******"
                  className="border-0 focus-visible:ring-0 focus:ring-0 focus:outline-none w-full outline-none focus-visible:outline-none"
                />
                <PasswordIcon size={18} onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Link className={buttonVariants({
                variant: "link",
                size: "sm",
                className: "text-blue-600"
              })} href="/forgot-password">
                Forgot Password?
              </Link>
            </div>
            <SubmitButton title={"Login"} />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="mt-2 text-xs text-center text-gray-700">
          Dont have an account?
          <Link href="/signup">
            <span className="text-blue-600"> Sign up</span>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
