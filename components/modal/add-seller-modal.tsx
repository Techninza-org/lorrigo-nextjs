"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { Checkbox } from '../ui/checkbox';
import { PhoneInput } from '../ui/phone-input';
import { useSellerProvider } from '../providers/SellerProvider';
import { useEffect } from 'react';

// sellerName
// sellerGSTIN
// isSellerAddressAdded
// sellerPincode
// sellerAddress
// sellerPhone
// sellerCity
// sellerState
export const sellerSchema = z.object({
    sellerDetails: z.object({
        sellerName: z.string().min(1, "Seller name is required"),
        sellerGSTIN: z.string().optional(),
        isSellerAddressAdded: z.boolean().optional(),
        sellerPincode: z.string().optional(),
        sellerAddress: z.string().optional(),
        sellerPhone: z.string().optional(),
        sellerCity: z.string().optional(),
        sellerState: z.string().optional(),
    })
})

export const AddSellerModal = () => {
    const { setSellerCustomerForm, sellerCustomerForm, getCityStateFPincode } = useSellerProvider();
    const { isOpen, onClose, type } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "addSeller";

    const form = useForm({
        resolver: zodResolver(sellerSchema),
        defaultValues: {
            sellerDetails: {
                // name: "",
                // gstNo: "",
                // isSellerAddressAdded: false,
                // pincode: "",
                // address: "",
                // phone: "",
                // city: "",
                // state: "",
                // country: "India"
                sellerName: "",
                sellerGSTIN: "",
                isSellerAddressAdded: false,
                sellerPincode: "",
                sellerAddress: "",
                sellerPhone: "",
                sellerCity: "",
                sellerState: "",
                country: "India"

            }
        }
    });

    const pincode = form.watch('sellerDetails.sellerPincode');
    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;

        const fetchCityState = async () => {
            if (pincode.length > 4) {
                const cityStateRes = await getCityStateFPincode(pincode)
                form.setValue('sellerDetails.sellerCity', cityStateRes.city)
                form.setValue('sellerDetails.sellerState', cityStateRes.state)
            }
        };

        // Debouncing the function
        clearTimeout(timer);
        timer = setTimeout(fetchCityState, 500);

        return () => clearTimeout(timer);
    }, [pincode])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof sellerSchema>) => {
        try {

            setSellerCustomerForm({
                ...sellerCustomerForm,
                sellerForm: {
                    ...sellerCustomerForm.sellerForm,
                    ...values.sellerDetails
                }
            });
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 overflow-hidden max-w-xl">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold">
                        Add Seller Details
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <SellerForm isLoading={isLoading} form={form} />
                        <DialogFooter className="px-6 py-4">
                            <Button onClick={() => form.reset()} disabled={isLoading} variant={'secondary'} type='button'>
                                Reset
                            </Button>
                            <Button disabled={isLoading} variant={'themeButton'} type='submit'>
                                Add Seller
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};

export const SellerForm = ({ isLoading, form }: { isLoading: boolean, form: any }) => {
    return (
        <div className="grid grid-cols-2 px-6 gap-3">
            <FormField
                control={form.control}
                name="sellerDetails.sellerName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Seller Name <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Enter the seller name"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="sellerDetails.sellerGSTIN"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            GST No.
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Enter the GST No."
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='col-span-2 flex items-center space-x-3'>
                <div className='grid grid-cols-2 gap-3'>
                    <FormField
                        control={form.control}
                        name="sellerDetails.isSellerAddressAdded"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Add Seller Address
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            {
                form.watch('sellerDetails.isSellerAddressAdded') && (
                    <>
                        <FormField
                            control={form.control}
                            name="sellerDetails.sellerAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter the address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sellerDetails.sellerPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Contact Number
                                    </FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            disabled={isLoading}
                                            className="bg-zinc-300/10 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            defaultCountry='IN'
                                            placeholder='Enter the contact number'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sellerDetails.sellerPincode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Pincode
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter the pincode"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sellerDetails.sellerCity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        City
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter the city"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sellerDetails.sellerState"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        State
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter the state"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sellerDetails.country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Country
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={true}
                                            className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter the country"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )
            }
        </div>
    )
}