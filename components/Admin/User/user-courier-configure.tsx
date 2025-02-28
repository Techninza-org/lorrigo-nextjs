"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useAdminProvider } from "@/components/providers/AdminProvider"
import { Fragment, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Switch } from "@/components/ui/switch"



export const CourierPriceConfigureSchema = z.object({
    vendorId: z.string().min(1, "Name is required"),
    isFwdDeduct: z.boolean().default(true),
    isRtoDeduct: z.boolean().default(true),
    isCodDeduct: z.boolean().default(true),
    codCharge: z.object({
        hard: z.string().min(1, "Base Price is required"),
        percent: z.string().min(1, "Increment Price is required"),
    }),
    withinCity: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
        isRTOSameAsFW: z.boolean().default(true),
        flatRTOCharge: z.string().optional(),
        rtoBasePrice: z.string().optional(),
        rtoIncrementPrice: z.string().optional(),
    }),
    withinZone: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
        isRTOSameAsFW: z.boolean().default(true),
        flatRTOCharge: z.string().optional(),
        rtoBasePrice: z.string().optional(),
        rtoIncrementPrice: z.string().optional(),
    }),
    withinMetro: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
        isRTOSameAsFW: z.boolean().default(true),
        flatRTOCharge: z.string().optional(),
        rtoBasePrice: z.string().optional(),
        rtoIncrementPrice: z.string().optional(),
    }),
    withinRoi: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
        isRTOSameAsFW: z.boolean().default(true),
        flatRTOCharge: z.string().optional(),
        rtoBasePrice: z.string().optional(),
        rtoIncrementPrice: z.string().optional(),
    }),
    northEast: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
        isRTOSameAsFW: z.boolean().default(true),
        flatRTOCharge: z.string().optional(),
        rtoBasePrice: z.string().optional(),
        rtoIncrementPrice: z.string().optional(),
    }),
});

export const UserCourierConfigure = () => {

    const { assignedCouriers, updateSellerCourierPrice } = useAdminProvider()
    const searchParams = useSearchParams()

    const form = useForm<z.infer<typeof CourierPriceConfigureSchema>>({
        resolver: zodResolver(CourierPriceConfigureSchema),
        defaultValues: {
            codCharge: {
                hard: "0",
                percent: "0",
            },
            withinCity: {
                basePrice: "0",
                incrementPrice: "0",
                isRTOSameAsFW: true,
                flatRTOCharge: "0",
                rtoBasePrice: "0",
                rtoIncrementPrice: "0",
            },
            withinZone: {
                basePrice: "0",
                incrementPrice: "0",
                isRTOSameAsFW: true,
                flatRTOCharge: "0",
                rtoBasePrice: "0",
                rtoIncrementPrice: "0",
            },
            withinMetro: {
                basePrice: "0",
                incrementPrice: "0",
                isRTOSameAsFW: true,
                flatRTOCharge: "0",
                rtoBasePrice: "0",
                rtoIncrementPrice: "0",
            },
            withinRoi: {
                basePrice: "0",
                incrementPrice: "0",
                isRTOSameAsFW: true,
                flatRTOCharge: "0",
                rtoBasePrice: "0",
                rtoIncrementPrice: "0",
            },
            northEast: {
                basePrice: "0",
                incrementPrice: "0",
                isRTOSameAsFW: true,
                flatRTOCharge: "0",
                rtoBasePrice: "0",
                rtoIncrementPrice: "0",
            },
        }
    })

    
    function validBoolean  (value: any) {
        return value === undefined ? true : Boolean(value)
    }

    useEffect(() => {
        if (assignedCouriers?.length > 0) {
            const initialCourier = assignedCouriers[0];
            form.setValue('isCodDeduct', validBoolean(initialCourier.isCodDeduct));
            form.setValue('isFwdDeduct', validBoolean(initialCourier.isFwdDeduct));
            form.setValue('isRtoDeduct', validBoolean(initialCourier.isRtoDeduct));
            form.setValue('vendorId', initialCourier._id);
            form.setValue('codCharge', {
                hard: initialCourier.codCharge?.hard?.toString() || "",
                percent: initialCourier.codCharge?.percent?.toString() || "",
            });
            form.setValue('withinCity', {
                basePrice: initialCourier.withinCity.basePrice.toString(),
                incrementPrice: initialCourier.withinCity.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(initialCourier.withinCity.isRTOSameAsFW),
                flatRTOCharge: initialCourier.withinCity.flatRTOCharge?.toString() || "",
                rtoBasePrice: initialCourier.withinCity?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: initialCourier.withinCity?.rtoIncrementPrice?.toString() || "",
            });
            form.setValue('withinZone', {
                basePrice: initialCourier.withinZone.basePrice.toString(),
                incrementPrice: initialCourier.withinZone.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(initialCourier.withinZone.isRTOSameAsFW),
                flatRTOCharge: initialCourier.withinZone.flatRTOCharge?.toString() || "",
                rtoBasePrice: initialCourier.withinZone?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: initialCourier.withinZone?.rtoIncrementPrice?.toString() || "",
            });
            form.setValue('withinMetro', {
                basePrice: initialCourier.withinMetro.basePrice.toString(),
                incrementPrice: initialCourier.withinMetro.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(initialCourier.withinMetro.isRTOSameAsFW),
                flatRTOCharge: initialCourier.withinMetro.flatRTOCharge?.toString() || "",
                rtoBasePrice: initialCourier.withinMetro?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: initialCourier.withinMetro?.rtoIncrementPrice?.toString() || "",
            });
            form.setValue('withinRoi', {
                basePrice: initialCourier.withinRoi.basePrice.toString(),
                incrementPrice: initialCourier.withinRoi.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(initialCourier.withinRoi.isRTOSameAsFW),
                flatRTOCharge: initialCourier.withinRoi.flatRTOCharge?.toString() || "",
                rtoBasePrice: initialCourier.withinRoi?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: initialCourier.withinRoi?.rtoIncrementPrice?.toString() || "",
            });
            form.setValue('northEast', {
                basePrice: initialCourier.northEast.basePrice.toString(),
                incrementPrice: initialCourier.northEast.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(initialCourier.northEast.isRTOSameAsFW),
                flatRTOCharge: initialCourier.northEast.flatRTOCharge?.toString() || "",
                rtoBasePrice: initialCourier.northEast?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: initialCourier.northEast?.rtoIncrementPrice?.toString() || "",
            });
        }
    }, [assignedCouriers, form]);


    const isLoading = form.formState.isSubmitting

    async function onSubmit(value: z.infer<typeof CourierPriceConfigureSchema>) {
        try {
            const sellerId = searchParams.get("sellerId") || ""; // Set a default value of an empty string if sellerId is null
            updateSellerCourierPrice({ value, sellerId })
        } catch (error) {
            console.error(error)
        }
    }

    const handleCourierChange = (vendorId: string) => {
        const selectedCourier = assignedCouriers.find(courier => courier._id === vendorId);
        if (selectedCourier) {
            form.setValue('isCodDeduct', validBoolean(selectedCourier?.isCodDeduct));
            form.setValue('isFwdDeduct', validBoolean(selectedCourier?.isFwdDeduct));
            form.setValue('isRtoDeduct', validBoolean(selectedCourier?.isRtoDeduct));
            form.setValue('codCharge', {
                hard: selectedCourier.codCharge?.hard?.toString() || "",
                percent: selectedCourier.codCharge?.percent?.toString() || "",
            });
            form.setValue('withinCity', {
                basePrice: selectedCourier.withinCity.basePrice.toString(),
                incrementPrice: selectedCourier.withinCity.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(selectedCourier.withinCity.isRTOSameAsFW),
                flatRTOCharge: selectedCourier.withinCity.flatRTOCharge?.toString() || "",
                rtoBasePrice: selectedCourier.withinCity?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: selectedCourier.withinCity?.rtoIncrementPrice?.toString() || "",
                
            });
            form.setValue('withinZone', {
                basePrice: selectedCourier.withinZone.basePrice.toString(),
                incrementPrice: selectedCourier.withinZone.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(selectedCourier.withinZone.isRTOSameAsFW),
                flatRTOCharge: selectedCourier.withinZone.flatRTOCharge?.toString() || "",
                rtoBasePrice: selectedCourier.withinZone?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: selectedCourier.withinZone?.rtoIncrementPrice?.toString() || "",
                
            });
            form.setValue('withinMetro', {
                basePrice: selectedCourier.withinMetro.basePrice.toString(),
                incrementPrice: selectedCourier.withinMetro.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(selectedCourier.withinMetro.isRTOSameAsFW),
                flatRTOCharge: selectedCourier.withinMetro.flatRTOCharge?.toString() || "",
                rtoBasePrice: selectedCourier.withinMetro?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: selectedCourier.withinMetro?.rtoIncrementPrice?.toString() || "",
                
            });
            form.setValue('withinRoi', {
                basePrice: selectedCourier.withinRoi.basePrice.toString(),
                incrementPrice: selectedCourier.withinRoi.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(selectedCourier.withinRoi.isRTOSameAsFW),
                flatRTOCharge: selectedCourier.withinRoi.flatRTOCharge?.toString() || "",
                rtoBasePrice: selectedCourier.withinRoi?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: selectedCourier.withinRoi?.rtoIncrementPrice?.toString() || "",
                
            });
            form.setValue('northEast', {
                basePrice: selectedCourier.northEast.basePrice.toString(),
                incrementPrice: selectedCourier.northEast.incrementPrice.toString(),
                isRTOSameAsFW: validBoolean(selectedCourier.northEast.isRTOSameAsFW),
                flatRTOCharge: selectedCourier.northEast.flatRTOCharge?.toString() || "",
                rtoBasePrice: selectedCourier.northEast?.rtoBasePrice?.toString() || "",
                rtoIncrementPrice: selectedCourier.northEast?.rtoIncrementPrice?.toString() || "",
            });
        }
    };
    return (
        <div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-between">

                        <FormField
                            control={form.control}
                            name="vendorId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Courier</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[280px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? assignedCouriers.find(
                                                            (courier) => courier._id === field.value
                                                        )?.nameWithNickname
                                                        : "Select Courier"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[280px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search Courier..." />
                                                <CommandEmpty>No Courier found.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandList>
                                                        {assignedCouriers?.map((courier) => (
                                                            <CommandItem
                                                                value={courier._id}
                                                                key={courier._id}
                                                                onSelect={() => {
                                                                    form.setValue("vendorId", courier._id)
                                                                    handleCourierChange(courier._id);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        courier._id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {courier.nameWithNickname}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandList>
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between items-center gap-6">
                            <FormField
                                control={form.control}
                                name="isFwdDeduct"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-3">
                                        <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                            Forward
                                        </FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={() => {
                                                    field.onChange(!field.value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isRtoDeduct"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-3">
                                        <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                            RTO
                                        </FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={() => {
                                                    field.onChange(!field.value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isCodDeduct"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-3">
                                        <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                            COD
                                        </FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={() => {
                                                    field.onChange(!field.value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="codCharge.hard"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        COD Hard (₹)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Enter the customer name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="codCharge.percent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        COD Charge (%)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Enter the customer name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Tabs defaultValue="withinCity">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="withinCity">With in City</TabsTrigger>
                            <TabsTrigger value="withinZone">With in Zone</TabsTrigger>
                            <TabsTrigger value="withinMetro">With in Metro</TabsTrigger>
                            <TabsTrigger value="withinRoi">With in ROI</TabsTrigger>
                            <TabsTrigger value="northEast">North East</TabsTrigger>
                        </TabsList>
                        <TabsContent value="withinCity">
                            <Card>
                                <CardHeader>
                                    <CardTitle>With in City</CardTitle>
                                    <CardDescription>
                                        Configure price for with in city
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <FormField
                                            control={form.control}
                                            name="withinCity.basePrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Base Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="withinCity.incrementPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Increment Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="withinCity.isRTOSameAsFW"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-3">
                                                    <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                                        RTO Same as Forward
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={() => {
                                                                field.onChange(!field.value);
                                                                // form.handleSubmit(onSubmit)(); // Trigger form submission
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {
                                            !validBoolean(form.watch("withinCity.isRTOSameAsFW")) && (<Fragment>
                                                {/* <FormField
                                                    control={form.control}
                                                    name="withinCity.flatRTOCharge"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                Flat RTO Charge
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter Flat RTO Charge"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                /> */}

                                                <FormField
                                                    control={form.control}
                                                    name="withinCity.rtoBasePrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                RTO Base Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="withinCity.rtoIncrementPrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                            RTO Increment Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Fragment>
                                            )
                                        }
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <SubmitButton isLoading={isLoading} />
                                    <TabsList className="">
                                        <TabsTrigger value="withinZone" className={buttonVariants({
                                            variant: "webPageBtn",
                                        })}>Next</TabsTrigger>
                                    </TabsList>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="withinZone">
                            <Card>
                                <CardHeader>
                                    <CardTitle>With in Zone</CardTitle>
                                    <CardDescription>
                                        Configure price for with in Zone
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <FormField
                                            control={form.control}
                                            name="withinZone.basePrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Base Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="withinZone.incrementPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Increment Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                          <FormField
                                            control={form.control}
                                            name="withinZone.isRTOSameAsFW"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-3">
                                                    <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                                        RTO Same as Forward
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={() => {
                                                                field.onChange(!field.value);
                                                                // form.handleSubmit(onSubmit)(); // Trigger form submission
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         {
                                            !validBoolean(form.watch("withinZone.isRTOSameAsFW")) && (<Fragment>
                                                {/* <FormField
                                                    control={form.control}
                                                    name="withinZone.flatRTOCharge"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                Flat RTO Charge
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter Flat RTO Charge"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                /> */}

                                                <FormField
                                                    control={form.control}
                                                    name="withinZone.rtoBasePrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                RTO Base Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="withinZone.rtoIncrementPrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                            RTO Increment Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Fragment>
                                            )
                                        }
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <SubmitButton isLoading={isLoading} />
                                    <TabsList className="">
                                        <TabsTrigger value="withinZone" className={buttonVariants({
                                            variant: "webPageBtn",
                                        })}>Next</TabsTrigger>
                                    </TabsList>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="withinMetro">
                            <Card>
                                <CardHeader>
                                    <CardTitle>With in Metro</CardTitle>
                                    <CardDescription>
                                        Configure price for with in Metro
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <FormField
                                            control={form.control}
                                            name="withinMetro.basePrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Base Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="withinMetro.incrementPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Increment Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                          <FormField
                                            control={form.control}
                                            name="withinMetro.isRTOSameAsFW"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-3">
                                                    <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                                        RTO Same as Forward
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={() => {
                                                                field.onChange(!field.value);
                                                                // form.handleSubmit(onSubmit)(); // Trigger form submission
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         {
                                            !validBoolean(form.watch("withinMetro.isRTOSameAsFW")) && (<Fragment>
                                                {/* <FormField
                                                    control={form.control}
                                                    name="withinMetro.flatRTOCharge"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                Flat RTO Charge
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter Flat RTO Charge"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                /> */}

                                                <FormField
                                                    control={form.control}
                                                    name="withinMetro.rtoBasePrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                RTO Base Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="withinMetro.rtoIncrementPrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                            RTO Increment Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Fragment>
                                            )
                                        }
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <SubmitButton isLoading={isLoading} />
                                    <TabsList className="">
                                        <TabsTrigger value="withinZone" className={buttonVariants({
                                            variant: "webPageBtn",
                                        })}>Next</TabsTrigger>
                                    </TabsList>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="withinRoi">
                            <Card>
                                <CardHeader>
                                    <CardTitle>With in ROI</CardTitle>
                                    <CardDescription>
                                        Configure price for with in ROI
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <FormField
                                            control={form.control}
                                            name="withinRoi.basePrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Base Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="withinRoi.incrementPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Increment Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                          <FormField
                                            control={form.control}
                                            name="withinRoi.isRTOSameAsFW"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-3">
                                                    <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                                        RTO Same as Forward
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={() => {
                                                                field.onChange(!field.value);
                                                                // form.handleSubmit(onSubmit)(); // Trigger form submission
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                          {
                                            !validBoolean(form.watch("withinRoi.isRTOSameAsFW")) && (<Fragment>
                                                {/* <FormField
                                                    control={form.control}
                                                    name="withinRoi.flatRTOCharge"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                Flat RTO Charge
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter Flat RTO Charge"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                /> */}

                                                <FormField
                                                    control={form.control}
                                                    name="withinRoi.rtoBasePrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                RTO Base Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="withinRoi.rtoIncrementPrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                            RTO Increment Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Fragment>
                                            )
                                        }
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <SubmitButton isLoading={isLoading} />
                                    <TabsList className="">
                                        <TabsTrigger value="withinZone" className={buttonVariants({
                                            variant: "webPageBtn",
                                        })}>Next</TabsTrigger>
                                    </TabsList>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="northEast">
                            <Card>
                                <CardHeader>
                                    <CardTitle>With in North-East</CardTitle>
                                    <CardDescription>
                                        Configure price for with in North-East
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <FormField
                                            control={form.control}
                                            name="northEast.basePrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Base Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="northEast.incrementPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Increment Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isLoading}
                                                            placeholder="Enter the customer name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                          <FormField
                                            control={form.control}
                                            name="northEast.isRTOSameAsFW"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-3">
                                                    <FormLabel className="font-bold text-zinc-500 dark:text-secondary/70">
                                                        RTO Same as Forward
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={() => {
                                                                field.onChange(!field.value);
                                                                // form.handleSubmit(onSubmit)(); // Trigger form submission
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                          {
                                            !validBoolean(form.watch("northEast.isRTOSameAsFW")) && (<Fragment>
                                                {/* <FormField
                                                    control={form.control}
                                                    name="northEast.flatRTOCharge"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                Flat RTO Charge
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter Flat RTO Charge"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                /> */}

                                                <FormField
                                                    control={form.control}
                                                    name="northEast.rtoBasePrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                                RTO Base Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="northEast.rtoIncrementPrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                            RTO Increment Price
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Fragment>
                                            )
                                        }
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <SubmitButton isLoading={isLoading} />
                                    <TabsList className="">
                                        <TabsTrigger value="withinZone" className={buttonVariants({
                                            variant: "webPageBtn",
                                        })}>Next</TabsTrigger>
                                    </TabsList>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </Form>
        </div>
    )
}

const SubmitButton = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <Button
            type="submit"
            variant="themeNavActiveBtn"
            disabled={isLoading}
        >
            {isLoading ? "Loading..." : "Save Changes"}
        </Button>
    )
}