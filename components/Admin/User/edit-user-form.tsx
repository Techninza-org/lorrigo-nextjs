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
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { useSearchParams } from "next/navigation";
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput } from '@/components/ui/phone-input';


export const EditUserSchema = z.object({
    name: z.string().min(1, "name is required"),
    phone: z.string().optional(),
    companyEmail: z.string().min(1, "email is required"),
    companyName: z.string().min(1, "company is required"),
    prefix: z.string().optional(),
    pan: z.string().optional(),
    aadhar: z.string().optional(),
    gst: z.string().optional(),
    verified: z.boolean().optional(),
    active: z.boolean().optional(),
    accHolderName: z.string().optional(),
    accType: z.string().optional(),
    accNumber: z.string().optional(),
    ifscNumber: z.string().optional(),
})

const EditUserForm = () => {
    const searchParams = useSearchParams();
    const sellerId = searchParams.get('sellerId');
    const { users } = useAdminProvider();

    const user = users.find((user: any) => user._id === sellerId);
    const router = useRouter();
    const { handleEditUser } = useAdminProvider()

    const form = useForm({
        resolver: zodResolver(EditUserSchema),
        defaultValues: {
            name: '',
            phone: '',
            companyName: '',
            companyEmail: '',
            prefix: '',
            pan: '',
            aadhar: '',
            gst: '',
            verified: false,
            active: true,
            accHolderName: '',
            accType: '',
            accNumber: '',
            ifscNumber: '',
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof EditUserSchema>) => {
        try {
            const user = {
                name: values.name,
                billingAddress: {
                    phone: values.phone
                },
                companyProfile: {
                    companyName: values?.companyName,
                    companyEmail: values.companyEmail
                },
                prefix: values.prefix,
                pan: values.pan,
                aadhar: values.aadhar,
                gst: values.gst,
                isVerified: values.verified,
                isActive: values.active,
                bankDetails: {
                    accHolderName: values.accHolderName,
                    accType: values.accType,
                    accNumber: values.accNumber,
                    ifscNumber: values.ifscNumber
                }
            }
            handleEditUser(sellerId ?? '', user)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            form.setValue('name', user.name || '')
            form.setValue('phone', user.billingAddress?.phone || '')
            form.setValue('companyName', user.companyProfile?.companyName || '')
            form.setValue('companyEmail', user.companyProfile?.companyEmail || '')
            form.setValue('prefix', user.prefix || '')
            form.setValue('pan', user.pan || '')
            form.setValue('aadhar', user.aadhar || '')
            form.setValue('gst', user.gst || '')
            form.setValue('verified', user.isVerified || false)
            form.setValue('active', user.isActive || false)
            form.setValue('accHolderName', user.bankDetails?.accHolderName || '')
            form.setValue('accType', user.bankDetails?.accType || '')
            form.setValue('accNumber', user.bankDetails?.accNumber || '')
            form.setValue('ifscNumber', user.bankDetails?.ifscNumber || '')
        }
    }, [user, form])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid gap-y-6 grid-cols-2 py-3 gap-x-10'>
                    <FormField
                        control={form.control}
                        name={'name'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Name <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
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
                                    {/* <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} /> */}
                                    <PhoneInput
                                        disabled={isLoading}
                                        className="bg-white border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        inputComponent={Input}
                                        defaultCountry='IN'
                                        placeholder='Enter the contact number'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'companyName'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Company <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'companyEmail'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Company Email <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'prefix'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Prefix
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'pan'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    PAN
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'aadhar'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Aadhar
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'gst'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    GSTIN
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'accHolderName'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Account Holder Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
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
                                    Account Type
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
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
                                    Account Number
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
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
                                    IFSC Number
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                        className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'verified'}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="verified"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <label
                                            htmlFor="verified"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Verified
                                        </label>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'active'}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="active"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <label
                                            htmlFor="active"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Active
                                        </label>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                </div>
                <Button variant={'themeButton'} size={'lg'} type='submit' className='mt-6'> Edit User</Button>
            </form>
        </Form>
    )
}

export default EditUserForm;