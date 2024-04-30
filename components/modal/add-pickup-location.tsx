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
    FormDescription,
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
import { useHubProvider } from '../providers/HubProvider';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { PhoneInput } from '../ui/phone-input';
import { useSellerProvider } from '../providers/SellerProvider';
import { useEffect } from 'react';
import useFetchCityState from '@/hooks/use-fetch-city-state';
import { LoadingSpinner } from '../loading-spinner';

export const pickupAddressFormSchema = z.object({
    facilityName: z.string().min(1, "Facility name is required"),
    contactPersonName: z.string().min(1, "Contact person name is required"),
    phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    email: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    country: z.string().min(1, "Country is required"),
    pincode: z.string().min(1, "Pincode is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    isRTOAddressSame: z.boolean().optional(),
    rtoAddress: z.string().optional(),
    rtoCity: z.string().optional(),
    rtoState: z.string().optional(),
    rtoPincode: z.string().optional(),
});


export const AddPickupLocationModal = () => {
    const { handleCreateHub } = useHubProvider();
    const { getCityStateFPincode } = useSellerProvider();
    const { isOpen, onClose, type } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "addPickupLocation";

    const form = useForm({
        resolver: zodResolver(pickupAddressFormSchema),
        defaultValues: {
            facilityName: "",
            contactPersonName: "",
            phone: "",
            email: "",
            address: "",
            country: "India",
            pincode: "",
            city: "",
            state: "",
            isRTOAddressSame: true,
            rtoAddress: "",
            rtoCity: "",
            rtoState: "",
            rtoPincode: "",
        }
    });


    const { cityState: cityStateRes, isTyping: isPinloading } = useFetchCityState(form.watch("pincode"));
    const { cityState: rtoCityStateRes, isTyping: isRTOPinloading } = useFetchCityState(form.watch("rtoPincode"));

    useEffect(() => {
        if (cityStateRes) {
            form.setValue('city', cityStateRes.city)
            form.setValue('state', cityStateRes.state)
        }
        if (rtoCityStateRes) {
            form.setValue('rtoCity', rtoCityStateRes.city)
            form.setValue('rtoState', rtoCityStateRes.state)
        }
    }, [cityStateRes, form, rtoCityStateRes])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof pickupAddressFormSchema>) => {
        try {

            handleCreateHub({
                name: values.facilityName,
                email: values.email,
                pincode: values.pincode,
                address1: values.address,
                address2: values.address,
                phone: values.phone, 
                city: values.city,
                state: values.state,
                contactPersonName: values.contactPersonName
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
            <DialogContent className="bg-white dark:text-white text-black p-0 max-w-2xl">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold">
                        Add Pickup Location
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AddPickupLocationForm isLoading={isLoading} form={form} isPinLoading={isPinloading} isRTOPinLoading={isRTOPinloading} />
                        <DialogFooter className="px-6 py-4">
                            <Button onClick={() => form.reset()} disabled={isLoading} variant={'secondary'} type='button'>
                                Reset
                            </Button>
                            <Button disabled={isLoading} variant={'themeButton'} type='submit'>
                                Add Pickup Location
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};

export const AddPickupLocationForm = ({ isLoading, form, isPinLoading, isRTOPinLoading }: { isRTOPinLoading: boolean, isLoading: boolean, isPinLoading: boolean, form: any }) => {
    return (
        <div className="grid grid-cols-2 px-6 gap-3">
            <FormField
                control={form.control}
                name="facilityName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Facility Name <span className='text-red-500'>*</span>
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
                name="contactPersonName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Contact Person Name<span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Enter the contact person name"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Pickup Location Contact <span className='text-red-500'>*</span>
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
                name="email"
                render={({ field }) => (
                    <FormItem className='pt-2'>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            <div className='flex justify-between'>Email<span className='opacity-60'>Optional</span></div>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Enter email address"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem className='col-span-2'>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Address Line <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Enter address"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>This will be used in the invoices that you will print.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Pincode <span className='text-red-500'>*</span>
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
                name="city"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            City <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <div className='flex items-center bg-zinc-300/50 rounded-md pr-3'>
                                <Input
                                    disabled={isLoading || isPinLoading}
                                    className="bg-transparent border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the city"
                                    {...field}
                                />
                                {isPinLoading && <LoadingSpinner />}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            State <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <div className='flex items-center bg-zinc-300/50 rounded-md pr-3'>
                                <Input
                                    disabled={isLoading || isPinLoading}
                                    className="bg-transparent border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the state"
                                    {...field}
                                />
                                {isPinLoading && <LoadingSpinner />}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="country"
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
            <div className='col-span-2 items-center'>
                <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">
                    Return Details
                </h3>
                <FormField
                    control={form.control}
                    name="isRTOAddressSame"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-0 p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="leading-none">
                                <FormLabel>
                                    Return address is the same as Pickup Address.
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
            </div>
            {
                !form.watch('isRTOAddressSame') && (
                    <>
                        <FormField
                            control={form.control}
                            name="rtoAddress"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
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
                            name="rtoCity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        City
                                    </FormLabel>
                                    <FormControl>
                                        <div className='flex items-center bg-zinc-300/50 rounded-md pr-3'>
                                            <Input
                                                disabled={isLoading || isRTOPinLoading}
                                                className="bg-transparent border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter the city"
                                                {...field}
                                            />
                                            {isRTOPinLoading && <LoadingSpinner />}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rtoPincode"
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
                            name="rtoState"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        State
                                    </FormLabel>
                                    <FormControl>
                                        <div className='flex items-center bg-zinc-300/50 rounded-md pr-3'>
                                            <Input
                                                disabled={isLoading || isRTOPinLoading}
                                                className="bg-transparent border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter the state"
                                                {...field}
                                            />
                                            {isRTOPinLoading && <LoadingSpinner />}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
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