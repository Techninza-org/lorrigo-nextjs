'use client'
import React, { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { useForm, useFieldArray } from 'react-hook-form'
import { Input } from '../../ui/input'
import { useSellerProvider } from '../../providers/SellerProvider'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '../../ui/select'
import { Car, CircleUserRound, PackageOpen, PersonStanding, PersonStandingIcon } from 'lucide-react'
import { useModal } from '@/hooks/use-model-store'
import { B2bBoxDetails } from './b2b-box-details'
import { Button } from '../../ui/button'
import ImageUpload from '../../file-upload'
import { Label } from '../../ui/label'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { base64ToFile, generateOrderID } from '@/lib/utils'
import Image from 'next/image'
import { useToast } from '@/components/ui/use-toast'

export const b2bformDataSchema = z.object({
    client_order_reference_id: z.string().optional(),
    order_reference_id: z.string().min(1, "Order reference id is required"),
    client_name: z.string().min(1, "Client name is required"),
    pickupAddress: z.string().min(1, "Pickup address is required"),
    product_description: z.string().min(1, "Product description is required"),
    total_weight: z
        .string()
        .min(1, "Total weight is required")
        .refine((val) => !isNaN(parseFloat(val)), {
            message: "Total weight must be a valid number",
            path: ["total_weight"],
        }),
    quantity: z
        .string()
        .min(1, "Quantity is required")
        .refine((val) => !isNaN(parseFloat(val)), {
            message: "Quantity must be a valid number",
            path: ["quantity"],
        }),
    boxes: z
        .array(
            z.object({
                qty: z
                    .string()
                    .min(1, "Quantity is required")
                    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
                        message: "Box quantity must be a valid number greater than zero",
                        path: ["qty"],
                    }),
                orderBoxLength: z
                    .string()
                    .optional()
                    .refine((val) => val === undefined || (val && !isNaN(parseFloat(val)) && parseFloat(val) > 0), {
                        message: "Length must be a valid number greater than zero",
                        path: ["orderBoxLength"],
                    }),
                orderBoxWidth: z
                    .string()
                    .optional()
                    .refine((val) => val === undefined || (val && !isNaN(parseFloat(val)) && parseFloat(val) > 0), {
                        message: "Width must be a valid number greater than zero",
                        path: ["orderBoxWidth"],
                    }),
                orderBoxHeight: z
                    .string()
                    .optional()
                    .refine((val) => val === undefined || (val && !isNaN(parseFloat(val)) && parseFloat(val) > 0), {
                        message: "Height must be a valid number greater than zero",
                        path: ["orderBoxHeight"],
                    }),
                orderBoxWeight: z
                    .string()
                    .optional()
                    .refine((val) => val === undefined || (val && !isNaN(parseFloat(val)) && parseFloat(val) > 0), {
                        message: "Weight must be a valid number greater than zero",
                        path: ["orderBoxWeight"],
                    }),
                boxWeightUnit: z.string().optional(),
                boxSizeUnit: z.string().optional(),
            })
        )
        .min(1, "At least one box is required"),
    customerDetails: z.string().min(1, "Customer is required"),
    ewaybill: z.string().optional(),
    amount: z.string().min(1, "Amount is required"),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoice: z.any().optional(),
    supporting_document: z.any().optional(),
})
    .refine((data) => {
        const totalWeight = parseFloat(data.total_weight);
        const quantity = parseFloat(data.quantity);

        const totalBoxWeight = data.boxes.reduce(
            (sum, box) => sum + parseFloat(box.orderBoxWeight || '0') * parseFloat(box.qty),
            0
        );
        const totalBoxQuantity = data.boxes.reduce(
            (sum, box) => sum + parseFloat(box.qty || '0'),
            0
        );

        if (totalWeight !== totalBoxWeight) {
            return false;
        }
        if (quantity !== totalBoxQuantity) {
            return false;
        }

        return true;
    }, {
        message: "Total weight is the sum of the weights of all the products.",
        path: ["total_weight"],
    }).refine(data => {
        if (parseFloat(data.amount) >= 50000) {
            return (data.ewaybill ?? "").length === 12;
        }
        return true;
    }, {
        message: "Ewaybill is required and must be 12 digits for order value >= 50,000",
        path: ["ewaybill"]
    });


export default function B2BForm() {
    const { handleCreateB2BOrder } = useSellerProvider();

    const { toast } = useToast()

    const { seller, orders } = useSellerProvider();
    const { user } = useAuth();

    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(b2bformDataSchema),
        defaultValues: {
            order_reference_id: '',
            client_name: '',
            pickupAddress: "",
            ewaybill: "",
            amount: "",
            invoiceNumber: "",
            product_description: "",
            total_weight: "",
            quantity: "",
            boxes: [
                { qty: "", orderBoxLength: "", orderBoxWidth: "", orderBoxHeight: "", orderBoxWeight: "", boxWeightUnit: "kg", boxSizeUnit: "cm" }
            ],
            customerDetails: "",
            invoice: undefined,
            supporting_document: undefined,
        }
    })

    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        form.setValue('client_name', seller?.companyProfile?.companyName || user?.name || '');
    }, [form, seller, user?.name])

    useEffect(() => {
        form.setValue('order_reference_id', generateOrderID((seller?.companyProfile?.companyName || user?.name) || "@@", `${orders?.length || 0}`))
    }, [form, orders?.length, seller?.companyProfile?.companyName, user?.name])

    const onSubmit = async (values: z.infer<typeof b2bformDataSchema>) => {
        try {

            if (!form.watch('invoice')) {
                toast({
                    variant: 'destructive',
                    title: 'Invoice is required'
                })
                return
            }
            const isSuccess = await handleCreateB2BOrder(values);
            if (isSuccess) {
                form.reset();
                router.push('/orders/b2b');
            }
        } catch (error) {
            console.log(error, "error")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className='col-span-3 space-y-3'>
                    <CardHeader>
                        <CardTitle className='space-x-2'>
                            <span>Create a new shipment (B2B)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                    <Button type='submit' variant={"themeButton"} className='my-6'>Create Shipment</Button>
                </Card>
            </form>

        </Form>
    )
}


export const B2BShipmentDetailsForm = ({ form, isLoading }: { form: any, isLoading: boolean }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "boxes"
    });

    return (
        <>
            <Card>
                <CardContent className='space-y-6 mt-4'>
                    <FormField
                        control={form.control}
                        name="client_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                >
                                    Client Name <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={true}
                                        className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder={`Client Name`}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="order_reference_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                >
                                    Order ID/Reference Number <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}  // || orderRefDisable
                                        className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter the order reference ID"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Shipment Details</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <FormField
                        control={form.control}
                        name="product_description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Product Description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="total_weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Total weight (Kg)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Quantity (Total no. of boxes)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center'><PackageOpen size={23} className='mr-3' />Dimensions</CardTitle>
                </CardHeader>
                <CardContent>
                    <B2bBoxDetails
                        form={form}
                        isLoading={isLoading}
                        fields={fields}
                        append={append}
                        remove={remove}
                    />
                </CardContent>
            </Card>
        </>
    )
}

export const B2BAddAmtDocForm = ({ form, isLoading }: { form: any, isLoading: boolean }) => {

    const { b2bCustomers, sellerFacilities } = useSellerProvider();
    const { onOpen } = useModal()

    const handleFileChange = ({ fieldName, file }: { fieldName: any, file: File }) => {
        form.setValue(fieldName, file as any);
    };

    const handleInvoice = ({ fieldName, file }: { fieldName: any, file: File }) => {
        form.setValue(fieldName, file as any);
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Pickup Address</CardTitle>
                </CardHeader>
                <CardContent>

                    <FormField
                        control={form.control}
                        name="pickupAddress"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                >
                                    Select Facility<span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}

                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={sellerFacilities.find((item) => item._id === form.watch("pickupAddress"))?.name || "Select facility"} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            <SelectSeparator className="h-10 text-center cursor-pointer items-center flex justify-center text-rose-500" onClick={() => onOpen("addPickupLocation")}><Car size={18} className="mr-3" />Add Pickup location</SelectSeparator>
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
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Receiver Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="customerDetails"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                >
                                    Select Customer<span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={b2bCustomers.find((item) => item._id === form.watch("customerDetails"))?.name || "Select customer"} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            <SelectSeparator className="h-10 text-center cursor-pointer items-center flex justify-center text-rose-500" onClick={() => onOpen("addCustomer")}><PersonStanding size={18} className="mr-3" />Add New Customer</SelectSeparator>
                                            {b2bCustomers.length > 0 ? (b2bCustomers.map((customer: any) => (
                                                <SelectItem key={customer._id} value={customer._id} className="capitalize">
                                                    {customer.name}
                                                </SelectItem>
                                            ))) : (
                                                <SelectItem value="noFacility" className="capitalize" disabled={true}>
                                                    No customer available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <div className='grid grid-cols-3 mt-4 gap-4'>
                        <FormField
                            control={form.control}
                            name="ewaybill"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 flex justify-center">
                                        <span>E-Waybill</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="E-Waybill"
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
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 flex justify-center">
                                        <span>Amount</span><span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Amount"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="invoiceNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 flex justify-center">
                                        <span>Inovice No</span><span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Invoice Number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Documents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex gap-10 justify-around'>
                        <div className='w-60'>
                            <Label className='font-semibold'>1. Invoice <span className='text-red-500'>*</span></Label>

                            <ImageUpload
                                handleFileChange={handleInvoice}
                                fieldName={"invoice" as any}
                                uploadedFile={form.watch('invoice') instanceof File ? form.watch('invoice') : base64ToFile(`data:image/jpeg;base64,${form.watch('invoice')}`, "invoice", "image/jpeg")}
                                acceptFileTypes={{ 'application/pdf': ['.pdf'] }}
                            />
                            <FormMessage />
                        </div>
                        <div className='w-60'>
                            <Label className='font-semibold'>2. Supporting Document (optional)</Label>
                            <ImageUpload
                                handleFileChange={handleFileChange}
                                fieldName={"supporting_document" as any}
                                uploadedFile={form.watch('supporting_document') instanceof File ? form.watch('supporting_document') : base64ToFile(`data:image/jpeg;base64,${form.watch('supporting_document')}`, "supporting_document", "image/jpeg")}
                                acceptFileTypes={{ 'application/pdf': ['.pdf'] }}
                            />
                            <FormMessage />

                        </div>
                    </div>
                </CardContent>
            </Card>

        </>
    )
}