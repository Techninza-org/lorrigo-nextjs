"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { useModal } from "@/hooks/use-model-store";
import { useRouter } from "next/navigation";

export const AlertKycModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "alert-kyc";

    const handleClose = () => {
        onClose();
    }

    const handleSetItem =   () => {
        localStorage.setItem("kyc-alert", "true");
    }

    return (
        <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Complete your KYC, Now?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This is important to complete your KYC to do COD Shipments.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleSetItem}>Skip</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => router.push("/settings/company/kyc")}
                        className={buttonVariants({
                            variant: "themeNavActiveBtn",
                        })}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};