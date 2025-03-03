// 'use client'

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
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { PhoneInput } from '@/components/ui/phone-input';
import { useSellerProvider } from '@/components/providers/SellerProvider';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import useFetchCityState from '@/hooks/use-fetch-city-state';
import { LoadingSpinner } from '@/components/loading-spinner';

export const B2BCustomerDetailsSchema = z.object({
    customerDetails: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().refine(isValidPhoneNumber, { message: "Phone number is required" }),
        address: z.string().min(1, "Address is required"),
        address2: z.string().optional(),
        state: z.string().min(1, "State is required"),
        country: z.string().min(1, "Country is required"),
        city: z.string().min(1, "City is required"),
        pincode: z.string().min(1, "Pincode is required"),
        gst: z.string().optional()
    })
});


export const AddB2BCustomerModal = () => {
    const { setSellerCustomerForm, sellerCustomerForm, isOrderCreated, handleCreateCustomer } = useSellerProvider()
    const { isOpen, onClose, type } = useModal();

    const router = useRouter();
    const { toast } = useToast();

    const isModalOpen = isOpen && type === "addB2BCustomer";

    const form = useForm({
        resolver: zodResolver(B2BCustomerDetailsSchema),
        defaultValues: {
            customerDetails: {
                name: "",
                phone: "",
                address: "",
                address2: "",
                country: "India",
                state: "",
                pincode: "",
                city: "",
                gst: ""
            }
        }
    });

    const pincode = form.watch("customerDetails.pincode");

    const { cityState: cityStateRes, isTyping } = useFetchCityState(pincode)

    useEffect(() => {
        form.setValue('customerDetails.city', cityStateRes.city)
        form.setValue('customerDetails.state', cityStateRes.state)
    }, [cityStateRes, form])

    const { formState: { errors, isSubmitting }, reset, handleSubmit } = form;
    const isLoading = isSubmitting;

    const onSubmit = async (values: z.infer<typeof B2BCustomerDetailsSchema>) => {
        try {
            //create customer
            handleCreateCustomer(values)


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
                        Add Customer Details
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AddCustomerForm
                            form={form}
                            isLoading={isLoading}
                            isPinLoading={isTyping}
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

export const AddCustomerForm = ({ form, isLoading, isPinLoading }: { form: any, isLoading: boolean, isPinLoading: boolean }) => {

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
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
                        name="customerDetails.state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    State
                                </FormLabel>
                                <FormControl>
                                    <div className='flex items-center bg-zinc-300/50 rounded-md pr-3'>
                                        <Input
                                            disabled={isLoading || isPinLoading}
                                            className="bg-transparent border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter the state"
                                            {...field}
                                        />
                                        {isPinLoading && <LoadingSpinner />}
                                    </div>
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
                                    <div className='flex items-center bg-zinc-300/50 rounded-md pr-3'>
                                        <Input
                                            disabled={isLoading || isPinLoading}
                                            className="bg-transparent border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter the city"
                                            {...field}
                                        />
                                        {isPinLoading && <LoadingSpinner />}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customerDetails.gst"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    GST
                                </FormLabel>
                                <FormControl>
                                    <div className='flex items-center bg-zinc-300/50 rounded-md pr-3'>
                                        <Input
                                            disabled={isLoading || isPinLoading}
                                            className="bg-transparent border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter GST number"
                                            {...field}
                                        />
                                        {isPinLoading && <LoadingSpinner />}
                                    </div>
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