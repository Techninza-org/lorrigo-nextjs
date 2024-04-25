"use client";

import axios, { AxiosInstance } from "axios";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { AuthType } from "@/types/types";

import { useToast } from "@/components/ui/use-toast";
import { useOrigin } from "@/hooks/use-origin";


interface AuthContextType {
    user: AuthType | null;
    userToken: string;
    loading: boolean;
    handleUserSignup: (formData: FormData) => void;
    handleUserLogin: (formData: FormData) => void;
    handleSignOut: () => void;
    handleForgetPassword: (formData: FormData) => void;
    handleResetPassword: (formData: FormData, token: string) => void;

}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const router = useRouter()
    const origin = useOrigin();

    const [user, setUser] = useState<AuthType | null>(null);
    const [userToken, setUserToken] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const userC = getCookie('user');
        if (userC) {
            const userData = JSON.parse(userC);
            setUser(userData);
            setUserToken(userData.token);
        }
    }, []);

    const axiosConfig = {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const axiosWOAuth: AxiosInstance = axios.create({
        ...axiosConfig,
        headers: {
            ...axiosConfig.headers,
        },
    });


    const handleUserSignup = async (formData: FormData) => {
        try {
            const name = formData.get("name")?.toString() || "";
            const email = formData.get("email")?.toString() || "";
            const password = formData.get("password")?.toString() || "";

            if (!name || name.toString().length <= 2 || !email || !email.toString().includes("@") || !password) {
                return toast({
                    variant: "destructive",
                    title: "Signup Error",
                    description: "Please enter valid details for all fields.",
                });
            }

            const userData = {
                name,
                email,
                password
            };

            const response = await axiosWOAuth.post("/auth/signup", userData)

            if (response.data.user) {
                setLoading(true);
                toast({
                    title: "Success",
                    description: "Signup successfully.",
                });
                return router.push("/login");
            } else if (response.data.message === "user already exists") {
                return toast({
                    variant: "destructive",
                    title: "Signup Error",
                    description: "User already exists.",
                });
            }
        } catch (error) {
            return toast({
                variant: "destructive",
                title: "Signup Error",
                description: "An error occurred during signup.",
            });
        }
    };

    const handleUserLogin = async (formData: FormData) => {
        try {
            const email = formData.get("email")?.toString() || "";
            const password = formData.get("password")?.toString() || "";

            if (!email.includes("@") || !password) {
                return toast({
                    variant: "destructive",
                    title: "Invalid email or password.",
                });
            }

            const userCred = {
                email: email,
                password: password,
            };

            const userRes = await axiosWOAuth.post("/auth/login", userCred);
            const userData = userRes.data;

            if (userData.user && userData.valid) {
                setUser(userData.user);

                const expiresDate = new Date();
                expiresDate.setDate(expiresDate.getDate() + 1);

                setCookie('user', userData.user, { expires: expiresDate });
                router.push("/dashboard");
                // Redirect to dashboard or perform any other action
            } else {
                return toast({
                    variant: "destructive",
                    title: "Invalid email or password.",
                });
            }
        } catch (error) {
            return toast({
                variant: "destructive",
                title: "An error occurred during login.",
            });
        }
    };

    const handleSignOut = useCallback(async () => {
        try {
            deleteCookie('user');
            setUser(null as any);
            toast({
                className: "bg-black text-white",
                title: "Success",
                description: "Logout successfully!",
            })
            router.push("/login");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
            });
        }
    }, [router, toast]);

    const handleForgetPassword = async (formData: FormData) => {
        try {
            const userData = {
                domain: origin,
                email: formData.get("email")?.toString() || ""
            };

            const response = await axiosWOAuth.post("/auth/forgot-password", userData)

            if (response.data.message === "user not found") {
                return toast({
                    variant: "destructive",
                    title: "User not found",
                    description: "Please enter a valid email address.",
                });
            } else if (response.data.valid) {
                return toast({
                    title: "Success",
                    description: "Reset link sent to your email.",
                });
            }
        } catch (error) {
            return toast({
                variant: "destructive",
                title: "An error occurred during password reset.",
            });
        }
    }

    const handleResetPassword = async (formData: FormData, token: string) => {
        try {
            const password = formData.get("password")?.toString() || "";
            const confirmPassword = formData.get("confirmPassword")?.toString() || "";

            if (password !== confirmPassword) {
                return toast({
                    variant: "destructive",
                    title: "Passwords do not match.",
                });
            }

            if (!password || !token) {
                return toast({
                    variant: "destructive",
                    title: "Invalid password or token.",
                });
            }

            const userData = {
                password,
                token
            };

            const response = await axiosWOAuth.post("/auth/reset-password", userData)

            if (response.data.message === "user not found") {
                return toast({
                    variant: "destructive",
                    title: "User not found",
                    description: "Please enter a valid email address.",
                });
            } else if (response.data.valid) {

                toast({
                    title: "Success",
                    description: "Password reset successfully.",
                });
                return router.push("/login");
            }
        } catch (error) {
            return toast({
                variant: "destructive",
                title: "An error occurred during password reset.",
            });
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                userToken,
                loading,
                handleUserSignup,
                handleUserLogin,
                handleSignOut,
                handleForgetPassword,
                handleResetPassword,

            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export function useAuth() {
    const context = useContext(AuthContext);
    if (context == undefined) {
        throw new Error("component and page must be inside the provider");
    }
    return context;
}
