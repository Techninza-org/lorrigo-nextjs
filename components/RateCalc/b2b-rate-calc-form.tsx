"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import * as z from 'zod';
import { Input } from "../ui/input";
import { cn, formatCurrencyForIndia, getSvg, removeWhitespaceAndLowercase } from "@/lib/utils";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Separator } from "../ui/separator";
import { useSellerProvider } from "../providers/SellerProvider";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from "next/image";
import { LoadingComponent } from "../loading-spinner";


export const B2BrateCalcSchema = z.object({
    pickupPincode: z.string().min(6, "Please enter the valid pincode"),
    deliveryPincode: z.string().min(6, "Please enter the valid pincode"),
    orderWeight: z.string().min(1, "Please enter the weight"),
    amount: z.string().min(1, "Please enter the amount"),
});


export const B2BRateCalcForm = () => {
    const { getCityStateFPincode, B2BcalcRate } = useSellerProvider();
    const [courierCalcRate, setCourierCalcRate] = useState([] as any);
    const [isAPILoading, setIsAPILoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(B2BrateCalcSchema),
        defaultValues: {
            pickupPincode: "",
            deliveryPincode: "",
            orderWeight: "",
            amount: "",
        }
    });

    const isLoading = form.formState.isSubmitting;
    const [pickupCityState, setCityState] = useState({
        city: "Pincode",
        state: "state"
    })
    const [deliveryCityState, setDeliveryCityState] = useState({
        city: "Pincode",
        state: "state"
    })


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let numericValue = e.target.value.replace(/[^0-9.]/g, '');
        const parts = numericValue?.split('.');
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }
        const field = e.target.name as keyof typeof B2BrateCalcSchema; // Explicitly define the type of 'field'
        //@ts-ignore
        form.setValue(field, numericValue);
    };

    const isError = (name: string) => {
        //@ts-ignore
        return form.formState.isSubmitted && form.formState.errors[name] ? true : false;
    };


    const onSubmit = async (values: z.infer<typeof B2BrateCalcSchema>) => {
        setIsAPILoading(true)
        try {
            const res = await B2BcalcRate(values)
            console.log(res, "res")
            setCourierCalcRate(res);
        } finally {
            setIsAPILoading(false)
        }
    }


    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;

        const fetchCityState = async () => {
            if (form.watch("pickupPincode").length > 5) {
                const cityStateRes = await getCityStateFPincode(form.watch("pickupPincode"))

                setCityState({
                    city: cityStateRes.city,
                    state: cityStateRes.state
                })
            }
            if (form.watch("deliveryPincode").length > 5) {
                const cityStateRes = await getCityStateFPincode(form.watch("deliveryPincode"))
                setDeliveryCityState({
                    city: cityStateRes.city,
                    state: cityStateRes.state
                })
            }
        };

        // Debouncing the function
        clearTimeout(timer);
        timer = setTimeout(fetchCityState, 500); // Adjust the delay as per your preference

        return () => clearTimeout(timer);
    }, [form.watch("pickupPincode"), form.watch("deliveryPincode")])

    return (
        <>
            {
                isAPILoading && <LoadingComponent />
            }
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 gap-2">
                        <Card className='col-span-3 space-y-3'>
                            <CardHeader>
                                <CardTitle>B2B Shipping Rate Calculator</CardTitle>
                                <CardDescription>Order Details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-10">
                                    <FormField
                                        control={form.control}
                                        name="pickupPincode"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel
                                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                                >
                                                    Pickup Pincode
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-3 items-center">
                                                        <Input
                                                            disabled={isLoading}
                                                            className={cn("w-full bg-zinc-200/50 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                                isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                                            )}
                                                            placeholder="Enter pickup pincode"
                                                            {...field}
                                                        />
                                                    </div>

                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="deliveryPincode"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel
                                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                                >
                                                    Delivery Pincode
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-3 items-center">
                                                        <Input
                                                            disabled={isLoading}
                                                            className={cn("w-full bg-zinc-200/50 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                                isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                                            )}
                                                            placeholder="Enter delivery pincode"
                                                            {...field}
                                                        />
                                                    </div>

                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div>
                                        <div
                                            className="my-2 px-1 uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                          Total Weight
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="orderWeight"
                                            render={({ field }) => (
                                                <FormItem className="w-full">

                                                    <FormControl>
                                                        <div className="flex gap-3 items-center">
                                                            <Input
                                                                disabled={isLoading}
                                                                className={cn("w-full bg-zinc-200/50 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                                    isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                                                )}
                                                                placeholder="Enter weight"
                                                                {...field}
                                                                onChange={handleChange}
                                                            />
                                                            <Button type='button' variant={"secondary"}>kg</Button>
                                                        </div>

                                                    </FormControl>
                                                    {/* <FormDescription>Package weight should be 0.5kg.</FormDescription> */}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="amount"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel
                                                        className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                                    >
                                                        Amount
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="flex gap-3 items-center">
                                                            <Input
                                                                disabled={isLoading}
                                                                className={cn("w-full bg-zinc-200/50 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                                    isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                                                )}
                                                                placeholder="Enter Order Amount"
                                                                {...field}
                                                            />
                                                        </div>

                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                </div>

                            </CardContent>
                            <CardFooter className='flex-row-reverse gap-3'>
                                <Button type='submit' variant={'themeButton'} >Calculate</Button>
                                <Button variant={'secondary'} type='button' onClick={() => form.reset()}>Reset</Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center'><MapPin className='mr-3' size={20} />Pickup Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid">
                                    <div className="space-y-3 items-center flex flex-col ">
                                        <div className="space-y-3 w-52">
                                            <div className="flex gap-3 items-center">
                                                <MapPin strokeWidth={2.4} className="" size={23} /><span className="text-lg">Pickup Location</span>
                                            </div>
                                            <div className="border-red-400 border px-3 py-2 rounded-md w-full text-center tracking-wider">{pickupCityState.city}/{pickupCityState.state}</div>
                                        </div>
                                        <Separator orientation="vertical" className="w-[2px] h-32" />
                                        <div className="space-y-3 w-52">
                                            <div className="gap-3 flex items-center">
                                                <MapPin strokeWidth={2.4} className="" size={23} /><span className="text-lg">Delivery Location</span>
                                            </div>
                                            <div className="border-red-400 border px-3 py-2 rounded-md w-full text-center tracking-wider">{deliveryCityState.city}/{deliveryCityState.state}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </Form>

            <div className="col-span-2 my-2">
                <div className="grid gap-3">
                    <Card className="drop-shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>
                                Courier Partner
                            </CardTitle>

                        </CardHeader>
                        <CardContent className="flex items-center justify-between gap-1">
                            <Table>
                                <TableCaption>A list of our Courier Partners</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="">Courier Partner</TableHead>
                                        <TableHead>Expected Pickup</TableHead>
                                        <TableHead>Zone</TableHead>
                                        <TableHead>Charges</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        (courierCalcRate) && (courierCalcRate?.length >= 1) && courierCalcRate?.map((partner: any, i: number) => {
                                            return <TableRow key={i}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Image className="mr-2 mix-blend-multiply"
                                                            src={getSvg(removeWhitespaceAndLowercase(partner?.name ?? ""))}
                                                            width={55} height={55} alt="logo" /> {partner.name}
                                                        <span className="text-slate-500 mx-1">({partner.nickName})</span> | Min. weight: {partner.minWeight}kg

                                                    </div>
                                                    <div>RTO Charges : {formatCurrencyForIndia(partner.charge ?? 0)}</div>
                                                </TableCell>
                                                <TableCell>{partner.expectedPickup}</TableCell>
                                                <TableCell>{partner.order_zone}</TableCell>
                                                <TableCell>{formatCurrencyForIndia(partner.charge ?? 0)}</TableCell>

                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </>
    )
}
