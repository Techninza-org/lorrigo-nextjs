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



export const CourierPriceConfigureSchema = z.object({
    courierId: z.string().min(1, "Name is required"),
    withinCity: z.object({
        basePrice: z.number().min(1, "Base Price is required"),
        incrementPrice: z.number().min(1, "Increment Price is required"),
    }),
    withinZone: z.object({
        basePrice: z.number().min(1, "Base Price is required"),
        incrementPrice: z.number().min(1, "Increment Price is required"),
    }),
    withinMetro: z.object({
        basePrice: z.number().min(1, "Base Price is required"),
        incrementPrice: z.number().min(1, "Increment Price is required"),
    }),
    withinRoi: z.object({
        basePrice: z.number().min(1, "Base Price is required"),
        incrementPrice: z.number().min(1, "Increment Price is required"),
    }),
    northEast: z.object({
        basePrice: z.number().min(1, "Base Price is required"),
        incrementPrice: z.number().min(1, "Increment Price is required"),
    }),
});

export const UserCourierConfigure = () => {

    const { allCouriers } = useAdminProvider()

    const couriers = [
        { label: "English", value: "en" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Spanish", value: "es" },
        { label: "Portuguese", value: "pt" },
        { label: "Russian", value: "ru" },
        { label: "Japanese", value: "ja" },
        { label: "Korean", value: "ko" },
        { label: "Chinese", value: "zh" },
    ]



    const form = useForm<z.infer<typeof CourierPriceConfigureSchema>>({
        resolver: zodResolver(CourierPriceConfigureSchema),
        defaultValues: {
            withinCity: {
                basePrice: 0,
                incrementPrice: 0,
            },
            withinZone: {
                basePrice: 0,
                incrementPrice: 0,
            },
            withinMetro: {
                basePrice: 0,
                incrementPrice: 0,
            },
            withinRoi: {
                basePrice: 0,
                incrementPrice: 0,
            },
            northEast: {
                basePrice: 0,
                incrementPrice: 0,
            },
        }
    })

    const isLoading = form.formState.isSubmitting

    function onSubmit(data: z.infer<typeof CourierPriceConfigureSchema>) {
        try {
            console.log(data)
        } catch (error) {

        }
    }
    return (
        <div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="courierId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Courier </FormLabel>
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
                                                    ? couriers.find(
                                                        (courier) => courier.value === field.value
                                                    )?.label
                                                    : "Select language"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[280px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search language..." />
                                            <CommandEmpty>No language found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandList>
                                                    {couriers.map((language) => (
                                                        <CommandItem
                                                            value={language.label}
                                                            key={language.value}
                                                            onSelect={() => {
                                                                form.setValue("courierId", language.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    language.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {language.label}
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
                                    <Button variant={'themeNavActiveBtn'}>Save changes</Button>
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
                                    <Button variant={'themeNavActiveBtn'}>Save changes</Button>
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
                                    <Button variant={'themeNavActiveBtn'}>Save changes</Button>
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
                                    <Button variant={'themeNavActiveBtn'}>Save changes</Button>
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
                                    <Button variant={'themeNavActiveBtn'}>Save changes</Button>
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