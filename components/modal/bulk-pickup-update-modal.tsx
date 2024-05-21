import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-model-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useSellerProvider } from "../providers/SellerProvider";
import { z } from 'zod';
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


export const BulkPickupUpdateSchema = z.object({
    orderIds: z.array(z.string()),
    pickupAddressId: z.string(),
})


export const BulkPickupUpdateModal = () => {
    const { handleBulkPickupChange, sellerFacilities } = useSellerProvider();

    const form = useForm({
        resolver: zodResolver(BulkPickupUpdateSchema),
        defaultValues: {
            orderIds: [],
            pickupAddressId: ""
        }
    });

    const { isLoading } = form.formState;

    const { isOpen, onClose, type, data } = useModal();
    const { orders } = data ?? {};

    const isModalOpen = isOpen && type === "BulkPickupUpdate";

    const handleClose = () => {
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof BulkPickupUpdateSchema>) => {
        const orderIds = orders?.map((order: any) => order._id) || [];
        console.log(orderIds, values);
        handleBulkPickupChange(orderIds, values.pickupAddressId);
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-6">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Bulk Pickup Update
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="pickupAddressId"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel
                                        className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                    >
                                        Select Facility <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}

                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={"Select facility"} />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-72">
                                                {sellerFacilities.length > 0 ? (sellerFacilities.map((facility: any) => (
                                                    <SelectItem key={facility._id} value={facility._id} className="capitalize">
                                                        {facility.name}
                                                    </SelectItem>
                                                ))) : (
                                                    <SelectItem value="noFacility" className="capitalize" disabled={true}>
                                                        No facility available
                                                    </SelectItem>
                                                )}
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
        </Dialog>
    )
};