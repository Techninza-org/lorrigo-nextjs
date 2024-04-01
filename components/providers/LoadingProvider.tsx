"use client"

import { useEffect, useState, ReactNode } from "react";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';


export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            {children}
            <ProgressBar
                height="3px"
                color="#be0c34"
                options={{ showSpinner: false}}
            />

        </>
    );
};
