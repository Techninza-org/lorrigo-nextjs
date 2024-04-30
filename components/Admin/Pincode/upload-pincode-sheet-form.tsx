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
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Select from 'react-select';

export const UploadPincodesSchema = z.object({
    partner: z.string().min(1, "Partner is required"),
    upload_sheet: z.string().min(1, "Please choose CSV version of file"),
})

const partners = [
    { value: 'delhivery', label: 'Delhivery' },
    { value: 'post', label: 'Post' },
];

const UploadPincodeSheet = () => {
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
            form.reset();
            router.refresh();
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
                                                    <div>
                                                        <Select
                                                            {...field}
                                                            options={partners}
                                                            isSearchable
                                                            placeholder='Select Partner'
                                                            onChange={option => field.onChange(option?.value)}
                                                            onBlur={field.onBlur}
                                                            value={partners.find(partner => partner.value === field.value)}
                                                        />
                                                    </div>
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
                                                        <input
                                                            type='file'
                                                            accept='.csv'
                                                            onChange={(event) => {
                                                                const file = event.target?.files?.[0];
                                                                const reader = new FileReader();
                                                                if (file) {
                                                                    reader.onload = function (event) {
                                                                        field.onChange(event.target?.result);
                                                                    };
                                                                    reader.readAsText(file);
                                                                }
                                                            }}
                                                        />
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