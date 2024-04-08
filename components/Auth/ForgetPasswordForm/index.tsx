"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SubmitButton from "../SubmitButton"
import { useAuth } from "@/components/providers/AuthProvider"

export const ForgetPasswordForm = () => {

    const { handleForgetPassword } = useAuth()
 
    return (
        <form action={handleForgetPassword}>
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                    />
                </div>
                <div className="flex justify-end">
                    <SubmitButton title={"Send Reset Link"} />
                </div>
            </div>
        </form>
    )
}