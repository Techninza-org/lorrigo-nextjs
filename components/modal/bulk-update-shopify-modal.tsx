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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoxDetails } from "../Shipment/box-details";


export const BulkUpdateShopifyOrdersSchema = z.object({
    orderIds: z.array(z.string()),
    pickupAddressId: z.string(),
    orderBoxHeight: z.string().min(1, "Order box height is required"),
    orderBoxWidth: z.string().min(1, "Order box width is required"),
    orderBoxLength: z.string().min(1, "Order box length is required"),
    orderWeight: z.string().min(1, "Order weight is required"),
})


export const BulkUpdateShopifyModal = () => {
    const { handleBulkUpdateShopifyOrders, sellerFacilities } = useSellerProvider();

    const form = useForm({
        resolver: zodResolver(BulkUpdateShopifyOrdersSchema),
        defaultValues: {
            orderIds: [],
            pickupAddressId: "",
            orderSizeUnit: "cm",
            orderBoxHeight: "",
            orderBoxWidth: "",
            orderBoxLength: "",
            orderWeight: "",
        }
    });

    const { isLoading, errors } = form.formState;
    console.log(errors);

    const { isOpen, onClose, type, data } = useModal();
    const { orders } = data ?? {};

    const isModalOpen = isOpen && type === "updateShopifyOrders";

    const onSubmit = async (values: z.infer<typeof BulkUpdateShopifyOrdersSchema>) => {
        try {
            const orderIds = orders?.map((order: any) => order._id) || [];
            console.log(orderIds, values);
            const res = await handleBulkUpdateShopifyOrders({
                orderIds,
                values: {
                    orderIds: values.orderIds,
                    pickupAddressId: values.pickupAddressId,
                    orderBoxHeight: values.orderBoxHeight,
                    orderBoxWidth: values.orderBoxWidth,
                    orderBoxLength: values.orderBoxLength,
                    orderWeight: values.orderWeight,
                }
            });
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }
    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-4">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Bulk Update Shopify Orders
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="pickupAddressId"
                            render={({ field }) => (
                                <FormItem className='w-full px-6'>
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
                        {/* <p className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Dimension
                        </p> */}
                        <BoxDetails
                            form={form}
                            isLoading={isLoading}
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