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
import { Card, CardDescription, CardFooter, CardTitle } from '../ui/card';
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

    const isDisabled = !gstInvoice?.gstin || !billingAddress?.address_line_1;

    return (
        <>
            {isDisabled && <AlertNRedirect billingAddress={!billingAddress?.address_line_1} gstInvoice={!gstInvoice?.gstin} message='Please fill in your GST Invoice and Billing Address details first.' />}

            <Card className='p-4 md:p-10'>
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
                                <Card className="p-4 md:px-10 md:py-4 flex hover:shadow-md hover:shadow-slate-200">
                                    <FormItem className='flex gap-x-5'>
                                        <FormControl>
                                            <RadioGroupItem value="Individual" className='mt-3' />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                            <CardTitle>Individual</CardTitle>
                                            <CardDescription className='pt-3'>
                                                A Seller who is selling through online platforms, and has not registered under the Companies Act 2013
                                            </CardDescription>
                                        </FormLabel>
                                    </FormItem>
                                </Card>
                                <Card className="p-4 md:px-10 md:py-4 flex hover:shadow-md hover:shadow-slate-200">
                                    <FormItem className='flex gap-x-5'>
                                        <FormControl>
                                            <RadioGroupItem 
                                                disabled={!gstInvoice?.gstin || !billingAddress?.address_line_1} 
                                                value="Sole Proprietor" 
                                                className='mt-3 disabled:bg-slate-300' 
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                            <CardTitle>Sole Proprietor</CardTitle>
                                            <CardDescription className='pt-3'>
                                                Registered company as 'Sole Proprietor' under the Companies Act 2013
                                            </CardDescription>
                                        </FormLabel>
                                    </FormItem>
                                </Card>
                                <Card className="p-4 md:px-10 md:py-4 flex hover:shadow-md hover:shadow-slate-200">
                                    <FormItem className='flex gap-x-5'>
                                        <FormControl>
                                            <RadioGroupItem 
                                                disabled={!gstInvoice?.gstin || !billingAddress?.address_line_1} 
                                                value="Company" 
                                                className='mt-3 disabled:bg-slate-300' 
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                            <CardTitle>Company</CardTitle>
                                            <CardDescription className='pt-3'>
                                                Registered company as 'LLP', 'Private', 'Subsidiary', 'Holding', etc. under the Companies Act 2013
                                            </CardDescription>
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

        </>)
}