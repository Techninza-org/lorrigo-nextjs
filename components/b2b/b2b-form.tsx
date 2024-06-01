'use client'
import React, { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm, useFieldArray } from 'react-hook-form'
import { Input } from '../ui/input'
import { useSellerProvider } from '../providers/SellerProvider'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '../ui/select'
import { Car, CircleUserRound, PackageOpen, PersonStanding, PersonStandingIcon } from 'lucide-react'
import { useModal } from '@/hooks/use-model-store'
import { B2bBoxDetails } from './b2b-box-details'
import { Button } from '../ui/button'
import ImageUpload from '../file-upload'
import { Label } from '../ui/label'
import { useRouter } from 'next/navigation'

export const b2bformDataSchema = z.object({
    order_reference_id: z.string().min(1, "Order reference id is required"),
    client_name: z.string().min(1, "Client name is required"),
    pickupAddress: z.string().min(1, "Pickup address is required"),
    product_description: z.string().min(1, "Product description is required"),
    total_weight: z.string().min(1, "Total weight is required"),
    quantity: z.string().min(1, "Quantity is required"),
    boxes: z.array(z.object({
        qty: z.string().optional(),
        orderBoxLength: z.string().optional(),
        orderBoxWidth: z.string().optional(),
        orderBoxHeight: z.string().optional(),
        orderBoxWeight: z.string().optional(),
        boxWeightUnit: z.string().optional(),
        boxSizeUnit: z.string().optional(),
    })).min(1, "At least one box is required"),
    customerDetails: z.string().min(1, "Customer is required"),
    ewaybill: z.string().optional(),
    amount: z.string().min(1, "Amount is required"),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoice: z.string().optional(),
    supporting_document: z.string().optional(),
});

export default function B2BForm() {
    const { seller, sellerFacilities, b2bCustomers, handleCreateB2BOrder } = useSellerProvider();

    const client  = seller?.companyProfile.companyName || seller?.name;
    const router = useRouter()
    
    const { onOpen } = useModal()

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
                { qty: "", orderBoxLength: "", orderBoxWidth: "", orderBoxHeight: "", orderBoxWeight: "", boxWeightUnit: "kg", boxSizeUnit: "cm"}
            ],
            customerDetails: "",
            invoice: "",
            supporting_document: "",
        }
    })

    const { fields, append } = useFieldArray({
        control: form.control,
        name: "boxes"
    });

    const isLoading = form.formState.isSubmitting;

    const handleFileChange = ({ fieldName, file }: { fieldName: any, file: File }) => {
        form.setValue(fieldName, file as any);
    };

    const handleInvoice = ({ fieldName, file }: { fieldName: any, file: File }) => {
        form.setValue(fieldName, file as any);
    }

    useEffect(() => {
        form.setValue('client_name', seller?.companyProfile.companyName || '');
    }, [seller])

    const onSubmit = async (values: z.infer<typeof b2bformDataSchema>) => {
        try{
            console.log(values)
            const isSuccess = await handleCreateB2BOrder(values);
            if(isSuccess){
                form.reset();
                router.push('/orders/b2b');
            }
        }catch(e){
            console.log(e)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className='space-x-2'>
                        <span>Create a new shipment (B2B)</span>
                    </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-5 gap-4">
                    <div className='col-span-2 space-y-4'>
                        <Card>
                            <CardContent className='space-y-6 mt-4'>
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
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Pickup Address</CardTitle>
                            </CardHeader>
                            <CardContent className='mt-4'>

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
                                                        <SelectValue placeholder="Select facility" />
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
                            <B2bBoxDetails
                                form={form}
                                isLoading={isLoading}
                                fields={fields}
                                append={append}
                            />
                        </Card>

                    </div>
                    <div className='col-span-3 space-y-3'>
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
                                                        <SelectValue placeholder="Select customer" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-72">
                                                        <SelectSeparator className="h-10 text-center cursor-pointer items-center flex justify-center text-rose-500" onClick={() => onOpen("addCustomer")}><PersonStanding size={18} className="mr-3" />Add New Customer</SelectSeparator>
                                                        {b2bCustomers.length > 0 ? (b2bCustomers.map((facility: any) => (
                                                            <SelectItem key={facility._id} value={facility._id} className="capitalize">
                                                                {facility.name}
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
                            <CardHeader>
                                <CardTitle>Upload Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='flex gap-10 justify-around'>
                                    <div className='w-60'>
                                        <Label className='font-semibold'>1. Invoice <span className='text-red-500'>*</span></Label>
                                        <ImageUpload
                                        // fieldName='invoice'
                                        handleFileChange={handleInvoice}
                                        
                                        />
                                        <FormMessage />
                                    </div>
                                    <div className='w-60'>
                                        <Label className='font-semibold'>2. Supporting Document (optional)</Label>
                                        <ImageUpload
                                        handleFileChange={handleFileChange}
                                        />

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Button type='submit' variant={"themeButton"} className='my-6'>Create Shipment</Button>
            </form>
        </Form>
    )
}
