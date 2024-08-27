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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useSellerProvider } from '../providers/SellerProvider';
import { LoadingComponent } from '../loading-spinner';

export const GstinFormSchema = z.object({
    gstin: z.string().min(1, "GST number is required").max(15, "GST number must be 15 characters"),
    tan: z.string().min(1, "TAN number is required").max(10, "TAN number must be 10 characters"),
    deductTDS: z.enum(["yes", "no"]),
});

const GstinForm = () => {
    const { uploadGstinInvoicing, seller } = useSellerProvider();

    const form = useForm({
        resolver: zodResolver(GstinFormSchema),
        defaultValues: {
            gstin: '',
            deductTDS: 'no' as 'yes' | 'no',
            tan: '',
        }
    });

    useEffect(() => {
        const setFormValues = async () => {
            if (seller?.gstInvoice) {
                form.setValue('gstin', seller.gstInvoice.gstin || "");
                form.setValue('tan', seller.gstInvoice.tan || "");
                form.setValue('deductTDS', (seller?.gstInvoice?.deductTDS as 'yes' | 'no') || "no" );
            }
        };
        setFormValues();
    }, [seller, form]);

    const onSubmit = async (values: z.infer<typeof GstinFormSchema>) => {
        try {
            const isGSTUpdated = await uploadGstinInvoicing(values);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            {form.formState.isSubmitting && <LoadingComponent />}
                <div className="space-y-5">
                    <FormField
                        control={form.control}
                        name={'gstin'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    GSTIN <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm w-1/2"
                                        {...field}
                                        maxLength={15}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="deductTDS"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>I want to Deduct TDS payment <span className='text-red-600'>*</span></FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        {...field}
                                        onValueChange={field.onChange}
                                        className="flex space-x-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="yes" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Yes
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="no" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                No
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={'tan'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    TAN Number <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm w-1/2"
                                        {...field}
                                        maxLength={10}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                </div>
                <div className='flex'>
                    <Button variant={'themeButton'} type='submit' className='pr-0 mt-6'>
                        Save
                        <div className='bg-red-800 h-10 w-10 grid place-content-center rounded-r-md ml-4' ><Save /></div>
                    </Button>
                </div>
            </form>

        </Form>
    )
}

export default GstinForm