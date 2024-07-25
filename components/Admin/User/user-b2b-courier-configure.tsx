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


const zones = [
    "North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"
];

type ZoneMatrixType = {
    [key: string]: [string, string, string, string, string, string, string, string, string]
}

const zoneMatrix: ZoneMatrixType = {
    "North 1": ["North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"],
    "North 2": ["North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"],
    "West 1": ["North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"],
    "West 2": ["North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"],
    "South 1": ["North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"],
    "South 2": ["North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"],
    "East": ["North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"],
    "Northeast": ["North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"],
    "J&K": ["North 1", "North 2", "West 1", "West 2", "South 1", "South 2", "East", "Northeast", "J&K"]
};

export const B2BCourierPriceConfigureSchema = z.object({
    sellerId: z.string().optional(),
    B2BVendorId: z.string().min(1, "B2B Vendor ID is required"),
    foValue: z.string().min(0, "FO Value must be at least 0"),
    foPercentage: z.string().min(1, "FO Percentage is required").default("0.001"),

    baseFreight: z.string().min(0, "Base Freight must be at least 0"),
    greenTax: z.string(),
    fuelSurcharge: z.string().min(0, "Fuel Surcharge must be at least 0"),
    ODACharge: z.string().min(0, "ODA Charge must be at least 0"),
    docketCharge: z.string().min(0, "Docket Charge must be at least 0"),
    zoneMatrix: z.record(
        z.string(),
        z.record(
            z.string(),
            z.number().min(0, "Rate must be at least 0")
        )
    ),
});

export const UserB2BCourierConfigure = () => {

    const { assignedB2BCouriers, updateSellerB2BCourierPrice } = useAdminProvider()
    const searchParams = useSearchParams()

    const form = useForm<z.infer<typeof B2BCourierPriceConfigureSchema>>({
        resolver: zodResolver(B2BCourierPriceConfigureSchema),
        defaultValues: {
            baseFreight: "0",
            greenTax: "100",
            fuelSurcharge: "0",
            ODACharge: "0",
            docketCharge: "0",
            foValue: "0",
            foPercentage: "0.001",
            B2BVendorId: "",
            zoneMatrix: {},

        }
    })

    useEffect(() => {
        if (assignedB2BCouriers?.length > 0) {
            const initialCourier = assignedB2BCouriers[0];
            form.setValue('B2BVendorId', initialCourier._id);
            form.setValue('foValue', initialCourier.foValue.toString());
            form.setValue('foPercentage', initialCourier.foPercentage.toString());
            form.setValue('baseFreight', initialCourier.baseFreight.toString());
            form.setValue('greenTax', initialCourier.greenTax.toString());
            form.setValue('fuelSurcharge', initialCourier.fuelSurcharge.toString());
            form.setValue('ODACharge', initialCourier.ODACharge.toString());

            form.setValue('docketCharge', initialCourier.docketCharge.toString());
            form.setValue('zoneMatrix', initialCourier.zoneMatrix);
        }
    }, [assignedB2BCouriers, form]);


    const isLoading = form.formState.isSubmitting

    async function onSubmit(value: z.infer<typeof B2BCourierPriceConfigureSchema>) {
        try {
            const sellerId = searchParams.get("sellerId") || ""; // Set a default value of an empty string if sellerId is null
            updateSellerB2BCourierPrice({ value, sellerId })
        } catch (error) {
            console.log(error)
        }
    }

    const handleCourierChange = (vendorId: string) => {
        const selectedCourier = assignedB2BCouriers.find(courier => courier._id === vendorId);
        if (selectedCourier) {

            form.setValue('foValue', selectedCourier.foValue.toString());
            form.setValue('foPercentage', selectedCourier.foPercentage.toString());
            form.setValue('baseFreight', selectedCourier.baseFreight.toString());
            form.setValue('greenTax', selectedCourier.greenTax.toString());
            form.setValue('fuelSurcharge', selectedCourier.fuelSurcharge.toString());
            form.setValue('ODACharge', selectedCourier.ODACharge.toString());

            form.setValue('docketCharge', selectedCourier.docketCharge.toString());
            form.setValue('zoneMatrix', selectedCourier.zoneMatrix);

        }
    };
    return (
        <div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="B2BVendorId"
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
                                                    ? assignedB2BCouriers.find(
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
                                                    {assignedB2BCouriers?.map((courier) => (
                                                        <CommandItem
                                                            value={courier._id}
                                                            key={courier._id}
                                                            onSelect={() => {
                                                                form.setValue("B2BVendorId", courier._id)
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
                            name="foValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>FO Value</FormLabel>
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
                            name="foPercentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>FO Percentage</FormLabel>
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
                            name="baseFreight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Freight</FormLabel>
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
                            name="greenTax"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Green Tax</FormLabel>
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
                            name="fuelSurcharge"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fuel Surcharge</FormLabel>
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
                            name="ODACharge"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ODA Charge</FormLabel>
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
                            name="docketCharge"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Docket Charge</FormLabel>
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

                    <Tabs defaultValue="North 1" className="">
                        <TabsList className="flex w-full overflow-y-auto scrollbar-hide flex-nowrap gap-2 ">
                            {zones.map(zone => (
                                <TabsTrigger key={zone} value={zone}>{zone}</TabsTrigger>
                            ))}
                        </TabsList>
                        {zones.map(zone => (
                            <TabsContent key={zone} value={zone}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{zone}</CardTitle>
                                        <CardDescription>
                                            Configure price for {zone}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="grid grid-cols-3 gap-3">
                                            {zoneMatrix[zone].map((destinationZone: any) => (
                                                <FormField
                                                    key={`${zone}.${destinationZone}`}
                                                    control={form.control}
                                                    name={`zoneMatrix.${zone}.${destinationZone}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>{destinationZone}</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Enter the customer name"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}

                                                                />

                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <SubmitButton isLoading={isLoading} />
                                        <TabsList>
                                            <TabsTrigger value="withinZone" className="webPageBtn">Next</TabsTrigger>
                                        </TabsList>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        ))}

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