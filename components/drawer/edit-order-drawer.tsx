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
import { SellerForm, sellerSchema } from "../modal/add-seller-modal";
import { Box, CheckIcon, LucideSeparatorHorizontal, MapPin, Package, Undo2 } from "lucide-react";
import useFetchCityState from "@/hooks/use-fetch-city-state";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";

export const EditFormSchema = formDataSchema.merge(customerDetailsSchema).merge(sellerSchema).extend({
    orderId: z.string(),
    productId: z.string(),
}).refine(data => {
    if (data.sellerDetails.isSellerAddressAdded) {
        return isValidPhoneNumber(data?.sellerDetails?.sellerPhone ?? '');
    }
    return true;
}, {
    message: "Phone number should be of 10 digits",
    path: ["sellerDetails", "sellerPhone"]
})
    .refine(data => {
        if (data.sellerDetails.isSellerAddressAdded) {
            return data?.sellerDetails?.sellerAddress?.length ?? 0 > 0;
        }
        return true;
    }, {
        message: "Address is required",
        path: ["sellerDetails", "sellerAddress"]
    }).refine(data => {
        if (Number(data.productDetails.taxableValue) >= 50000) {
            return (data.ewaybill ?? "").length === 12;
        }
        return true;
    }, {
        message: "Ewaybill is required and must be 12 digits for order value >= 50,000",
        path: ["ewaybill"]
    }).refine(data => {
        if (data.payment_mode === "COD") {
            return Number(data.amount2Collect) <= Number(data.productDetails.taxableValue);
        }
        return true;
    }, {
        message: "Amount to collect should be <= taxable value",
        path: ["amount2Collect"]
    });


export function EditOrderDrawer() {
    const { isOpen, onClose, type, data } = useModal();

    const { order } = data;

    const isModalOpen = isOpen && type === "editOrder";

    const { handleUpdateOrder, sellerFacilities, seller } = useSellerProvider();

    const router = useRouter();

    const [collectableFeild, setCollectableFeild] = useState(false);

    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);

    const form = useForm({
        resolver: zodResolver(EditFormSchema),
        defaultValues: {
            orderId: "",
            productId: "",
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
                sellerName: "",
                sellerGSTIN: "",
                sellerAddress: "",
                isSellerAddressAdded: false,
                sellerPincode: "",
                sellerCity: "",
                sellerState: "",
                sellerPhone: "",
                country: "India",
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
            ewaybill: "",
            isReverseOrder: false
        }
    });

    const customerPincode = form.watch("customerDetails.pincode").toString();

    const { cityState: customerCityState, isTyping: isCusPinLoading, loading } = useFetchCityState(customerPincode);

    const sellerPincode = form.watch("sellerDetails.sellerPincode").toString();

    const { cityState: sellerCityState, isTyping: isSellerPinLoading, } = useFetchCityState(sellerPincode);

    useEffect(() => {
        form.setValue('orderId', order?._id || '');
        form.setValue('productId', order?.productId?._id || '');
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
        form.setValue('productDetails.hsn_code', order?.productId?.hsn_code?.toString() || "");
        form.setValue('productDetails.quantity', order?.productId?.quantity?.toString() || "");
        form.setValue('productDetails.taxRate', order?.productId?.tax_rate?.toString() || "");
        form.setValue('productDetails.taxableValue', order?.productId?.taxable_value?.toString() || "");
        // form.setValue('pickupAddress', order?.pickupAddress._id || "");

        form.setValue('sellerDetails.sellerName', order?.sellerDetails?.sellerName || "");
        form.setValue('sellerDetails.sellerGSTIN', order?.sellerDetails?.sellerGSTIN || "");
        form.setValue('sellerDetails.isSellerAddressAdded', order?.sellerDetails?.isSellerAddressAdded || false);
        form.setValue('sellerDetails.sellerPincode', order?.sellerDetails?.sellerPincode?.toString() || "");
        form.setValue('sellerDetails.sellerAddress', order?.sellerDetails?.sellerAddress || "");
        form.setValue('sellerDetails.sellerPhone', order?.sellerDetails?.sellerPhone?.toString() || "");
        form.setValue('sellerDetails.sellerCity', order?.sellerDetails?.sellerCity || "");
        form.setValue('sellerDetails.sellerState', order?.sellerDetails?.sellerState || "");

        form.setValue('customerDetails.name', order?.customerDetails?.name || "");
        form.setValue('customerDetails.phone', order?.customerDetails?.phone?.toString() || "");
        form.setValue('customerDetails.address', order?.customerDetails?.address || "");
        form.setValue('customerDetails.pincode', order?.customerDetails?.pincode?.toString() || "");
        form.setValue('customerDetails.state', order?.customerDetails?.state || "");
        form.setValue('customerDetails.city', order?.customerDetails?.city || "");

        form.setValue('isReverseOrder', order?.isReverseOrder || false)
        form.setValue('ewaybill', order?.ewaybill?.toString() || "");

    }, [form, order]);


    useEffect(() => {
        if (customerCityState.city) {
            form.setValue('customerDetails.city', customerCityState.city);
            form.setValue('customerDetails.state', customerCityState.state);
        }
    }, [customerCityState.city, customerCityState.state, form, order?.customerDetails?.city]);

    useEffect(() => {
        if (sellerCityState.city) {
            form.setValue('sellerDetails.sellerCity', sellerCityState.city);
            form.setValue('sellerDetails.sellerState', sellerCityState.state);
        }
    }, [sellerCityState.city, sellerCityState.state, form, order?.sellerDetails?.sellerCity]);

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
    const handleClose = () => {
        // form.reset();
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof EditFormSchema>) => {
        try {
            const isSuccess = await handleUpdateOrder(values)
            if (isSuccess == true) {
                // form.reset();
                router.refresh()
                handleClose()
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <Drawer open={isModalOpen} direction="right" onClose={handleClose}>
            <DrawerContent className="rounded-t-[10px] h-full fixed bottom-0 left-0 sm:left-80 w-full sm:w-auto">
                <DrawerHeader>
                    <DrawerTitle className="flex items-center space-x-2">
                        <Button size={"icon"} variant={"secondary"} onClick={handleClose}>
                            <Undo2 size={20} />
                        </Button>
                        <span>Edit Order</span>
                        <span className="font-medium underline underline-offset-4 text-blue-800">
                            {order?.order_reference_id}
                        </span>
                    </DrawerTitle>
                </DrawerHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            <div className="col-span-1 sm:col-span-3 space-y-2">
                                <div className="space-y-3 border border-gray-200 py-3 rounded-lg">
                                    <h4 className="flex items-center text-xl font-semibold tracking-tight pl-6">
                                        <Package className='mr-3' size={20} />Order Details
                                    </h4>
                                    <OrderDetailForm
                                        isDisabledPaymentMode={true}
                                        seller={seller}
                                        form={form}
                                        orderRefDisable={true}
                                        isLoading={isLoading}
                                        handleDecrement={handleDecrement}
                                        handleIncrement={handleIncrement}
                                        collectableFeild={collectableFeild}
                                    />
                                </div>
                                <div className="space-y-3 border border-gray-200 py-3 rounded-lg">
                                    <h4 className="flex items-center text-xl font-semibold tracking-tight pl-6">
                                        <MapPin className='mr-3' size={20} />Seller Details
                                    </h4>
                                    <SellerForm
                                        form={form}
                                        isLoading={isLoading}
                                        isPinLoading={isSellerPinLoading}
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                <div className="space-y-3 border border-gray-200 py-3 rounded-lg">
                                    <h4 className="flex items-center text-xl font-semibold tracking-tight pl-6">
                                        <MapPin className='mr-3' size={20} />Delivery Details
                                    </h4>
                                    <div className="px-6">
                                        <FormField
                                            control={form.control}
                                            name="pickupAddress"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                                                        Select Facility <span className='text-red-500'>*</span>
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={cn(
                                                                        "justify-between bg-slate-100 text-black border-0",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value
                                                                        ? sellerFacilities.find((facility) => facility._id === field.value)?.name
                                                                        : "Select Facility"}
                                                                    <LucideSeparatorHorizontal className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[245px] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Search Pickup..." className="h-9" />
                                                                <CommandList>
                                                                    <CommandEmpty>No Pickup Address found.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {sellerFacilities.map((facility) => (
                                                                            <CommandItem
                                                                                value={facility.name}
                                                                                key={facility._id}
                                                                                onSelect={() => {
                                                                                    form.setValue("pickupAddress", facility._id)
                                                                                }}
                                                                            >
                                                                                <div className="capitalize">
                                                                                    {facility.name}
                                                                                    <div className="text-xs pl-1 pt-1">
                                                                                        <span>Address:</span>
                                                                                        <div className="font-semibold">{facility.address1}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <CheckIcon
                                                                                    className={cn(
                                                                                        "ml-auto h-4 w-4",
                                                                                        facility._id === field.value ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <AddCustomerForm
                                        form={form}
                                        isLoading={isLoading}
                                        isPinLoading={isCusPinLoading}
                                    />
                                </div>
                                <div className="space-y-3 border border-gray-200 py-3 rounded-lg">
                                    <h4 className="flex items-center text-xl font-semibold tracking-tight pl-6">
                                        <Box className='mr-3' size={20} />Box Details
                                    </h4>
                                    <BoxDetails form={form} isLoading={isLoading} />
                                </div>
                            </div>
                        </div>
                        <DrawerFooter className="flex flex-row-reverse">
                            <Button type="submit" variant={"themeButton"}>Update Order</Button>
                            <DrawerClose onClick={handleClose} className={buttonVariants({ variant: "secondary" })}>
                                Cancel
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </Form>
            </DrawerContent>
        </Drawer>



    )
}


