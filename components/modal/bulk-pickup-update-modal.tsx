import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-model-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useSellerProvider } from "../providers/SellerProvider";
import { z } from 'zod';
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, LucideSeparatorHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";


export const BulkPickupUpdateSchema = z.object({
    orderIds: z.array(z.string()),
    pickupAddressId: z.string(),
})

export const BulkPickupUpdateModal = () => {
    const { handleBulkPickupChange, sellerFacilities } = useSellerProvider();

    const form = useForm({
        resolver: zodResolver(BulkPickupUpdateSchema),
        defaultValues: {
            orderIds: [],
            pickupAddressId: ""
        }
    });

    const { isLoading } = form.formState;

    const { isOpen, onClose, type, data } = useModal();
    const { orders } = data ?? {};

    const isModalOpen = isOpen && type === "BulkPickupUpdate";

    const handleClose = () => {
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof BulkPickupUpdateSchema>) => {
        const orderIds = orders?.map((order: any) => order._id) || [];
        console.log(orderIds, values);
        await handleBulkPickupChange(orderIds, values.pickupAddressId);
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-6">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Bulk Pickup Update
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="pickupAddressId"
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
                                                    <CommandGroup>
                                                        {sellerFacilities.map((facility) => (
                                                            <CommandItem
                                                                value={facility.name}
                                                                key={facility._id}
                                                                onSelect={() => {
                                                                    form.setValue("pickupAddressId", facility._id)
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
                        <DialogFooter className="mt-3">
                            <Button variant="themeNavActiveBtn">Update</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog >
    )
};