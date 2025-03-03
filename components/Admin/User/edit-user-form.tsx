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

    coi: z.string().optional(),
    llpAggreement: z.string().optional(),
    memoradum: z.string().optional(),
})

const EditUserForm = () => {
    const searchParams = useSearchParams();
    const sellerId = searchParams.get('sellerId');
    const { users } = useAdminProvider();

    const user = users.find((user: any) => user._id === sellerId);
    const { document1Type, document2Type } = user?.kycDetails || {}

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
            coi: '',
            llpAggreement: '',
            memoradum: '',
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof EditUserSchema>) => {
        try {

            const isPan = document1Type === 'pan'
            const isAadhar = document1Type === 'aadhar'
            const isCoi = document1Type === 'coi'
            const isLlpAggreement = document1Type === 'llp-aggreement'
            const isMemoradum = document1Type === 'memoradum'

            // document2Type
            const isPan2 = document2Type === 'pan'
            const isAadhar2 = document2Type === 'aadhar'
            const isCoi2 = document2Type === 'coi'
            const isLlpAggreement2 = document2Type === 'llp-aggreement'
            const isMemoradum2 = document2Type === 'memoradum'


            const payload = {
                name: values.name,
                billingAddress: {
                    phone: values.phone
                },
                isVerified: values.verified,
                isActive: values.active,
                companyProfile: {
                    companyName: values.companyName,
                    companyEmail: values.companyEmail,
                    prefix: values.prefix,
                },
                bankDetails: {
                    accHolderName: values.accHolderName,
                    accType: values.accType,
                    accNumber: values.accNumber,
                    ifscNumber: values.ifscNumber,
                },
                kycDetails: {
                    pan: values.pan,
                    adhaar: values.aadhar,
                    document1Feild: (isPan ? values.pan : "") || (isAadhar ? values.aadhar : "") || (isCoi ? values.coi : "") || (isLlpAggreement ? values.llpAggreement : "") || (isMemoradum ? values.memoradum : ""),
                    document2Feild: (isPan2 ? values.pan : "") || (isAadhar2 ? values.aadhar : "") || (isCoi2 ? values.coi : "") || (isLlpAggreement2 ? values.llpAggreement : "") || (isMemoradum2 ? values.memoradum : ""),
                    verified: values.verified,
                }
            }
            handleEditUser(sellerId ?? '', payload)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (user) {
            const { document1Type, document2Type } = user.kycDetails || {}

            // document1Type
            const isPan = document1Type === 'pan'
            const isAadhar = document1Type === 'aadhar'
            const isCoi = document1Type === 'coi'
            const isLlpAggreement = document1Type === 'llp-aggreement'
            const isMemoradum = document1Type === 'memoradum'

            // document2Type
            const isPan2 = document2Type === 'pan'
            const isAadhar2 = document2Type === 'aadhar'
            const isCoi2 = document2Type === 'coi'
            const isLlpAggreement2 = document2Type === 'llp-aggreement'
            const isMemoradum2 = document2Type === 'memoradum'


            form.setValue('active', user.isActive || false)
            form.setValue('name', user.name || '')
            form.setValue('phone', user.billingAddress?.phone || '')
            form.setValue('companyName', user.companyProfile?.companyName || '')
            form.setValue('companyEmail', user.companyProfile?.companyEmail || '')
            form.setValue('prefix', user.prefix || '')

            form.setValue('pan', (isPan && user.kycDetails.document1Feild) || (isPan2 && user.kycDetails.document2Feild) || '')
            form.setValue('aadhar', (isAadhar && user.kycDetails.document1Feild) || (isAadhar2 && user.kycDetails.document2Feild) || '')
            form.setValue('coi', (isCoi && user.kycDetails.document1Feild) || (isCoi2 && user.kycDetails.document2Feild) || '')
            form.setValue('llpAggreement', (isLlpAggreement && user.kycDetails.document1Feild) || (isLlpAggreement2 && user.kycDetails.document2Feild) || '')
            form.setValue('memoradum', (isMemoradum && user.kycDetails.document1Feild) || (isMemoradum2 && user.kycDetails.document2Feild) || '')

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
                                    <Input
                                        disabled={isLoading}
                                        className="bg-white border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
                        name={'coi'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    COI
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
                        name={'llpAggreement'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    LLP Aggrement
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
                        name={'memoradum'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Memoradum
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
                                            disabled={user?.isVerified || isLoading}
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
                <Button variant={'themeButton'} size={'lg'} type='submit' className='mt-6'>Edit User</Button>
            </form>
        </Form>
    )
}

export default EditUserForm;