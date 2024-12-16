'use client'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-model-store";
import { CardContent } from '../ui/card';
import { useAdminProvider } from '../providers/AdminProvider';
import Image from "next/image";
import { useAuth } from '../providers/AuthProvider';
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export const DisputeDetails = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { details } = data;
    const order = details?.orderId
    const { user } = useAuth();
    const role = user?.role
    const isAdmin = role === 'admin'

    const [chargedWeight, setChargedWeight] = useState(details?.chargedWeight || 0);
    useEffect(() => {
        if (order) setChargedWeight(Number(order?.chargedWeight))
    }, [order, order?.chargedWeight])

    const { handleAcceptDispute, handleRejectDispute } = useAdminProvider();

    const isModalOpen = isOpen && type === "disputeDetails";

    const handleAccept = async (id: string, chargedWeight: number) => {
        await handleAcceptDispute(id, chargedWeight);
        onClose();
    }

    const handleReject = async (id: string) =>  {
        await handleRejectDispute(id);
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
                        <p className='flex justify-between'><span className='font-semibold'>Applied Order Charges</span> {details?.orderCharges}</p>
                        <p className='flex justify-between'><span className='font-semibold'>Order Weight</span> {details?.orderWeight}</p>
                        <p className='flex justify-between'><span className='font-semibold'>Charged Weight</span> {details?.chargedWeight}</p>
                        <p className='flex justify-between'><span className='font-semibold'>Forward Excess Charge</span> {details?.clientBillingId?.fwExcessCharge}</p>
                        <p className='flex justify-between'><span className='font-semibold'>Forward Charge</span> {details?.clientBillingId?.rtoCharge}</p>
                        {/* <p className='flex justify-between'><span className='font-semibold'>Forward Charge</span> {String(order?.isRTOApplicable)}</p> */}

                        <div>
                            <Image height={100} width={100} src={`data:image/jpeg;base64,${details?.image}`} alt="dispute" className="rounded-md shadow-md" />
                        </div>
                    </div>

                    {isAdmin && <div>
                        <div>
                            <Input type="number" onChange={(e) => setChargedWeight(Number(e.target.value))} value={chargedWeight} />
                        </div>
                        <div className="flex justify-between">
                            <Button type="button" onClick={() => handleAccept(details?._id, chargedWeight)} className="mt-4 bg-green-600">Accept</Button>
                            <Button type="button" onClick={() => handleReject(details?._id)} className="mt-4 bg-red-700">Reject</Button>
                        </div>
                    </div>
                    }
                </CardContent>
            </DialogContent>
        </Dialog>
    )
};