"use client"
import { Car, CheckIcon, Circle, CircleUserRound, LucideSeparatorHorizontal, Square, UserRoundPlus } from "lucide-react";
import { CardContent } from "../ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select";

import { useSellerProvider } from "../providers/SellerProvider";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-model-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DeliveryDetailsFormProps {
    form: any;
    isLoading: boolean;
}

export const DeliveryDetailsForm = ({ form, isLoading }: DeliveryDetailsFormProps) => {
    const { sellerFacilities, sellerCustomerForm } = useSellerProvider();
    const { onOpen } = useModal();
    const [isCmdOpen, setIsCmdOpen] = useState(false)

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
                            <FormItem className="flex flex-col">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                >
                                    Select Facility <span className='text-red-500'>*</span></FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between bg-slate-100 focus-visible:ring-0 text-black focus-visible:ring-offset-0 border-0",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? sellerFacilities.find(
                                                        (facility) => facility._id === field.value
                                                    )?.name
                                                    : "Select Facility"}
                                                <LucideSeparatorHorizontal className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[245px] p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search Pickup..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>No Pickup Address found.</CommandEmpty>
                                                <CommandGroup className="p-0">
                                                    <Button
                                                        className="h-10 text-center cursor-pointer rounded-none w-full items-center flex justify-center text-rose-500"
                                                        onClick={() => onOpen("addPickupLocation")}
                                                        variant={"webPageBtn"}
                                                    >

                                                        <Car size={18} className="mr-3" />
                                                        Add Pickup location
                                                    </Button>

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
                                                                    facility._id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
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
                    <Button variant={"secondary"} size={"sm"} className="w-full mt-2 items-center" type="button" onClick={() => onOpen("addSeller")}>
                        <UserRoundPlus size={15} className="mr-2" />{sellerCustomerForm.sellerForm.sellerName || "Add Seller"}  <span className='text-red-500'>*</span>
                    </Button>
                    <Button variant={"secondary"} size={"sm"} className="w-full mt-2 items-center" type="button" onClick={() => onOpen("addCustomer")}>
                        <CircleUserRound size={15} className="mr-2" />{sellerCustomerForm.customerForm.name || "Add Customer"} <span className='text-red-500'>*</span>
                    </Button>
                </div>
            </div>
        </CardContent>
    )
}