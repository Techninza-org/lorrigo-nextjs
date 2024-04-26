"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import * as z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { isValidPhoneNumber } from 'react-phone-number-input';

import { useSellerProvider } from "../providers/SellerProvider"
import { Button } from "../ui/button"
import { CalendarIcon, Truck } from "lucide-react"
import { useModal } from "@/hooks/use-model-store"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { PhoneInput } from "../ui/phone-input";


export const ReattemptOrderSchema = z.object({
    name: z.string().min(1, "Name is required"),
    contact: z.string().refine(isValidPhoneNumber, { message: "Phone number is required" }),
    address: z.string().min(1, "Address is required"),
    rescheduleDate: z.date().refine((date) => date > new Date(), { message: "Reschedule date should be greater than today" }),
    comment: z.string().optional()
});

export const NDROrderDialog = () => {
    const { handleOrderNDR } = useSellerProvider()
    const { onClose, type, isOpen, data } = useModal();
    const { order } = data

    const isModalOpen = isOpen && type === "ndrOrder";

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    const form = useForm({
        resolver: zodResolver(ReattemptOrderSchema),
        defaultValues: {
            name: "",
            contact: "",
            address: "",
            rescheduleDate: tomorrowDate,
            comment: ""
        }
    });
    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        form.setValue('name', order?.customerDetails?.name ?? '');
        form.setValue('contact', order?.customerDetails?.phone ?? '');
        form.setValue('address', order?.customerDetails?.address ?? '');
    }, [form, order]);

    const onSubmit = async (values: z.infer<typeof ReattemptOrderSchema>) => {
        try {
            const res = await handleOrderNDR(order?._id ?? '', "re-attempt", {
                ...values
            });
            if (res) {
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        onClose();
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-screen-sm p-1">
                <DialogHeader className="pt-3 mb-0">
                    <DialogTitle className="text-center px-5 text-xl flex items-center space-x-2">
                        <Truck size={40} className="" color="red" />
                        <span>Request for Delivery Reattempt</span>
                    </DialogTitle>
                    {/* <DialogDescription className="text-center text-lg">
                        You can&apos;t undo this action.
                    </DialogDescription> */}
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <div className="grid grid-cols-2 px-6 gap-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Name <span className='text-red-500'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter the seller name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Contact <span className='text-red-500'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                disabled={isLoading}
                                                className="bg-zinc-300/10 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                defaultCountry='IN'
                                                placeholder='Enter the contact number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className='col-span-2'>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Address <span className='text-red-500'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter address"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rescheduleDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Reschedule Date <span className='text-red-500'>*</span>
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal bg-zinc-200/50",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                    mode="single"
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Comment
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter the seller name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="px-6 py-4">
                            <Button onClick={() => handleClose()} disabled={isLoading} variant={'secondary'} type='button'>
                                Cancel
                            </Button>
                            <Button disabled={isLoading} variant={'themeButton'} type='submit'>
                                Request Delivery Reattempt
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export const NDRRTODialog = () => {
    const { onClose, type, isOpen, data } = useModal();
    const { handleOrderNDR } = useSellerProvider()

    const { order } = data

    const isModalOpen = isOpen && type === "ndrRTOrder";

    const [isLoading, setIsLoading] = useState(false);

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    const handleClose = () => {
        onClose();
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="p-1">
                <DialogHeader className="pt-3 mb-0">
                    <DialogTitle className="text-center px-5 text-xl flex items-center space-x-2">
                        <Truck size={40} className="" color="red" />
                        <span>Request for RTO</span>
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        You can&apos;t undo this action.
                    </DialogDescription>
                </DialogHeader>

                <div className="container text-lg">Are you sure want to create RTO for the Order
                    <span className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center">
                        #{order?.order_reference_id}
                    </span>
                </div>

                <DialogFooter className="px-6 py-4">
                    <Button variant={"secondary"} disabled={isLoading} className="w-full" onClick={() => handleClose()} type='button'>
                        Cancel
                    </Button>
                    <Button variant={"destructive"} disabled={isLoading} className="w-full" onClick={async () => {
                        setIsLoading(true)
                        const res = await handleOrderNDR(order?._id ?? '', "return", {
                            name: order?.customerDetails?.name ?? '',
                            contact: order?.customerDetails?.phone ?? '',
                            address: order?.customerDetails?.address ?? '',
                            rescheduleDate: tomorrowDate,
                        });
                        if (res) {
                            setIsLoading(false)
                            handleClose();
                        }
                    }}>
                        Request RTO
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}