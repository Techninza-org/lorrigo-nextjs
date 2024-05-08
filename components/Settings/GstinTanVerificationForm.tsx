'use client'
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
import { Button } from '../ui/button';
import { Card, CardDescription, CardTitle } from '../ui/card';

import { useModal } from '@/hooks/use-model-store';
import { useKycProvider } from '../providers/KycProvider';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { ChevronsUpDown } from 'lucide-react';

const GstinPanSchema = z.object({
    gstin: z.string().min(15, 'GSTIN number must be 15 characters').max(15, 'GSTIN number must be 15 characters').optional(),
    tan: z.string().min(10, 'TAN number must be 10 characters').max(10, 'TAN number must be 10 characters').optional()
})

export const GstinTanVerificationForm = () => {
    const router = useRouter();
    const { onClose } = useModal();
    const { formData, setFormData, verifyOtpOpen, setVerifyOtpOpen } = useKycProvider();

    const form = useForm<z.infer<typeof GstinPanSchema>>({
        resolver: zodResolver(GstinPanSchema),
    })

    const onSubmit = async (values: z.infer<typeof GstinPanSchema>) => {
        try {
            setFormData((prev: any) => ({ ...prev, ...values }));
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleGstinVerification = () => {
        const gstinValue = form.getValues('gstin') as string;
        const isValidGstin = (gstin: string) => {
            const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/;
            return gstinRegex.test(gstin);
        }
        if (!isValidGstin(gstinValue)) {
            return toast({
                variant: "destructive",
                title: "Invalid GSTIN Number",
                description: "Please enter valid GSTIN number.",
            });
        }
        console.log("GSTIN Verification: ", gstinValue);
    }

    const handleTanVerification = () => {
        const tanValue = form.getValues('tan') as string;
        const isValidTan = (tan: string) => {
            const tanRegex = /^\d{10}$/;
            return tanRegex.test(tan);
        }
        if (!isValidTan(tanValue)) {
            return toast({
                variant: "destructive",
                title: "Invalid TAN Number",
                description: "Please enter valid TAN number.",
            });
        }
        console.log('Tan Verification: ', tanValue);
    }

    function handleOpen() {
        setVerifyOtpOpen(!verifyOtpOpen);
    }

    return (
        <Card>
            <div className='flex p-6 justify-between'>
                <div>
                    <CardTitle>KYC using GSTIN and TAN number</CardTitle>
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
                                name={'gstin'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase font-bold text-zinc-500 dark:text-secondary/70">
                                            GSTIN Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm w-1/2"

                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Button variant={'default'} onClick={handleGstinVerification} className='mt-4'>Verify</Button>
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name={'tan'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase font-bold text-zinc-500 dark:text-secondary/70">
                                            TAN Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm w-1/2"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Button variant={'default'} onClick={handleTanVerification} className='mt-4'>Verify</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </Card>


    )

}