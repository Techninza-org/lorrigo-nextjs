'use client'
import React, { useRef } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminProvider } from '@/components/providers/AdminProvider';
import { useModal } from '@/hooks/use-model-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const UploadPincodesSchema = z.object({
    partner: z.string().min(1, "Partner is required"),
    upload_sheet: z.string().min(1, "Please choose CSV version of file"),
})

const UploadPincodeSheet = () => {
    const { handleCreateHub } = useAdminProvider();
    const { onClose } = useModal();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(UploadPincodesSchema),
        defaultValues: {
            partner: '',
            upload_sheet: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof UploadPincodesSchema>) => {
        try {

            handleCreateHub({        
                partner: values.partner,
                upload_sheet: values.upload_sheet,
            });

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Card>
                <CardTitle className='bg-[#be0c34] p-4 text-center text-white font-medium rounded-t-md'>
                    Upload
                </CardTitle>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className=" grid space-y-5 place-content-center">
                                <div className='grid gap-y-6  py-5 '>
                                    <FormField
                                        control={form.control}
                                        name={'partner'}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                    Partner <span className='text-red-600'>*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue
                                                                placeholder="Select Partner Name"
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={'delhivery'}>Delhivery</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    <FormField
                                        control={form.control}
                                        name={'upload_sheet'}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                    Upload Sheet <span className='text-red-600'>*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <input type='file' accept='.csv' />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                <div className='flex gap-x-12'>
                                    <Button variant={'themeButton'} size={'lg'} type='submit'>Upload</Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default UploadPincodeSheet