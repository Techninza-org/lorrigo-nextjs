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
import { useHubProvider } from '../providers/HubProvider';
import { useModal } from '@/hooks/use-model-store';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

export const GstinFormSchema = z.object({
    gstin: z.string().min(1, "Gst number is required"),
    tan: z.string().min(1, "Tan number is required"),
    deductTDS: z.string(),
})

const GstinForm = () => {
    const { onClose } = useModal();
    const router = useRouter();
    const [selectedValue, setSelectedValue] = useState('yes');
    const { uploadGstinInvoicing } = useHubProvider();

    const handleChange = (value: string) => {
        setSelectedValue(value);
    };

    const form = useForm({
        resolver: zodResolver(GstinFormSchema),
        defaultValues: {
            gstin: '',
            deductTDS: selectedValue,
            tan: '',
        }
    });

    useEffect(() => {
        form.setValue('deductTDS', selectedValue);
    }, [selectedValue]);

    const onSubmit = async (values: z.infer<typeof GstinFormSchema>) => {
        try {
            uploadGstinInvoicing(values);
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
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name={'deductTDS'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    I want to deduct TDS payment <span className='text-red-600'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup defaultValue={selectedValue} className='flex' onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="yes" />
                                            <Label htmlFor="yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="no" />
                                            <Label htmlFor="no">No</Label>
                                        </div>
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
                                        {...field} />
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