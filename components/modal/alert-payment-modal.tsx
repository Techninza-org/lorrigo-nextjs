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
import { useEffect } from "react";

export const AlertPaymentModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "alert-payment";

    const handleClose = () => {
        onClose();
    }

    const handleSetItem =   () => {
        localStorage.setItem("payment-alert", "true");
    }

    useEffect(() => {
        handleSetItem();
    }, []);
    return (
        <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Pay you bill now!!!</AlertDialogTitle>
                    <AlertDialogDescription>
                        It is important to pay your bill now.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleSetItem}>Skip</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => router.push("/finance/invoice")}
                        className={buttonVariants({
                            variant: "themeNavActiveBtn",
                        })}>Pay Now</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};