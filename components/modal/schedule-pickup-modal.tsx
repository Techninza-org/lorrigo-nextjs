"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { cn, getFormattedUpcomingDate } from '@/lib/utils';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format, formatDate } from 'date-fns';
import { useSellerProvider } from '../providers/SellerProvider';

const schema = z.object({
    schedulePickup: z.date().refine((date) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return date >= currentDate;
    }, {
        message: "Please select a valid date (today or in the future)",
    })
});

export const SchedulePickupModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const { b2bOrder } = data;

    const { manifestOrder } = useSellerProvider();

    const isModalOpen = isOpen && type === "schedulePickup";

    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            schedulePickup: currentDate
        }
    });

    const handleSelect = (scheduleData: string) => {
        form.setValue('schedulePickup', new Date(scheduleData));
    };

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            const res = await manifestOrder({ orderId: b2bOrder?._id ?? '', scheduleDate: formatDate(`${values.schedulePickup}`, 'yyyy MM dd') })
            if (res) {
                form.reset();
                router.refresh();
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const SCHEDULE_DATE = [0, 1, 2, 3, 4]


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Schedule Pickup
                    </DialogTitle>
                    <DialogDescription className='pt-3'>
                        Schedule Pickup for Order: <span className='font-medium underline underline-offset-4 text-blue-800'>{b2bOrder?.order_reference_id}</span>
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4 px-6">
                            <div className="p-3 rounded-md bg-rose-50 items-center flex gap-3 border">
                                <MapPinIcon />
                                <div>
                                    <div className="text-lg font-bold">Pickup Address</div>
                                    <div>{b2bOrder?.pickupAddress?.name}, {b2bOrder?.pickupAddress?.address1}</div>
                                </div>

                            </div>
                            <FormField
                                control={form.control}
                                name="schedulePickup"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Select Schedule Pickup Date
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    disabled={true}
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal bg-zinc-200/50 disabled:text-black",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                    mode="single"
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date <= yesterday
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                {
                                    SCHEDULE_DATE.map((date) => (
                                        <Button
                                            key={date}
                                            type='button'
                                            variant={'ghost'}
                                            size={'sm'}
                                            onClick={() => handleSelect(getFormattedUpcomingDate(date))}
                                        >
                                            {getFormattedUpcomingDate(date)}
                                        </Button>
                                    ))
                                }
                            </div>
                        </div>
                        <DialogFooter className="px-6 py-4">
                            <Button disabled={isLoading} variant={'themeButton'}>
                                Schedule Pickup
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};