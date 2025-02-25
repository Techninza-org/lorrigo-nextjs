'use client';

import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAdminProvider } from '@/components/providers/AdminProvider';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

export const UserConfigSchema = z.object({
    isD2C: z.boolean(),
    isB2B: z.boolean(),
    isPrepaid: z.boolean(),
    isFW: z.boolean(),
    isRTO: z.boolean(),
    isCOD: z.boolean(),
});

export const UserConfigure = () => {
    const { currSeller, handleUserConfig } = useAdminProvider();

    const form = useForm<z.infer<typeof UserConfigSchema>>({
        resolver: zodResolver(UserConfigSchema),
        defaultValues: {
            isD2C: currSeller?.seller?.config?.isD2C || false,
            isB2B: currSeller?.seller?.config?.isB2B || false,
            isPrepaid: currSeller?.seller?.config?.isPrepaid || false,
            isFW: currSeller?.seller?.config?.isFW || true,
            isRTO: currSeller?.seller?.config?.isRTO || true,
            isCOD: currSeller?.seller?.config?.isCOD || true,
        },
    });

    useEffect(() => {
        if (currSeller) {
            form.reset({
                isD2C: currSeller.seller.config.isD2C || false,
                isB2B: currSeller.seller.config.isB2B || false,
                isPrepaid: currSeller.seller.config.isPrepaid || false,
                isFW: currSeller.seller.config.isFW || true,
                isRTO: currSeller.seller.config.isRTO || true,
                isCOD: currSeller.seller.config.isCOD || true,
            });
        }
    }, [currSeller, form]);

    async function onSubmit(values: z.infer<typeof UserConfigSchema>) {
        await handleUserConfig(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex gap-4'>
                    <FormField
                        control={form.control}
                        name="isD2C"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                    D2C
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={() => {
                                            field.onChange(!field.value);
                                            form.handleSubmit(onSubmit)(); // Trigger form submission
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isB2B"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                    B2B
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={() => {
                                            field.onChange(!field.value);
                                            form.handleSubmit(onSubmit)(); // Trigger form submission
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isPrepaid"
                        render={({ field }) => (
                            <FormItem className="flex gap-3">
                                <FormLabel className="font-bold mt-2 text-zinc-500 dark:text-secondary/70">
                                    Postpaid
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={() => {
                                            field.onChange(!field.value);
                                            form.handleSubmit(onSubmit)(); // Trigger form submission
                                        }}
                                    />
                                </FormControl>
                                <FormLabel className="font-bold mt-0 text-zinc-500 dark:text-secondary/70">
                                    Prepaid
                                </FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Separator orientation='vertical' />
                    <FormField
                        control={form.control}
                        name="isFW"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                    Forward
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={() => {
                                            field.onChange(!field.value);
                                            form.handleSubmit(onSubmit)(); // Trigger form submission
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isRTO"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                    RTO
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={() => {
                                            field.onChange(!field.value);
                                            form.handleSubmit(onSubmit)(); // Trigger form submission
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isCOD"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                    COD
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={() => {
                                            field.onChange(!field.value);
                                            form.handleSubmit(onSubmit)(); // Trigger form submission
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
            </form>
        </Form>
    );
};