"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { formatCurrencyForIndia } from '@/lib/utils';
import { Tag } from 'lucide-react';
import { usePaymentGateway } from '../providers/PaymentGatewayProvider';

const schema = z.object({
    rechargeAmount: z.string().refine(
        v => {
            let n = Number(v);
            return !isNaN(n) && v?.length > 0 && n >= 500 && n <= 10000;
        },
        { message: "Invalid amount or recharge amount must be between 500 and 10000" }
    ),
    couponCode: z.string().optional()
});


export const RechargeModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const { rechargeWallet } = usePaymentGateway();

    const isModalOpen = isOpen && type === "wallet";

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            rechargeAmount: "500",
            couponCode: ""
        }
    });

    const handleSelect = (amount: string) => {
        form.setValue('rechargeAmount', amount);
    };

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {

            await rechargeWallet(Number(values.rechargeAmount));
            // form.reset();
            // router.refresh();
            // onClose();
        } catch (error) {
            console.error(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const PRICE = ["500", "1000", "2000", "5000", "10000"]

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Recharge You Wallet
                    </DialogTitle>
                    <DialogDescription>
                        Current Wallet Amount: {formatCurrencyForIndia(1000)}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="rechargeAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Enter Amount in Multiple of 100
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter the amount to recharge"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Min value: ₹500 & Max value ₹10000
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                {
                                    PRICE.map((amount) => (
                                        <Button
                                            key={amount}
                                            type='button'
                                            variant={'ghost'}
                                            size={'sm'}
                                            onClick={() => handleSelect(amount)}
                                        >
                                            {formatCurrencyForIndia(Number(amount))}
                                        </Button>
                                    ))
                                }
                            </div>
                            <div className='flex space-x-2 w-full items-center flex-1'>
                                <FormField
                                    control={form.control}
                                    name="couponCode"
                                    render={({ field }) => (
                                        <FormItem className="w-full"> {/* Adjusted */}
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="bg-zinc-300/50 flex-1 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 w-full"
                                                    placeholder="Enter the coupon code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Tag size={21} className='text-sky-700' />
                            </div>
                            <div className='px-3 bg-zinc-300/50 rounded-md'>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className='py-2 flex justify-between hover:no-underline'>Payable Amount?  <span className='text-right ml-auto pr-1'>{formatCurrencyForIndia(Number(form.watch('rechargeAmount')))}</span></AccordionTrigger>
                                        <AccordionContent>

                                            <div className="grid grid-cols-2 space-y-1">
                                                <div>Coupon Applied</div>
                                                <div className='text-right'>Coupon Applied</div>
                                                <div>Recharge Amount</div>
                                                <div className='text-right'>{formatCurrencyForIndia(Number(form.watch('rechargeAmount')))}</div>
                                            </div>

                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                        </div>

                        <DialogFooter className="px-6 py-4">
                            <Button disabled={isLoading} variant={'themeButton'}>
                                Pay {formatCurrencyForIndia(Number(form.watch('rechargeAmount')))}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
};