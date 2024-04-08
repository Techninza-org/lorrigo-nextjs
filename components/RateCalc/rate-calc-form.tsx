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
import { cn, formatCurrencyForIndia } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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


const rateCalcSchema = z.object({
    pickupPincode: z.string().min(6, "Please enter the valid pincode"),
    deliveryPincode: z.string().min(6, "Please enter the valid pincode"),
    weight: z.string(),
    orderBoxLength: z.string().min(1, "Please enter the length"),
    orderBoxWidth: z.string().min(1, "Please enter the width"),
    orderBoxHeight: z.string().min(1, "Please enter the height"),
    orderWeight: z.string().min(1, "Please enter the weight"),
    payment_mode: z.enum(["COD", "Prepaid"], {
        required_error: "Payment mode is required"
    }),
    collectableAmount: z.string()

});


export const RateCalcForm = () => {
    const { getCityStateFPincode, calcRate } = useSellerProvider();
    const [courierCalcRate, setCourierCalcRate] = useState([{}] as any);

    const form = useForm({
        resolver: zodResolver(rateCalcSchema),
        defaultValues: {
            pickupPincode: "",
            deliveryPincode: "",
            weight: "",
            payment_mode: "" as "COD" | "Prepaid",
            orderBoxLength: "",
            orderBoxWidth: "",
            orderBoxHeight: "",
            orderWeight: "",
            collectableAmount: ""
        }
    });

    const { setValue } = form
    const isLoading = form.formState.isSubmitting;
    const [collectableFeild, setCollectableFeild] = useState(false);
    const [pickupCityState, setCityState] = useState({
        city: "Pincode",
        state: "state"
    })
    const [deliveryCityState, setDeliveryCityState] = useState({
        city: "Pincode",
        state: "state"
    })

    const isCOD = form.watch('payment_mode') === "COD";


    useEffect(() => {
        if (isCOD) {
            setCollectableFeild(true);
        } else {
            setCollectableFeild(false);
        }
    }, [isCOD]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let numericValue = e.target.value.replace(/[^0-9.]/g, '');
        const parts = numericValue.split('.');
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }
        const field = e.target.name as keyof typeof rateCalcSchema; // Explicitly define the type of 'field'
        console.log(field)
        //@ts-ignore
        form.setValue(field, numericValue);
    };

    const isError = (name: string) => {
        //@ts-ignore
        return form.formState.isSubmitted && form.formState.errors[name] ? true : false;
    };

    const onSubmit = async (values: z.infer<typeof rateCalcSchema>) => {
        const res = await calcRate({
            pickupPincode: values.pickupPincode,
            deliveryPincode: values.deliveryPincode,
            weight: values.orderWeight,
            weightUnit: "kg",
            boxLength: values.orderBoxLength,
            boxWidth: values.orderBoxWidth,
            boxHeight: values.orderBoxHeight,
            sizeUnit: "cm",
            paymentType: values.payment_mode == "COD" ? 1 : 0,
            collectableAmount: values.collectableAmount
        })
        setCourierCalcRate(res);
    }


    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        console.log(form.watch("pickupPincode").length > 4)

        const fetchCityState = async () => {
            if (form.watch("pickupPincode").length > 4) {
                const cityStateRes = await getCityStateFPincode(form.watch("pickupPincode"))

                setCityState({
                    city: cityStateRes.city,
                    state: cityStateRes.state
                })
            }
            if (form.watch("deliveryPincode").length > 4) {
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

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 gap-2">
                        <Card className='col-span-3 space-y-3'>
                            <CardHeader>
                                <CardTitle>Shipping Rate Calculator</CardTitle>
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

                                <div className="grid grid-cols-3 gap-10">
                                    <div>
                                        <h4>Weight</h4>
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
                                                    <FormDescription>Package weight should be 0.5kg.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <h4>Dimension</h4>
                                        <div className="flex gap-3">
                                            <FormField
                                                control={form.control}
                                                name="orderBoxLength"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <div className="flex flex-col space-y-4">
                                                            <div className="flex flex-row justify-between items-center">
                                                                <Input
                                                                    disabled={isLoading}
                                                                    className={cn("w-full bg-zinc-200/50  text-center dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                                        isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                                                    )}
                                                                    placeholder="L"
                                                                    {...field}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="orderBoxWidth"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <div className="flex flex-col space-y-4">
                                                            <div className="flex flex-row justify-between items-center">
                                                                <Input
                                                                    disabled={isLoading}
                                                                    className={cn("w-full bg-zinc-200/50 text-center dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                                        isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                                                    )}
                                                                    placeholder="B"
                                                                    {...field}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="orderBoxHeight"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <div className="flex flex-col space-y-4">
                                                            <div className="flex flex-row justify-between items-center">
                                                                <Input
                                                                    disabled={isLoading}
                                                                    className={cn("w-full bg-zinc-200/50 text-center dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                                        isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                                                    )}
                                                                    placeholder="H"
                                                                    {...field}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                        </div>

                                                    </FormItem>
                                                )}
                                            />
                                            <Button type='button' variant={"secondary"}>cm</Button>
                                        </div>
                                    </div>

                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <FormField
                                        control={form.control}
                                        name="payment_mode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel
                                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                                >
                                                    Payment Mode
                                                </FormLabel>
                                                <Select
                                                    disabled={isLoading}
                                                    onValueChange={field.onChange}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className="bg-zinc-300/50 dark:bg-zinc-700 dark:text-white border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                                        >
                                                            <SelectValue placeholder="Select a payment mode" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={"COD"}>Cash on Delivery</SelectItem>
                                                        <SelectItem value={"Prepaid"}>Prepaid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {
                                        collectableFeild && (
                                            <FormField
                                                control={form.control}
                                                name="collectableAmount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel
                                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                                        >
                                                            Collectable Amount
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                disabled={isLoading}
                                                                className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                                placeholder="Enter the amount to collect"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )
                                    }

                                </div>


                            </CardContent>
                            <CardFooter className='flex-row-reverse'>
                                <Button type='submit' variant={'themeButton'} >Calculate</Button>
                                <Button variant={'secondary'} type='button'>Reset</Button>
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
                                Select Courier Partner
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
                                        courierCalcRate?.map((partner: any) => {
                                            return <TableRow key={partner.smartship_carrier_id}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Image className="mr-2" src={"/assets/logo.png"} width={35} height={35} alt="logo" /> {partner.name} | Min. weight: {partner.minWeight}kg</div>
                                                    <div>RTO Charges : {formatCurrencyForIndia(partner.charge)}</div>
                                                </TableCell>
                                                <TableCell>{partner.expectedPickup}</TableCell>
                                                <TableCell>{partner.order_zone}</TableCell>
                                                <TableCell>{formatCurrencyForIndia(partner.charge)}</TableCell>

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
