'use client'
import React, { useEffect } from 'react'
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
import { Button } from '../ui/button';

import { useKycProvider } from '../providers/KycProvider';
import { Card, CardDescription, CardTitle } from '../ui/card';
import { useSellerProvider } from '../providers/SellerProvider';
import { AlertNRedirect } from '../AlertNRedirect';

const BusinessTypeSchema = z.object({
    businessType: z.enum(["Individual", "Sole Proprietor", "Company"], {
        required_error: "You need to select a business type.",
    }),
})

export const KycBusinessTypeForm = () => {
    const { formData, onHandleNext, setFormData } = useKycProvider();
    const { seller } = useSellerProvider();
    const gstInvoice = seller?.gstInvoice;
    const billingAddress = seller?.billingAddress;

    const form = useForm<z.infer<typeof BusinessTypeSchema>>({
        resolver: zodResolver(BusinessTypeSchema),
    })

    const onSubmit = async (values: z.infer<typeof BusinessTypeSchema>) => {
        try {
            setFormData((prev: any) => ({ ...prev, ...values }));
            onHandleNext();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (formData?.businessType) {
            form.setValue('businessType', formData.businessType as "Individual" | "Sole Proprietor" | "Company")
        }
    }, [form, formData]);

    if (!gstInvoice?.gstin || !billingAddress?.address_line_1) {
        return <AlertNRedirect
            billingAddress={!billingAddress?.address_line_1}
            gstInvoice={!gstInvoice?.gstin}
            message='Please fill in your GST Invoice and Billing Address details first.'
        />;
    }


    return (
        <Card className='p-10'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='businessType'
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={formData?.businessType || field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <Card className="px-10 py-4 flex hover:shadow-md hover:shadow-slate-200">
                                            <FormItem className='flex gap-x-5'>
                                                <FormControl>
                                                    <RadioGroupItem value="Individual" className='mt-3' />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    <CardTitle>Individual</CardTitle>
                                                    <CardDescription className='pt-3'>A Seller who is selling through online selling platforms, and has not registered his/her firm under Companies Act 2013</CardDescription>
                                                </FormLabel>
                                            </FormItem>
                                        </Card>
                                        <Card className="px-10 py-4 flex hover:shadow-md hover:shadow-slate-200">
                                            <FormItem className='flex gap-x-5'>
                                                <FormControl>
                                                    <RadioGroupItem value="Sole Proprietor" className='mt-3' />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    <CardTitle>Sole Proprietor</CardTitle>
                                                    <CardDescription className='pt-3'>Registered company as &apos;Sole Proprietor&apos; under Companies Act 2013</CardDescription>
                                                </FormLabel>
                                            </FormItem>
                                        </Card>
                                        <Card className="px-10 py-4 flex hover:shadow-md hover:shadow-slate-200">
                                            <FormItem className='flex gap-x-5'>
                                                <FormControl>
                                                    <RadioGroupItem value="Company" className='mt-3' />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    <CardTitle>Company</CardTitle>
                                                    <CardDescription className='pt-3'>Registered company as &apos;LLP&apos;, &apos;Private&apos;, &apos;Subsidiary&apos;, &apos;Holding&apos;, etc. under Companies Act 2013</CardDescription>
                                                </FormLabel>
                                            </FormItem>
                                        </Card>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-end'>
                        <Button type="submit" variant={'themeButton'} className='mt-6'>Next</Button>
                    </div>
                </form>
            </Form>
        </Card>
    )
}