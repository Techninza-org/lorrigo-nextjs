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
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";


import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { useSellerProvider } from "@/components/providers/SellerProvider";

import { Undo2 } from "lucide-react";
import { B2BAddAmtDocForm, B2BShipmentDetailsForm, b2bformDataSchema } from "@/components/Orders/b2b/b2b-form";
import { useAuth } from "@/components/providers/AuthProvider";
import { generateOrderID } from "@/lib/utils";


export function CloneB2BOrderDrawer() {
    const { seller, orders, handleCreateB2BOrder } = useSellerProvider();
    const { user } = useAuth();

    const { isOpen, onClose, type, data } = useModal();
    const { b2bOrder } = data;
    const isModalOpen = isOpen && type === "cloneB2BOrder";

    const form = useForm<z.infer<typeof b2bformDataSchema>>({
        resolver: zodResolver(b2bformDataSchema),
    });

    useEffect(() => {
        form.setValue('client_name', seller?.companyProfile.companyName || user?.name || '');
    }, [form, seller, user?.name])

    useEffect(() => {
        form.setValue('order_reference_id', generateOrderID((seller?.companyProfile?.companyName || user?.name) || "@@", `${orders?.length || 0}`))
    }, [form, orders?.length, seller?.companyProfile?.companyName, user?.name])

    useEffect(() => {

        form.setValue("product_description", b2bOrder?.product_description || "")
        form.setValue("total_weight", b2bOrder?.total_weight.toString() || "")
        form.setValue("quantity", b2bOrder?.quantity.toString() || "")

        form.setValue("boxes", b2bOrder?.packageDetails || [])
        form.setValue("pickupAddress", b2bOrder?.pickupAddress?._id || "")
        form.setValue("customerDetails", b2bOrder?.customer?._id ?? "")

        form.setValue("ewaybill", b2bOrder?.ewaybill || "")
        form.setValue("amount", b2bOrder?.amount.toString() || "")
        form.setValue("invoiceNumber", b2bOrder?.invoiceNumber || "")

        form.setValue("invoice", b2bOrder?.invoiceImg)
        form.setValue("supporting_document", b2bOrder?.supporting_document || "")
    }, [form, b2bOrder]);

    const isLoading = form.formState.isSubmitting;
    const {errors} = form.formState;

    const handleClose = () => {
        // form.reset();
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof b2bformDataSchema>) => {
        try {
            console.log(values)
            const isSuccess = await handleCreateB2BOrder(values)
            if (isSuccess == true) {
                // form.reset();
                handleClose()
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Drawer open={isModalOpen} direction="right" onClose={handleClose}>

            <DrawerContent className="rounded-t-[10px] h-full fixed bottom-0 left-80">
                <DrawerHeader>
                    <DrawerTitle className="flex items-center space-x-2">
                        <Button size={"icon"} variant={"secondary"} onClick={handleClose}>
                            <Undo2 size={20} />
                        </Button>
                        <span>Edit Order</span>
                        <span className="font-medium underline underline-offset-4 text-blue-800">
                            {b2bOrder?.order_reference_id}
                        </span>
                    </DrawerTitle>
                </DrawerHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <div className="grid grid-cols-4 gap-3">
                            <div className='col-span-2 space-y-4'>
                                <B2BShipmentDetailsForm
                                    form={form}
                                    isLoading={isLoading}

                                />
                            </div>
                            <div className='col-span-2 space-y-3'>
                                <B2BAddAmtDocForm
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


