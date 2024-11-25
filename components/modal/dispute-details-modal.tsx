'use client'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import { CardContent } from '../ui/card';
import { useAdminProvider } from '../providers/AdminProvider';
import Image from "next/image";
import { useAuth } from '../providers/AuthProvider';

export const DisputeDetails = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { details } = data;
    const order = details?.orderId
    const seller = details?.sellerId;

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
                                <Image height={100} width={100} src={`data:image/jpeg;base64,${details?.image}`} alt="dispute" className="rounded-md shadow-md" />
                            </div>
                    </div>
                    
                    {/* <div className="flex justify-between">
                        <Button onClick={() => handleAccept(details?._id)} className="mt-4 bg-green-600">Accept</Button>
                        <Button onClick={() => handleReject(details?._id)} className="mt-4 bg-red-700">Reject</Button>
                    </div> */}
                </CardContent>
            </DialogContent>
        </Dialog>
    )
};