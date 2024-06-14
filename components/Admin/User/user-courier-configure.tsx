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
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"



export const CourierPriceConfigureSchema = z.object({
    vendorId: z.string().min(1, "Name is required"),
    codCharge: z.object({
        hard: z.string().min(1, "Base Price is required"),
        percent: z.string().min(1, "Increment Price is required"),
    }),
    withinCity: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
    }),
    withinZone: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
    }),
    withinMetro: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
    }),
    withinRoi: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
    }),
    northEast: z.object({
        basePrice: z.string().min(1, "Base Price is required"),
        incrementPrice: z.string().min(1, "Increment Price is required"),
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
            },
            withinZone: {
                basePrice: "0",
                incrementPrice: "0",
            },
            withinMetro: {
                basePrice: "0",
                incrementPrice: "0",
            },
            withinRoi: {
                basePrice: "0",
                incrementPrice: "0",
            },
            northEast: {
                basePrice: "0",
                incrementPrice: "0",
            },
        }
    })

    useEffect(() => {
        if (assignedCouriers?.length > 0) {
            const initialCourier = assignedCouriers[0];
            form.setValue('vendorId', initialCourier._id);
            form.setValue('codCharge', {
                hard: initialCourier.codCharge?.hard?.toString() || "",
                percent: initialCourier.codCharge?.percent?.toString() || "",
            }),
                form.setValue('withinCity', {
                    basePrice: initialCourier.withinCity.basePrice.toString(),
                    incrementPrice: initialCourier.withinCity.incrementPrice.toString(),
                });
            form.setValue('withinZone', {
                basePrice: initialCourier.withinZone.basePrice.toString(),
                incrementPrice: initialCourier.withinZone.incrementPrice.toString(),
            });
            form.setValue('withinMetro', {
                basePrice: initialCourier.withinMetro.basePrice.toString(),
                incrementPrice: initialCourier.withinMetro.incrementPrice.toString(),
            });
            form.setValue('withinRoi', {
                basePrice: initialCourier.withinRoi.basePrice.toString(),
                incrementPrice: initialCourier.withinRoi.incrementPrice.toString(),
            });
            form.setValue('northEast', {
                basePrice: initialCourier.northEast.basePrice.toString(),
                incrementPrice: initialCourier.northEast.incrementPrice.toString(),
            });
        }
    }, [assignedCouriers, form]);


    const isLoading = form.formState.isSubmitting

    async function onSubmit(value: z.infer<typeof CourierPriceConfigureSchema>) {
        try {
            const sellerId = searchParams.get("sellerId") || ""; // Set a default value of an empty string if sellerId is null
            updateSellerCourierPrice({ value, sellerId })
        } catch (error) {
            console.log(error)
        }
    }

    const handleCourierChange = (vendorId: string) => {
        const selectedCourier = assignedCouriers.find(courier => courier._id === vendorId);
        if (selectedCourier) {
            form.setValue('codCharge', {
                hard: selectedCourier.codCharge?.hard?.toString() || "",
                percent: selectedCourier.codCharge?.percent?.toString() || "",
            }),
                form.setValue('withinCity', {
                    basePrice: selectedCourier.withinCity.basePrice.toString(),
                    incrementPrice: selectedCourier.withinCity.incrementPrice.toString(),
                });
            form.setValue('withinZone', {
                basePrice: selectedCourier.withinZone.basePrice.toString(),
                incrementPrice: selectedCourier.withinZone.incrementPrice.toString(),
            });
            form.setValue('withinMetro', {
                basePrice: selectedCourier.withinMetro.basePrice.toString(),
                incrementPrice: selectedCourier.withinMetro.incrementPrice.toString(),
            });
            form.setValue('withinRoi', {
                basePrice: selectedCourier.withinRoi.basePrice.toString(),
                incrementPrice: selectedCourier.withinRoi.incrementPrice.toString(),
            });
            form.setValue('northEast', {
                basePrice: selectedCourier.northEast.basePrice.toString(),
                incrementPrice: selectedCourier.northEast.incrementPrice.toString(),
            });
        }
    };
    return (
        <div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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