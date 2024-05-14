'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

import { useModal } from '@/hooks/use-model-store';
import { useKycProvider } from '../providers/KycProvider';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { ChevronsUpDown } from 'lucide-react';

const AadharPanSchema = z.object({
    aadhar: z.string().min(12, 'Aadhar number must be 12 characters').max(12, 'Aadhar number must be 12 characters').optional(),
    pan: z.string().min(10, 'PAN number must be 10 characters').max(10, 'PAN number must be 10 characters').optional()
})

export const AadharPanVerificationForm = () => {
    const router = useRouter();
    const { onClose } = useModal();
    const { formData, setFormData, verifyOtpOpen, setVerifyOtpOpen } = useKycProvider();

    const form = useForm<z.infer<typeof AadharPanSchema>>({
        resolver: zodResolver(AadharPanSchema),
    })

    const onSubmit = async (values: z.infer<typeof AadharPanSchema>) => {
        try {
            setFormData((prev: any) => ({ ...prev, ...values }));
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleAadharVerification = () => {
        const aadharValue = form.getValues('aadhar') as string;
        const isValidAadhar = (aadhar: string) => {
            const aadharRegex = /^\d{12}$/;
            return aadharRegex.test(aadhar);
        }
        if (!isValidAadhar(aadharValue)) {
            return toast({
                variant: "destructive",
                title: "Invalid Aadhar Number",
                description: "Please enter valid Aadhar number.",
            });
        }
    }

    const handlePanVerification = () => {
        const panValue = form.getValues('pan') as string;
        const isValidPAN = (pan: string) => {
            const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
            return panRegex.test(pan);
        }
        if (!isValidPAN(panValue)) {
            return toast({
                variant: "destructive",
                title: "Invalid Pan Number",
                description: "Please enter valid PAN number.",
            });
        }
    }

    function handleOpen() {
        setVerifyOtpOpen(!verifyOtpOpen);
    }

    return (
        <Card>
            <div className='flex p-6 justify-between'>
                <div>
                    <CardTitle>KYC using Aadhar and PAN number</CardTitle>
                    <CardDescription>( No document upload required )</CardDescription>
                </div>
                <div className='cursor-pointer' onClick={handleOpen}><ChevronsUpDown /></div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={verifyOtpOpen ? '' : 'hidden'}>
                    <hr />
                    <div className='grid grid-cols-2 p-10'>
                        <div>
                            <FormField
                                control={form.control}
                                name={'aadhar'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase font-bold text-zinc-500 dark:text-secondary/70">
                                            Aadhar Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm w-1/2"

                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Button variant={'default'} onClick={handleAadharVerification} className='mt-4'>Verify</Button>
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name={'pan'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase font-bold text-zinc-500 dark:text-secondary/70">
                                            PAN Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm w-1/2"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Button variant={'default'} onClick={handlePanVerification} className='mt-4'>Verify</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </Card>
    )
}