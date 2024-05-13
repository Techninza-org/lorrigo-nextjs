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
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { useSellerProvider } from '../providers/SellerProvider';
import useFetchCityState from '@/hooks/use-fetch-city-state';
import { LoadingComponent, LoadingSpinner } from '../loading-spinner';
import { PhoneInput } from '../ui/phone-input';

export const BillingAddressSchema = z.object({
    address_line_1: z.string().min(1, "Address Line 1 is required"),
    address_line_2: z.string().optional(),
    pincode: z.string().min(1, "Pincode is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    phone: z.string().min(1, "Phone is required")
})
const BillingAddressForm = () => {
    const { seller, updateBillingAddress } = useSellerProvider();

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

    const pincode = form.watch('pincode');

    const { cityState, isTyping, loading } = useFetchCityState(pincode);

    const isLoading = loading || form.formState.isSubmitting 

    useEffect(() => {
        if (seller?.billingAddress) {
            form.setValue('address_line_1', seller.billingAddress.address_line_1 || '');
            form.setValue('address_line_2', seller.billingAddress.address_line_2 || '');
            form.setValue('pincode', seller.billingAddress.pincode?.toString() || '');
            form.setValue('city', seller.billingAddress.city || '');
            form.setValue('state', seller.billingAddress.state || '');
            form.setValue('phone', seller.billingAddress.phone || '');

        }
    }, [seller?.billingAddress, form]);

    useEffect(() => {
        if (seller?.billingAddress?.city && (seller?.billingAddress?.pincode.toString() !== pincode?.toString())) {
            form.setValue('city', cityState.city);
            form.setValue('state', cityState.state);
        }
        form.setValue('city', cityState.city);
        form.setValue('state', cityState.state);

    }, [cityState.city, cityState.state, pincode]);


    const onSubmit = async (values: z.infer<typeof BillingAddressSchema>) => {
        try {
          
            await updateBillingAddress(values) 
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {form.formState.isSubmitting && <LoadingComponent />}
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
                                            disabled={isLoading}
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm "
                                            {...field}
                                        />
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
                                            disabled={isLoading}
                                            className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                            {...field}
                                        />
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
                                        disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm "
                                        {...field}
                                    />
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
                                    <div className='flex items-center rounded-md'>
                                        <Input
                                            disabled={isLoading || isTyping}
                                            className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm "
                                            {...field}
                                        />
                                        {isTyping && <LoadingSpinner />}
                                    </div>
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
                                    <div className='flex items-center rounded-md'>
                                        <Input
                                            disabled={isLoading || isTyping}
                                            className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                            {...field}
                                        />
                                        {isTyping && <LoadingSpinner />}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Contact Number
                                </FormLabel>
                                <FormControl>
                                    <PhoneInput
                                        disabled={isLoading}
                                        className="border-2 rounded-md dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        defaultCountry='IN'
                                        placeholder='Enter the contact number'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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