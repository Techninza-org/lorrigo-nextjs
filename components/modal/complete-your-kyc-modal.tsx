'use client'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from '@/hooks/use-model-store';

const CompleteYourKyc = () => {
    const { isOpen, onClose, type } = useModal();

    const isModalOpen = isOpen && type === "completeKyc";

    const handleClose = () => {
        onClose();
    }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 overflow-hidden max-w-xl">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold">
                        COMPLETE YOUR KYC
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
  )
}

export default CompleteYourKyc