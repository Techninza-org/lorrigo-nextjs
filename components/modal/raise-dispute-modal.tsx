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

export const RaiseDisputeSchema = z.object({
    disputeDetails: z.object({
        description: z.string().min(1, "Description is required"),
        image: z.string().optional(),
        orderBoxHeight: z.string().min(1, "Height is required"),
        orderBoxWidth: z.string().min(1, "Width is required"),
        orderBoxLength: z.string().min(1, "Length is required"),
        // orderSizeUnit: z.string().min(1, "Unit is required"),
        orderWeight: z.string().min(1, "Weight is required"),
        // orderWeightUnit: z.string().min(1, "Unit is required"),
    })
});

{/* <ImageUpload
    handleClose={handleClose}
    uploadUrl="/hub/bulk-hub-upload"
    acceptFileTypes={{ "text/csv": [".csv"] }}
/> */}

export const RaiseDisputeModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { toast } = useToast();
    const {awb} = data;
    const {handleRaiseDispute} = useSellerProvider();

    const isModalOpen = isOpen && type === "raiseDisputeManage";

    const form = useForm({
        resolver: zodResolver(RaiseDisputeSchema),
        defaultValues: {
            disputeDetails: {
                description: "",
                image: "",
                orderBoxHeight: '',
                orderBoxWidth: '',
                orderBoxLength: '',
                orderSizeUnit: 'cm',
                orderWeight: '',
                orderWeightUnit: 'kg',
            }
        }
    });

    const { formState: { errors, isSubmitting }, reset, handleSubmit } = form;
    const isLoading = isSubmitting;

    const onSubmit = async (values: z.infer<typeof RaiseDisputeSchema>) => {
        try {
            console.log(values, awb, "values");

            handleRaiseDispute(awb, values.disputeDetails.description, values.disputeDetails.image ?? "", Number(values.disputeDetails.orderBoxHeight) , Number(values.disputeDetails.orderBoxWidth), Number(values.disputeDetails.orderBoxLength), Number(values.disputeDetails.orderWeight));

            onClose();
        } catch (error) {
            console.error(error);
        }
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
                        Raise Dispute
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <RaiseDisputeForm
                            form={form}
                            isLoading={isLoading}
                        />
                        <DialogFooter className="px-6 py-4">
                            <Button disabled={isLoading} variant={'secondary'} type='button' onClick={() => form.reset()}>
                                Reset
                            </Button>
                            <Button variant={'themeButton'} type='submit'>
                                Raise
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};

export const RaiseDisputeForm = ({ form, isLoading }: { form: any, isLoading: boolean }) => {

    return (
        <>
            <div className="space-y-5 px-6">
            <FormField
                control={form.control}
                name="disputeDetails.description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Description <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Enter the description"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='grid grid-cols-2 gap-4'>

            
            <FormField
                control={form.control}
                name="disputeDetails.orderBoxLength"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Length <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Length"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="disputeDetails.orderBoxWidth"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Width <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Width"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="disputeDetails.orderBoxHeight"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Height <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Height"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="disputeDetails.orderWeight"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Weight <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Weight"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
            <FormField
                control={form.control}
                name="disputeDetails.image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Image
                        </FormLabel>
                        <FormControl>
                            <ImageUpload
                                {...field}
                                handleClose={() => {}}
                                uploadUrl="/hub/bulk-hub-upload"
                                acceptFileTypes={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </>
    )
}