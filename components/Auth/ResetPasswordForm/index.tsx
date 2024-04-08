"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SubmitButton from "../SubmitButton"
import { useAuth } from "@/components/providers/AuthProvider"

export const ResetPasswordForm = ({token}: {token: string}) => {
    const { handleResetPassword } = useAuth()

    const handleSubmit = (formData: FormData) => {
        handleResetPassword(formData, token)
    }
    return (
        <form action={handleSubmit}>
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                    />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="confirmPassword"
                        placeholder="Enter your Confirm Password"
                    />
                </div>

                <SubmitButton title={"Update Password"} />
            </div>
        </form>
    )
}