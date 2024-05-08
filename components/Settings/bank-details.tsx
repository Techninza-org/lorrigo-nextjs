'use client'
import React, { useEffect } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const BankDetailsSchema = z.object({
    accHolderName: z.string().min(1, "Account holder's name is required"),
    accType: z.string().min(1, "Account type is required"),
    accNumber: z.string().min(1, "Account number is required"),
    ifscNumber: z.string().min(1, "IFSC Number is required"),
})
const BankDetailsForm = () => {
    const { updateBankDetails } = useSellerProvider();
    const { seller } = useSellerProvider();

    const form = useForm({
        resolver: zodResolver(BankDetailsSchema),
        defaultValues: {
            accHolderName: '',
            accType: '',
            accNumber: '',
            ifscNumber: ''
        }
    });

    const isLoading = form.formState.isSubmitting;
    const isDisabled = !seller?.isVerified;

    useEffect(() => {
        if (seller && seller.bankDetails) {
            form.setValue('accHolderName', seller.bankDetails.accHolderName || '');
            form.setValue('accType', seller.bankDetails.accType || '');
            form.setValue('accNumber', seller.bankDetails.accNumber || '');
            form.setValue('ifscNumber', seller.bankDetails.ifscNumber || '');
        }
    }, [seller, form]);

    const onSubmit = async (values: z.infer<typeof BankDetailsSchema>) => {
        try {
            const updateBankDetailsAPI = await updateBankDetails(values);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-5 ">
                    <div className='grid grid-cols-2 gap-y-6 gap-x-28 py-5 mt-6'>
                        <FormField
                            control={form.control}
                            name={'accHolderName'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Account holder&apos;s name <span className='text-red-600'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading || isDisabled}
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name={'accType'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Account type<span className='text-red-600'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={isLoading || isDisabled}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                                >
                                                    <SelectValue
                                                        placeholder={seller?.bankDetails.accType ?? "Please select Account type"}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={'Saving'}>Saving</SelectItem>
                                                <SelectItem value={'Current'}>Current</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name={'accNumber'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Account number <span className='text-red-600'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading || isDisabled}
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name={'ifscNumber'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        IFSC number <span className='text-red-600'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading || isDisabled}
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                            {...field}
                                        />
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
                </div>
            </form>
        </Form>
    )
}

export default BankDetailsForm