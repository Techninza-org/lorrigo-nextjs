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
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { useHubProvider } from '../providers/HubProvider';
import { useSellerProvider } from '../providers/SellerProvider';
import { useModal } from '@/hooks/use-model-store';

export const BankDetailsSchema = z.object({
    accHolderName: z.string().min(1, "Account holder's name is required"),
    accType: z.string().min(1, "Account type is required"),
    accNumber: z.string().min(1, "Account number is required"),
    ifscNumber: z.string().min(1, "IFSC Number is required"),
})
const BankDetailsForm = () => {
    const router = useRouter();
    const { onClose } = useModal();
    const { updateBankDetails } = useHubProvider();
    const { seller } = useSellerProvider();
    console.log('seller: ',seller);
    console.log(seller);
    

    const form = useForm({
        resolver: zodResolver(BankDetailsSchema),
        defaultValues: {
            accHolderName: '',
            accType: '',
            accNumber: '',
            ifscNumber: ''
        }
    });

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
            updateBankDetails(values);
            console.log('values updated: ',values);
            
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
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                            {...field} />
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
                                        <Input
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                            {...field} />
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
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                            {...field} />
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
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
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
                </div>
            </form>
        </Form>
    )
}

export default BankDetailsForm