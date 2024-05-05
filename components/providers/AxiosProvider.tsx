"use client"

import { createContext, useContext } from "react";
import { useAuth } from "./AuthProvider";
import axios, { AxiosInstance } from "axios";

interface AxiosContextType {
    axiosIWAuth: AxiosInstance;
    axiosIWAuth4Upload: AxiosInstance;
}

const AxiosContext = createContext<AxiosContextType | null>(null);

function AxiosProvider({ children }: { children: React.ReactNode }) {

    const { userToken, user } = useAuth();

    const axiosConfig = {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
        headers: {
            'Content-Type': 'application/json',
            ...((!!user || !!userToken) && { 'Authorization': `Bearer ${userToken || (user && user.token)}` }),
        },
    };

    const axiosConfig4Upload = {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
        headers: {
            'Content-Type': 'multipart/form-data',
            ...((!!user || !!userToken) && { 'Authorization': `Bearer ${userToken || (user && user.token)}` }),
        },
    };

    const axiosIWAuth: AxiosInstance = axios.create(axiosConfig);
    const axiosIWAuth4Upload: AxiosInstance = axios.create(axiosConfig4Upload);


    return (
        <AxiosContext.Provider value={{
            axiosIWAuth,
            axiosIWAuth4Upload,
        }}>
            {children}
        </AxiosContext.Provider>
    );
}

export default AxiosProvider;

export const useAxios = () => {
    const context = useContext(AxiosContext);
    if (!context) {
        throw new Error('useAxios must be used within an AxiosProvider');
    }
    return context;
}