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
    const order = details?.orderId
    console.log(order);
    const seller = details?.sellerId;
    console.log(seller);
    
    
    
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
                            <p className='flex justify-between'><span className='font-semibold'>Client Name</span> {details?.sellerId?.name}</p>
                            <p className='flex justify-between'><span className='font-semibold'>Order ID</span> {details?._id}</p>
                            <p className='flex justify-between'><span className='font-semibold'>AWB</span> {details?.awb}</p>
                            <p className='flex justify-between'><span className='font-semibold'>Dispute Description</span> {details?.description}</p>
                            <p className='flex justify-between'><span className='font-semibold'>Order Weight</span> {order?.orderWeight}</p>
                            <p className='flex justify-between'><span className='font-semibold'>Charged Weight</span> {order?.chargedWeight}</p>
                            <p className='flex justify-between'><span className='font-semibold'>Billing Amount</span> {order?.billingAmount}</p>
                            <p className='flex justify-between'><span className='font-semibold'>Order Charges</span> {order?.orderCharges}</p>
                            <div>
                                <img src={`data:image/jpeg;base64,${details?.image}`} alt="dispute" className="rounded-md shadow-md" />
                            </div>
                    </div>
                    <div className="flex justify-between">
                        <Button onClick={() => handleAccept(details?._id)} className="mt-4 bg-green-600">Accept</Button>
                        <Button onClick={() => handleReject(details?._id)} className="mt-4 bg-red-700">Reject</Button>
                    </div>
                </CardContent>
            </DialogContent>
        </Dialog>
    )
};