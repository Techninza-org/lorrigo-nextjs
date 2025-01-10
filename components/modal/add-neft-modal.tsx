'use client'

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
import { useModal } from "@/hooks/use-model-store";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from '../ui/input';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useAdminProvider } from '../providers/AdminProvider';

const schema = z.object({
    invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
    paymentReferenceNumber: z.string().min(1, { message: "Payment reference number is required" }),
    bankName: z.string().min(1, { message: "Bank name is required" }),
    amount: z.string().refine(
        (v) => {
            let n = Number(v);
            return !isNaN(n) && n > 0;
        },
        { message: "Invalid amount" }
    ),
    transactionDate: z.date().nullable().refine((v) => !!v, { message: "Transaction date is required" }),
});

export const NEFTTransactionForm = () => {
    const { isOpen, onClose, type } = useModal();
    const {handleCreateNeftPayment} = useAdminProvider();
    const isModalOpen = isOpen && type === "neftTransactionForm";
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            invoiceNumber: "",
            paymentReferenceNumber: "",
            bankName: "",
            amount: "",
            transactionDate: null,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            await handleCreateNeftPayment(
                values.invoiceNumber,
                values.paymentReferenceNumber,
                values.bankName,
                values.amount,
                values.transactionDate?.toISOString() || ""
            );
            form.reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        NEFT Transaction
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-6">
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name="invoiceNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Invoice Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter the invoice number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="paymentReferenceNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Reference Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter the NEFT reference number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bankName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter the bank name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isLoading}
                                                placeholder="Enter the payment amount"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="transactionDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Transaction</FormLabel>
                                    <FormControl>
                                        <DayPicker
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={(date) => field.onChange(date || undefined)} 
                                            disabled={[{ after: new Date() }]} 
                                        />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="px-6 py-4">
                            <Button disabled={isLoading} variant="themeButton">
                                Create Transaction
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
