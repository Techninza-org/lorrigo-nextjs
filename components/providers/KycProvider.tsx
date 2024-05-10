"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSellerProvider } from "./SellerProvider";

interface KycContextType extends KycFormType {
    formData: KycFormType | null;
    setFormData: React.Dispatch<React.SetStateAction<KycFormType | null>>;
    step: number;
    setVerifyOtpOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onHandleNext: () => void;
    onHandleBack: () => void;
}

interface KycFormType {
    businessType: string;
    photoUrl: string;
    pan: string;
    verifyOtpOpen: boolean;
    document1Type: string;
    document1Feild: string;
    document1Front: string;
    document1Back: string;

    document2Type: string;
    document2Feild: string;
    document2Front: string;
    document2Back: string;

    submitted: boolean;
    verified: boolean;
}

const KycContext = createContext<KycContextType | null>(null);

function KycProvider({ children }: { children: React.ReactNode }) {
    const [formData, setFormData] = useState<KycFormType | null>(null);
    const [step, setStep] = useState(1);
    const [verifyOtpOpen, setVerifyOtpOpen] = useState(false);
    const { seller } = useSellerProvider();

    useEffect(() => {
        if (seller?.isVerified === true || seller?.kycDetails?.verified === true || seller?.kycDetails?.submitted === true) {
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
        <KycContext.Provider value={{
            formData,
            step,
            photoUrl: "",
            pan: '',
            verifyOtpOpen,
            setVerifyOtpOpen,
            onHandleNext,
            onHandleBack,
            setFormData,
            businessType: "",
            document1Type: "",
            document1Front: "",
            document1Back: "",
            document2Type: "",
            document2Front: "",
            document2Back: "",

            document1Feild: "",
            document2Feild: "",
            submitted: false,
            verified: false
        }}>
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