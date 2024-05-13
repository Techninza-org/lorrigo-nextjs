'use client'
import React from 'react'
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
import { Button } from '../ui/button';
import { useAuth } from '../providers/AuthProvider';
import { LoadingComponent } from '../loading-spinner';

export const ChangePasswordSchema = z.object({
    old_password: z.string().min(1, "Old password is required"),
    password: z.string().min(1, "New password is required"),
    confirmPassword: z.string().min(1, "This should be same as new password"),
})

const ChangePasswordForm = () => {
    const { handleChangePassword } = useAuth();

    const form = useForm({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            old_password: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (formData: z.infer<typeof ChangePasswordSchema>) => {
        try {
            const isPassChanged = await handleChangePassword(formData)
        } catch (error) {
            console.log(error, "error[ChangePasswordForm]")
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            {form.formState.isSubmitting && <LoadingComponent />}
                <div className="space-y-5 ">
                    <div className='grid gap-y-6  py-5'>
                        <FormField
                            control={form.control}
                            name={'old_password'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Old password <span className='text-red-600'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className=" border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm w-1/2"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name={'password'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        New password <span className='text-red-600'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm w-1/2"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name={'confirmPassword'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Re-Type new password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm w-1/2"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <div className='flex gap-x-12'>
                        {/* <Button variant={'themeGrayBtn'} size={'lg'} >Cancel</Button> */}
                        <Button variant={'themeButton'} size={'lg'} >Save</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default ChangePasswordForm


