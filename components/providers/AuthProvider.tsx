"use client";

import axios, { AxiosInstance } from "axios";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { AuthType } from "@/types/types";

import { useToast } from "@/components/ui/use-toast";


interface AuthContextType {
    user: AuthType | null;
    userToken: string;
    loading: boolean;
    handleUserSignup: (formData: FormData) => void;
    handleUserLogin: (formData: FormData) => void;
    handleSignOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const router = useRouter()

    const [user, setUser] = useState<AuthType | null>(null);
    const [userToken, setUserToken] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const userC = getCookie('user')
        if (userC) {
            setUserToken(JSON.parse(userC).token);
        } else {
            setUser(null);
            router.push("/login");
        }

    }, [router, user]);

    const axiosConfig = {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
        timeout: 5000,
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
                return toast({
                    title: "Success",
                    description: "Signup successfully.",
                });
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


    return (
        <AuthContext.Provider
            value={{
                user,
                userToken,
                loading,
                handleUserSignup,
                handleUserLogin,
                handleSignOut,

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
