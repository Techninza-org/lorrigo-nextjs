'use client';

import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAdminProvider } from '@/components/providers/AdminProvider';

export const UserConfigSchema = z.object({
    isD2C: z.boolean(),
    isB2B: z.boolean(),
    isPostpaid: z.boolean(),
    isPrepaid: z.boolean(),
});

export const UserConfigure = () => {
    const { currSeller, handleUserConfig } = useAdminProvider()
    const form = useForm<z.infer<typeof UserConfigSchema>>({
        resolver: zodResolver(UserConfigSchema),
        defaultValues: {
            isD2C: currSeller?.config?.isD2C || true,
            isB2B: currSeller?.config?.isB2B || true,
            isPostpaid: currSeller?.config?.isPostpaid || true,
            isPrepaid: currSeller?.config?.isPrepaid || true,
        },
    });

    // Move onSubmit function here
    async function onSubmit(values: z.infer<typeof UserConfigSchema>) {
        await handleUserConfig(values)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex  gap-6">
                    <FormField
                        control={form.control}
                        name="isD2C"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
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
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
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
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
                                    Prepaid
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
                        name="isPostpaid"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </>
    );
};
