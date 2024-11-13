'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isValidPhoneNumber } from "react-phone-number-input";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { PhoneInput } from '../ui/phone-input';
import { useSellerProvider } from '../providers/SellerProvider';
import { useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import useFetchCityState from '@/hooks/use-fetch-city-state';
import { LoadingSpinner } from '../loading-spinner';
import ImageUpload from '../file-upload';
import { CardContent } from '../ui/card';
import { useAdminProvider } from '../providers/AdminProvider';

export const DisputeDetails = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { details } = data;
    console.log(details, "details");
    const orderId = details?.orderId;
    
    const {handleAcceptDispute, handleRejectDispute} = useAdminProvider();

    const isModalOpen = isOpen && type === "disputeDetails";

    const handleAccept = (id: string) => () => {
        handleAcceptDispute(id);
        onClose();
    }

    const handleReject = (id: string) => () => {
        handleRejectDispute(id);
        onClose();
    }
   
    const handleClose = () => {
        // reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 overflow-hidden max-w-2xl">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Dispute Details
                    </DialogTitle>
                </DialogHeader>
                <CardContent>
                    <div className='p-3 grid gap-3'>
                            <p>Order ID: {orderId}</p>
                            <p>AWB: {details?.awb}</p>
                            <p>Dispute Description: {details?.description}</p>
                            <div>
                                <img src={`data:image/jpeg;base64,${details?.image}`} alt="dispute" className="rounded-md shadow-md" />
                            </div>
                    </div>
                    <div className="flex justify-between">
                        <Button onClick={handleAccept(details?._id)} className="mt-4 bg-green-600">Accept</Button>
                        <Button onClick={handleReject(details?._id)} className="mt-4 bg-red-700">Reject</Button>
                    </div>
                </CardContent>
            </DialogContent>
        </Dialog>
    )
};