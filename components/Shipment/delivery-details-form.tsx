"use client"
import { Car, Circle, CircleUserRound, Square, UserRoundPlus } from "lucide-react";
import { CardContent } from "../ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select";

import { useSellerProvider } from "../providers/SellerProvider";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-model-store";

interface DeliveryDetailsFormProps {
    form: any;
    isLoading: boolean;
}

export const DeliveryDetailsForm = ({ form, isLoading }: DeliveryDetailsFormProps) => {
    const { sellerFacilities,sellerCustomerForm } = useSellerProvider();

    const { onOpen } = useModal();
    return (
        <CardContent>
            <div className="grid grid-cols-7">
                <div className="space-y-3 items-center flex flex-col max-w-10">
                    <Circle strokeWidth={3.4} className="text-yellow-500" size={50} />
                    <hr className="w-[1px] bg-black h-full" />
                    <Square strokeWidth={3.4} className="text-emerald-600" size={50} />
                </div>

                <div className="col-span-6">
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
                                            <SelectValue placeholder="Select facility" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            <SelectSeparator className="h-10 text-center cursor-pointer items-center flex justify-center text-rose-500" onClick={()=>onOpen("addPickupLocation")}><Car size={18} className="mr-3"/>Add Pickup location</SelectSeparator>
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
                    <Button variant={"secondary"} size={"sm"} className="w-full mt-2 items-center" type="button" onClick={() => onOpen("addSeller")}>
                        <UserRoundPlus size={15} className="mr-2" />{sellerCustomerForm.sellerForm.sellerName || "Add Seller"}  <span className='text-red-500'>*</span>
                    </Button>
                    <Button variant={"secondary"} size={"sm"} className="w-full mt-2 items-center" type="button" onClick={() => onOpen("addCustomer")}>
                        <CircleUserRound size={15} className="mr-2" />{sellerCustomerForm.customerForm.name ||  "Add Customer"} <span className='text-red-500'>*</span>
                    </Button>
                </div>
            </div>
        </CardContent>
    )
}