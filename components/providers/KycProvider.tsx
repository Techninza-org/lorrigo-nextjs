"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSellerProvider } from "./SellerProvider";

interface KycContextType {
    formData: KycFormType | null;
    setFormData: React.Dispatch<React.SetStateAction<KycFormType | null>>;
    step: number;
    verifyOtpOpen: boolean;
    setVerifyOtpOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onHandleNext: () => void;
    onHandleBack: () => void;
    businessType: string;
    photoUrl: Buffer | "";   
    gstin: string;
    pan: string;
    document1Front: string;
    document1Back: string;
    document2Front: string;
    document2Back: string;
    submitted: boolean;
    verified: boolean;
}

interface KycFormType {
    businessType: string;
    photoUrl: Buffer | "";
    gstin: string;
    pan: string;
    verifyOtpOpen: boolean;
    document1Front: string;
    document1Back: string;
    document2Front: string;
    document2Back: string;
    submitted: boolean;
    verified: boolean;
}

const KycContext = createContext<KycContextType | null>(null);

function KycProvider({ children }: { children: React.ReactNode }) {
    const [formData, setFormData] = useState<KycContextType | null>(null);
    const [step, setStep] = useState(1);
    const [verifyOtpOpen, setVerifyOtpOpen] = useState(false);
    const { seller } = useSellerProvider();

    useEffect(() => {
        if (seller?.kycDetails?.verified === true || seller?.kycDetails?.submitted === true) {
            setStep(4);
        }
    }, [seller]);

    function onHandleNext() {
        setStep((prev) => prev + 1);
    }

    function onHandleBack() {
        setStep((prev) => prev - 1);
    }

    return (
        <KycContext.Provider value={{ formData, step, photoUrl: "", gstin: '', pan: '', verifyOtpOpen, setVerifyOtpOpen, onHandleNext, onHandleBack, setFormData: setFormData as React.Dispatch<React.SetStateAction<KycFormType | null>>, businessType: "", document1Front: "", document1Back: "", document2Front: "", document2Back: "", submitted: false, verified: false }}>
            {children}
        </KycContext.Provider>
    );
}

export default KycProvider;

export function useKycProvider() {
    const context = useContext(KycContext);
    if (context == undefined) {
        throw new Error("component and page must be inside the provider");
    }
    return context;
}