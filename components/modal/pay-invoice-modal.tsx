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
import { usePaymentGateway } from "../providers/PaymentGatewayProvider";
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
import { formatCurrencyForIndia } from '@/lib/utils';
import { Input } from '../ui/input';

const schema = z.object({
    amount: z.string().refine(
        v => {
            let n = Number(v);
            return !isNaN(n) && v?.length > 0;
        },
        { message: "Invalid amount." }
    ),
});

export const PayForInvoice = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { payInvoiceIntent } = usePaymentGateway();
    const { invoicePaymentDetails } = data;
    const dueAmount = invoicePaymentDetails?.dueAmount || 0; 
    const isModalOpen = isOpen && type === "payForInvoice";
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: "",
        }
    });

    const handleSelect = (percentage: string) => {
        const calculatedAmount = (Number(dueAmount) * Number(percentage)) / 100;
        form.setValue('amount', calculatedAmount.toFixed(2));
    };

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            await payInvoiceIntent(Number(values.amount), invoicePaymentDetails?._id);
        } catch (error) {
            console.error(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const PERCENTAGE = ["25", "50", "75", "100"]

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Pay Now
                    </DialogTitle>
                    <DialogDescription>
                        Due Amount: {formatCurrencyForIndia(dueAmount)}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter the amount to pay"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                {
                                    PERCENTAGE.map((amount) => (
                                        <Button
                                            key={amount}
                                            type='button'
                                            variant={'ghost'}
                                            size={'sm'}
                                            onClick={() => handleSelect(amount)}
                                        >
                                            {amount}%
                                        </Button>
                                    ))
                                }
                            </div>
                            <div className='px-3 bg-zinc-300/50 rounded-md'>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className='py-2 flex justify-between hover:no-underline'>Payable Amount?  <span className='text-right ml-auto pr-1'>{formatCurrencyForIndia(Number(form.watch('amount')))}</span></AccordionTrigger>
                                        <AccordionContent>

                                            <div className="grid grid-cols-2 space-y-1">
                                                <div>Amount</div>
                                                <div className='text-right'>{formatCurrencyForIndia(Number(form.watch('amount')))}</div>
                                            </div>

                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                        </div>

                        <DialogFooter className="px-6 py-4">
                            <Button disabled={isLoading} variant={'themeButton'}>
                                Pay {formatCurrencyForIndia(Number(form.watch('amount')))}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
};
