"use client";

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
import { PhoneInput } from '../ui/phone-input';
import { useSellerProvider } from '../providers/SellerProvider';
import { useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import useFetchCityState from '@/hooks/use-fetch-city-state';

export const customerDetailsSchema = z.object({
    customerDetails: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
        address: z.string().min(1, "Address is required"),
        address2: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        city: z.string().optional(),
        pincode: z.string().min(1, "Pincode is required"),
    })
});


export const AddCustomerModal = () => {
    const { setSellerCustomerForm, sellerCustomerForm, isOrderCreated } = useSellerProvider()
    const { isOpen, onClose, type } = useModal();

    const router = useRouter();
    const { toast } = useToast();

    const isModalOpen = isOpen && type === "addCustomer";

    const form = useForm({
        resolver: zodResolver(customerDetailsSchema),
        defaultValues: {
            customerDetails: {
                name: "",
                phone: "",
                address: "",
                address2: "",
                country: "India",
                state: "",
                pincode: "",
                city: ""
            }
        }
    });

    const pincode = form.watch("customerDetails.pincode");

    const { cityState: cityStateRes } = useFetchCityState(pincode)

    useEffect(() => {
        form.setValue('customerDetails.city', cityStateRes.city)
        form.setValue('customerDetails.state', cityStateRes.state)
    }, [cityStateRes, form])

    const { formState: { errors, isSubmitting }, reset, handleSubmit } = form;
    const isLoading = isSubmitting;

    const onSubmit = async (values: z.infer<typeof customerDetailsSchema>) => {
        try {
            setSellerCustomerForm({
                ...sellerCustomerForm,
                customerForm: {
                    ...sellerCustomerForm.customerForm,
                    ...values.customerDetails
                }
            });
            toast({
                variant: "default",
                title: "Customer Added",
                description: "Customer added successfully"

            });

            if (isOrderCreated) {
                reset();
                router.refresh();
            }
            onClose();
        } catch (error) {
            console.log(error);
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
                        Add Customer Details
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AddCustomerForm

                            form={form}
                            isLoading={isLoading}
                        />
                        <DialogFooter className="px-6 py-4">
                            <Button disabled={isLoading} variant={'secondary'} type='button' onClick={() => form.reset()}>
                                Reset
                            </Button>
                            <Button variant={'themeButton'} type='submit'>
                                Add Customer
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};

export const AddCustomerForm = ({ form, isLoading }: { form: any, isLoading: boolean }) => {

    return (
        <>
            <div className="space-y-5 px-6">
                <div className='grid grid-cols-2 gap-3 '>
                    <FormField
                        control={form.control}
                        name="customerDetails.name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Customer Name <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter the customer name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customerDetails.phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Contact Number <span className='text-red-500'>*</span>
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
                </div>
                <FormField
                    control={form.control}
                    name="customerDetails.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                Address Line 1 <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="customerDetails.address2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                <div className='flex justify-between items-center'>Address Line 2 <span className='opacity-60'>Optional</span></div>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='grid grid-cols-2 gap-3'>
                    <FormField
                        control={form.control}
                        name="customerDetails.country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Country
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={true}
                                        className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter the country"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customerDetails.pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Pincode <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter the pincode"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customerDetails.state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    State
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter the state"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customerDetails.city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    City
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter the city"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

        </>
    )
}