'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormMessage } from '@/components/ui/form';
import Image from "next/image";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from '../ui/input';
import { useHubProvider } from '../providers/HubProvider';
import { useModal } from '@/hooks/use-model-store';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export const ChangePasswordSchema = z.object({
    old: z.string().min(1, "Old password is required"),
    new: z.string().min(1, "New password is required"),
    re_new: z.string().min(1, "New password is required"),
})

const ChangePasswordForm = () => {
    const { handleCreateHub } = useHubProvider();
    const { onClose } = useModal();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            old: '',
            new: '',
            re_new: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
        try {

            handleCreateHub({
                old: values.old,
                new: values.new,
                re_new: values.re_new
            });

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
                    <div className='grid gap-y-6  py-5'>
                        <FormField
                            control={form.control}
                            name={'old'}
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
                            name={'new'}
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
                            name={'re_new'}
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
                        <Button variant={'themeGrayBtn'} size={'lg'} >Cancel</Button>
                        <Button variant={'themeButton'} size={'lg'} >Save</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default ChangePasswordForm