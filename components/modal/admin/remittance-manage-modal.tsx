import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-model-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useAdminProvider } from "@/components/providers/AdminProvider";

export const AdminRemittanceUpdateSchema = z.object({
    bankTransactionId: z.string(),
    status: z.enum(["pending", "completed", "hold"])
})

export const AdminRemittanceUpdateModal = () => {

    const { manageRemittance } = useAdminProvider();

    const form = useForm({
        resolver: zodResolver(AdminRemittanceUpdateSchema),
        defaultValues: {
            status: "pending" as "pending" | "completed" | "hold",
            bankTransactionId: "",
        }
    });

    const { isLoading } = form.formState;
    const { isOpen, onClose, type, data } = useModal();
    const { remittance } = data ?? {};

    useEffect(() => {
        form.setValue('bankTransactionId', remittance?.BankTransactionId || "")
        form.setValue('status', remittance?.remittanceStatus as "pending" | "completed" | "hold")
    }, [form, remittance])

    const isModalOpen = isOpen && type === "adminRemittanceManage";

    const handleClose = () => {
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof AdminRemittanceUpdateSchema>) => {
        try {
            console.log(values, 'values', remittance?._id)
            const updateRemittance = await manageRemittance({
                remittanceId: remittance?._id || "",
                ...values
            });

            if (updateRemittance) {
                onClose();
            }
        } catch (error) {
            console.log(error, "AdminRemittanceUpdateModal")
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-6">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Update Remittance
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="bankTransactionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Bank Transaction Id <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Enter the Bank Transaction Id"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel
                                        className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                    >
                                        Status <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue className="capitalize" placeholder={remittance?.remittanceStatus || "Select Status"} />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-72">
                                                <SelectItem value="pending" className="capitalize">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="completed" className="capitalize">
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value="hold" className="capitalize">
                                                    Hold
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-3">
                            <Button variant="themeNavActiveBtn">Update</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog >
    )
};