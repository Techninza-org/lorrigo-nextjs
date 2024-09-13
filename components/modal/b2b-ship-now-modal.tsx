"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { useHubProvider } from '../providers/HubProvider';
import { useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSellerProvider } from '../providers/SellerProvider';

export const pickupAddressFormSchema = z.object({
    eway_bill_no: z.string().min(1, "E-way bill Number is required").max(50),
    invoiceNumber: z.string().min(1, "Invoice Number is required").max(50),
    pickupDateTime: z.date(),
    invoiceDate: z.date(),
})
export const B2BShipNowModal = () => {
    const { handleCreateB2BShipment } = useSellerProvider()

    const { isOpen, onClose, type, data } = useModal();
    const { toast } = useToast();

    const { form: modalData } = data;

    const router = useRouter();

    const isModalOpen = isOpen && type === "B2BShipNow";

    const form = useForm({
        resolver: zodResolver(pickupAddressFormSchema),
        defaultValues: {
            eway_bill_no: "",
            invoiceNumber: "",
            pickupDateTime: new Date(new Date().setDate(new Date().getDate() + 1)),
            invoiceDate: new Date(),
        }
    });


    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (modalData) {
            form.setValue('invoiceNumber', modalData.invoiceNumber);
        }
    }, [modalData])



    const onSubmit = async (values: z.infer<typeof pickupAddressFormSchema>) => {
        try {

            const data = {
                ...values,
                pickupDateTime: new Date(values.pickupDateTime.setHours(17, 0, 0, 0)).toISOString().slice(0, 19).replace("T", " "),
                invoiceDate: values.invoiceDate.toISOString().slice(0, 10),
            }
            const res = await handleCreateB2BShipment({
                orderId: modalData.orderId,
                carrierId: modalData.carrierId,
                carrierNickName: modalData.carrierNickName,
                charge: modalData.charge,
                ...data
            })

            // form.reset();
            // router.refresh();
            // onClose();
        } catch (error) {
            console.error(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 max-w-xl">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold">
                        B2B Ship Now
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="px-6 gap-3">
                            <div className='w-full flex gap-3 mb-3'>
                                <FormLabel className="font-bold">
                                    Transport Id: <span className='ml-1 text-red-500'>{modalData?.transportId}</span>
                                </FormLabel>
                                <FormLabel className="font-bold">
                                    Transport Name: <span className='ml-1 text-red-500'>{modalData?.transportName}</span>
                                </FormLabel>
                            </div>
                            <FormField
                                control={form.control}
                                name="invoiceDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel
                                            className=" text-xs font-bold dark:text-secondary/70"
                                        >
                                            Invoice Date<span className='text-red-500'>*</span>
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
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
                                                    disabled={(date) =>
                                                        date > new Date()
                                                    }
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
                                name="invoiceNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold">
                                            Invoice Number<span className='text-red-500'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter the invoice number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pickupDateTime"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel
                                            className=" text-xs font-bold dark:text-secondary/70"
                                        >
                                            Pickup Datetime<span className='text-red-500'>*</span>
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
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
                                                    disabled={(date) =>
                                                        date <= new Date()
                                                    }
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
                                name="eway_bill_no"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold">
                                            Eway bill<span className='text-red-500'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter the E-way bill number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="px-6 py-4">
                            <Button disabled={isLoading} variant={'themeButton'} type='submit'>
                                Ship Now
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};