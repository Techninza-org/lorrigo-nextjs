import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useModal } from "@/hooks/use-model-store"
import { Button, buttonVariants } from "../ui/button";
import { useEffect, useState } from "react";


import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { useSellerProvider } from '../providers/SellerProvider';
import { useRouter } from 'next/navigation';


import { formDataSchema } from "../Shipment/b2c-form";
import { OrderDetailForm } from "../Shipment/b2c-order-form";
import { BoxDetails } from "../Shipment/box-details";
import { AddCustomerForm, customerDetailsSchema } from "../modal/add-customer-modal";

const mergeForm = formDataSchema.merge(customerDetailsSchema)


export function EditOrderDrawer() {
    const { isOpen, onClose, type, data } = useModal();

    const { order } = data;

    const isModalOpen = isOpen && type === "editOrder";

    const { sellerFacilities } = useSellerProvider();

    const router = useRouter();

    const [collectableFeild, setCollectableFeild] = useState(false);
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);

    const form = useForm({
        resolver: zodResolver(mergeForm),
        defaultValues: {
            order_reference_id: "",
            fragile_items: false,
            payment_mode: "" as "COD" | "Prepaid",
            orderWeight: "",
            order_invoice_date: currentDate,
            order_invoice_number: "",
            numberOfBoxes: "1" as "1" | "2" | "3" | "4" | "5",
            orderSizeUnit: "cm",
            orderBoxHeight: "",
            orderBoxWidth: "",
            orderBoxLength: "",
            amount2Collect: "",
            productDetails: {
                name: "",
                category: "",
                hsn_code: "",
                quantity: "1",
                taxRate: "",
                taxableValue: "",
            },
            pickupAddress: "",
            sellerDetails: {
                name: "",
                gstNo: "",
                isSellerAddressAdded: false,
                pincode: "",
                address: "",
                phone: "",
                city: "",
                state: "",
            },
            customerDetails: {
                name: "",
                phone: "",
                address: "",
                address2: "",
                country: "India",
                state: "",
                pincode: "",
                city: "",
            },
        }
    });

    console.log(order);

    useEffect(() => {
        form.setValue('order_reference_id', order?.order_reference_id || '');
        form.setValue('fragile_items', order?.isContainFragileItem || false);
        form.setValue('payment_mode', order?.payment_mode == 0 ? "Prepaid" : "COD");
        form.setValue('orderWeight', order?.orderWeight?.toString() || '');
        form.setValue('order_invoice_date', new Date(order?.order_invoice_date || ''));
        form.setValue('order_invoice_number', order?.order_invoice_number || '');
        form.setValue('numberOfBoxes', order?.numberOfBoxes?.toString() as "1" | "2" | "3" | "4" | "5" || "1");
        form.setValue('orderSizeUnit', order?.orderSizeUnit || '');
        form.setValue('orderBoxHeight', order?.orderBoxHeight?.toString() || '');
        form.setValue('orderBoxWidth', order?.orderBoxWidth?.toString() || '');
        form.setValue('orderBoxLength', order?.orderBoxLength?.toString() || '');
        form.setValue('amount2Collect', order?.amount2Collect?.toString() || '');

        form.setValue('productDetails.name', order?.productId?.name || "");
        form.setValue('productDetails.category', order?.productId?.category || "");
        form.setValue('productDetails.hsn_code', order?.productId?.hsn_code || "");
        form.setValue('productDetails.quantity', order?.productId?.quantity || "");
        form.setValue('productDetails.taxRate', order?.productId?.tax_rate || "");
        form.setValue('productDetails.taxableValue', order?.productId?.taxable_value || "");
        form.setValue('pickupAddress', order?.pickupAddress._id || "");

        // form.setValue('sellerDetails.name', order?.sellerId?.name || "");
        // form.setValue('sellerDetails.gstNo', order?.sellerId?.gstNo || "");
        // form.setValue('sellerDetails.isSellerAddressAdded', order?.sellerId?.isSellerAddressAdded || false);
        // form.setValue('sellerDetails.pincode', order?.sellerId?.pincode || "");
        // form.setValue('sellerDetails.address', order?.sellerId?.address || "");
        // form.setValue('sellerDetails.country', order?.sellerId?.country || "");
        // form.setValue('sellerDetails.phone', order?.sellerId?.phone || "");
        // form.setValue('sellerDetails.city', order?.sellerId?.city || "");
        // form.setValue('sellerDetails.state', order?.sellerId?.state || "");

        form.setValue('customerDetails.name', order?.customerDetails?.name || "");
        form.setValue('customerDetails.phone', order?.customerDetails?.phone || "");
        form.setValue('customerDetails.address', order?.customerDetails?.address || "");
        form.setValue('customerDetails.pincode', order?.customerDetails?.pincode.toString() || "");


    }, [form, order]);

    const isLoading = form.formState.isSubmitting;

    const isCOD = form.watch('payment_mode') === "COD";

    useEffect(() => {
        if (isCOD) {
            setCollectableFeild(true);
        } else {
            setCollectableFeild(false);
        }
    }, [isCOD]);


    const handleIncrement = () => {
        const currentValue = parseInt(form.watch('productDetails.quantity').toString()) || 0;
        form.setValue('productDetails.quantity', (currentValue + 1).toString());
    };

    const handleDecrement = () => {
        const currentValue = parseInt(form.watch('productDetails.quantity').toString(), 10) || 0;
        if (currentValue > 0) {
            form.setValue('productDetails.quantity', (currentValue - 1).toString());
        }
    };

    const onSubmit = async (values: z.infer<typeof mergeForm>) => {
        try {
            console.log(values);
            // const isSuccess = await handleCreateOrder(values)
            // if (isSuccess == true) {
            //     form.reset();
            //     router.push('/orders')
            // }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        // form.reset();
        onClose();
    }



    return (
        <Drawer open={isModalOpen} direction="right" onClose={handleClose}>
            <DrawerContent className="bg-white flex flex-col rounded-t-[10px] h-full mt-24 fixed bottom-0 left-80">
                <DrawerHeader>
                    <DrawerTitle className="flex items-center space-x-2">
                        <span>Edit Order</span>
                        <span className="font-medium underline underline-offset-4 text-blue-800">
                            #{order?.order_reference_id}
                        </span>
                    </DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <div className="grid grid-cols-5">
                            <div className="col-span-3">
                                <OrderDetailForm
                                    form={form}
                                    isLoading={isLoading}
                                    orderRefDisable={true}
                                    handleDecrement={handleDecrement}
                                    handleIncrement={handleIncrement}
                                    collectableFeild={collectableFeild}
                                />
                            </div>

                            <div className="col-span-2">
                                <div className="px-6">
                                    <FormField
                                        control={form.control}
                                        name="pickupAddress"
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
                                                            <SelectValue placeholder={order?.pickupAddress?.name || "Select facility"} />
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
                                </div>

                                <AddCustomerForm
                                    form={form}
                                    isLoading={isLoading}
                                />
                                <BoxDetails
                                    form={form}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>

                        <DrawerFooter className="flex flex-row-reverse">
                            <Button type="submit" variant={"themeButton"}>Update Order</Button>
                            <DrawerClose onClick={handleClose} className={buttonVariants({
                                variant: "secondary",
                            })}>
                                Cancel
                            </DrawerClose>

                        </DrawerFooter>
                    </form>
                </Form>

            </DrawerContent>

        </Drawer>


    )
}


