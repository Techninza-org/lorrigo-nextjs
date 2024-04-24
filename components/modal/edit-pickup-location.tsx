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
import { AddPickupLocationForm, pickupAddressFormSchema } from './add-pickup-location';
import { PhoneInput } from '../ui/phone-input';
import { useSellerProvider } from '../providers/SellerProvider';
import { useEffect, } from 'react';
import useFetchCityState from '@/hooks/use-fetch-city-state';
import { useHubProvider } from '../providers/HubProvider';
import { format } from 'path';
import { formatPhoneNumberIntl } from 'react-phone-number-input';




export const EditPickupLocationModal = () => {
    const { sellerFacilities } = useSellerProvider();
    const { editPickupLocation } = useHubProvider();
    const { isOpen, onClose, type, data } = useModal();
    const { hub } = data;
    const id = String(hub?._id);
    const router = useRouter();
    const isEditModalOpen = isOpen && type === "editPickupLocation";


    const form = useForm({
        resolver: zodResolver(pickupAddressFormSchema),
        defaultValues: {
            facilityName: "",
            contactPersonName: "",
            pickupLocContact: "",
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

    // const { formState: { errors } } = form;
    // console.log("errors", errors);


    useEffect(() => {
        if (hub) {
            form.setValue('facilityName', hub.name || '');
            form.setValue('contactPersonName', hub.contactPersonName || '');
            form.setValue('pickupLocContact', `+${hub.phone}` || '');
            form.setValue('email', hub?.email || '');
            form.setValue('address', hub.address1 || '');
            form.setValue('pincode', String(hub.pincode) || '');
            form.setValue('city', hub.city || '');
            form.setValue('state', hub.state || '');
            form.setValue('rtoAddress', hub.rtoAddress || '');
            // form.setValue('isRTOAddressSame', hub.isRTOAddressSame || false);
            // form.setValue('rtoCity', hub.rtoCity || '');
            // form.setValue('rtoState', hub.rtoState || '');
            // form.setValue('rtoPincode', String(hub.rtoPincode) || '');
        }
    }, [hub, sellerFacilities, form]);

    const { cityState: cityStateRes } = useFetchCityState(form.watch("pincode"));
    const { cityState: rtoCityStateRes } = useFetchCityState(form.watch("rtoPincode"));

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
        console.log('submitting');

        try {
            editPickupLocation(values, id);
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
        <Dialog open={isEditModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 max-w-2xl">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold">
                        Edit Pickup Location
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AddPickupLocationForm form={form} isLoading={isLoading} />
                        <DialogFooter className="px-6 py-4">
                            {/* <Button onClick={() => form.reset()} disabled={isLoading} variant={'secondary'} type='button'>
                                Reset
                            </Button> */}
                            <Button disabled={isLoading} variant={'themeButton'} type='submit'>
                                Update Pickup Location
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};