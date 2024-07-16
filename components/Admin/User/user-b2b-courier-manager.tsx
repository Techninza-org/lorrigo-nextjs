'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import MultipleSelector, { Option } from '@/components/ui/MultipleSelector';
import { Button } from '@/components/ui/button';
import { badgeVariants } from '@/components/ui/badge';
import { useAdminProvider } from '@/components/providers/AdminProvider';

const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
});

const FormSchema = z.object({
    couriers: z.array(optionSchema).min(1),
});

export const UserB2BCourierManager = () => {

    const { allB2BCouriers, assignedB2BCouriers, upateSellerB2BAssignedCouriers } = useAdminProvider()

    const OPTIONS: Option[] = allB2BCouriers.map((courier) => ({
        // @ts-ignore
        label: courier.nameWNickname || "",
        value: courier._id,
    }));


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    React.useEffect(() => {
        form.setValue('couriers', assignedB2BCouriers?.map((courier) => ({
            label: courier.nameWithNickname || "",
            value: courier._id,
        })));
    }, [assignedB2BCouriers, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {

            const couriers = data.couriers.map((courier) => courier.value)
            const res = upateSellerB2BAssignedCouriers({ couriers: couriers })
           
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="couriers"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Couriers</FormLabel>
                            <FormControl>
                                <MultipleSelector
                                    {...field}
                                    placeholder="Select Couriers"
                                    options={OPTIONS}
                                    hidePlaceholderWhenSelected={true}
                                    loadingIndicator={<p>Loading...</p>}
                                    badgeClassName={badgeVariants({
                                        variant: 'secondary',
                                    })}
                                    emptyIndicator={
                                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                            No Couriers left.
                                        </p>
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button variant={'themeNavActiveBtn'} type="submit">
                    Update
                </Button>
            </form>
        </Form>
    );
};
