"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Form, FormField } from '../ui/form';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { OrderDetailForm } from './b2c-order-form';
import { DeliveryDetailsForm } from './delivery-details-form';
import { MapPin, PackageOpen, Undo2 } from 'lucide-react';
import { useSellerProvider } from '../providers/SellerProvider';
import { Button } from '../ui/button';
import { BoxDetails } from './box-details';
import { useRouter } from 'next/navigation';


// Define the schema for product details
const productDetailsSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    category: z.string().min(1, "Product category is required"),
    hsn_code: z.string().optional(),
    quantity: z.string().min(1, "Product quantity is required"),
    taxRate: z.string().min(1, "Product tax rate is required"),
    taxableValue: z.string().min(1, "Product taxable value is required"),
});


export const formDataSchema = z.object({
    order_reference_id: z.string().min(1, "Order reference id is required"),
    fragile_items: z.boolean().default(false).optional(),
    payment_mode: z.string().min(1, "Payment mode is required"),
    orderWeight: z.string().min(1, "Order weight is required"),
    order_invoice_date: z.date(),
    order_invoice_number: z.string().optional(),
    numberOfBoxes: z.enum(["1", "2", "3", "4", "5"], {
        required_error: "You need to select a notification type.",
    }),
    orderSizeUnit: z.string().min(1, "Order size unit is required"),
    orderBoxHeight: z.string().min(1, "Order box height is required"),
    orderBoxWidth: z.string().min(1, "Order box width is required"),
    orderBoxLength: z.string().min(1, "Order box length is required"),
    amount2Collect: z.string().optional(),
    productDetails: productDetailsSchema,
    pickupAddress: z.string().min(1, "Pickup address is required")
});


export const B2CForm = () => {
    const { handleCreateOrder } = useSellerProvider();
    const router = useRouter();

    const [collectableFeild, setCollectableFeild] = useState(false);
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);

    const form = useForm({
        resolver: zodResolver(formDataSchema),
        defaultValues: {
            order_reference_id: "",
            fragile_items: false,
            payment_mode: "",
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
            pickupAddress: ""
        }
    });

    const { setValue } = form
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
        setValue('productDetails.quantity', (currentValue + 1).toString());
    };

    const handleDecrement = () => {
        const currentValue = parseInt(form.watch('productDetails.quantity').toString(), 10) || 0;
        if (currentValue > 0) {
            setValue('productDetails.quantity', (currentValue - 1).toString());
        }
    };

    const onSubmit = async (values: z.infer<typeof formDataSchema>) => {
        try {
            const isSuccess = await handleCreateOrder({
                ...values,
                customerDetails: {
                    name: '',
                    phone: '',
                    address: '',
                    pincode: ''
                },
                sellerDetails: {
                    sellerName: ''
                }
            });
            if (isSuccess == true) {
                form.reset();
                router.push('/orders');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 gap-2">
                    <Card className='col-span-3 space-y-3'>
                        <CardHeader>
                            <CardTitle className='space-x-2'>
                                {/* <Button type='button' size={"icon"} variant={"secondary"} onClick={()=>router.back()}>
                                    <Undo2 size={20} />
                                </Button> */}
                                <span>Create a new shipment (D2C)</span>
                            </CardTitle>
                            <CardDescription>Order Details</CardDescription>
                        </CardHeader>
                        <OrderDetailForm
                            form={form}
                            isLoading={isLoading}
                            handleDecrement={handleDecrement}
                            handleIncrement={handleIncrement}
                            collectableFeild={collectableFeild}
                        />
                        <CardFooter className='flex-row-reverse'>
                            <Button disabled={isLoading} type='submit' variant={'themeButton'} >Create Shipment</Button>
                            <Button disabled={isLoading} variant={'secondary'} type='button' onClick={() => router.push("/dashboard")}>Go to dashboard</Button>
                        </CardFooter>
                    </Card>

                    <div className='space-y-3'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center'><MapPin className='mr-3' size={20} />Delivery Details</CardTitle>
                            </CardHeader>
                            <DeliveryDetailsForm
                                form={form}
                                isLoading={isLoading}
                            />
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center'><PackageOpen size={23} className='mr-3' />Box Size</CardTitle>
                            </CardHeader>
                            <BoxDetails
                                form={form}
                                isLoading={isLoading}
                            />
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}