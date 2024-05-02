'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormMessage } from '@/components/ui/form';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-model-store';
import { useSellerProvider } from '../providers/SellerProvider';
import { useHubProvider } from '../providers/HubProvider';

export const BillingAddressSchema = z.object({
    address_line_1: z.string().min(1, "Address Line 1 is required"),
    address_line_2: z.string().optional(),
    pincode: z.string().min(1, "Pincode is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    phone: z.string().min(1, "Phone is required")
})
const BillingAddressForm = () => {
    const router = useRouter();
    const { onClose } = useModal();
    const { updateBillingAddress } = useHubProvider();
    const {getCityStateFPincode} = useSellerProvider();
    const [billingCityState, setCityState] = useState({
        city: "",
        state: ""
    })

    const form = useForm({
        resolver: zodResolver(BillingAddressSchema),
        defaultValues: {
            address_line_1: '',
            address_line_2: '',
            pincode: '',
            city: '',
            state: '',
            phone: '',
        }
    });

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;

        const fetchCityState = async () => {
            if (form.watch("pincode").length > 4) {
                const cityStateRes = await getCityStateFPincode(form.watch("pincode"))

                setCityState({
                    city: cityStateRes.city,
                    state: cityStateRes.state
                })
            }
        };

        // Debouncing the function
        clearTimeout(timer);
        timer = setTimeout(fetchCityState, 500); // Adjust the delay as per your preference

        return () => clearTimeout(timer);
    }, [form.watch("pincode")])

    useEffect(() => {
        if (billingCityState) {
            form.setValue('city', billingCityState.city || '');
            form.setValue('state', billingCityState.state || '');
        }
    }, [billingCityState, form]);   

    const onSubmit = async (values: z.infer<typeof BillingAddressSchema>) => {
        try {
            updateBillingAddress(values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-y-6 gap-x-16 py-5 grid-cols-2">
                    <div className='col-span-2'>
                        <FormField
                            control={form.control}
                            name={'address_line_1'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Address Line 1 <span className='text-red-600'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm "
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <div className='col-span-2'>
                        <FormField
                            control={form.control}
                            name={'address_line_2'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Address Line 2
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <FormField
                        control={form.control}
                        name={'pincode'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Pincode <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm "
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'city'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    City <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm "
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'state'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    State <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'phone'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Phone <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <div className='flex'>
                            <Button variant={'themeButton'} type='submit' className='pr-0 mt-6'>
                                Save
                                <div className='bg-red-800 h-10 w-10 grid place-content-center rounded-r-md ml-4' ><Save /></div>
                            </Button>
                        </div>
                </div>
            </form>
        </Form>
    )
}

export default BillingAddressForm