"use client"
import { useForm } from "react-hook-form";
import { useSellerProvider } from "../providers/SellerProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export const ChannelFormSchema = z.object({
    channelName: z.string().min(1, "Address is required"),
    isOrderSync: z.boolean().default(true).optional(),
    storeUrl: z.string().url().min(1, "Store Url is required"),
    apiKey: z.string().min(1, "API Key is required"),
    apiSk: z.string().min(1, "API Password is required"),
    sharedSecret: z.string().min(1, "Shared Secret is required"),
});


export const ChannelIntegrationForm = () => {
    const { createChannel, updateChannel, seller } = useSellerProvider();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        resolver: zodResolver(ChannelFormSchema),
        defaultValues: {
            channelName: "Shopify",
            isOrderSync: true,
            storeUrl: "",
            apiKey: "",
            apiSk: "",
            sharedSecret: "",
        }
    });

    useEffect(() => {
        form.setValue('storeUrl', seller?.channelPartners[0]?.storeUrl || "");
        form.setValue('apiKey', seller?.channelPartners[0]?.apiKey || "");
        form.setValue('apiSk', seller?.channelPartners[0]?.apiSk || "");
        form.setValue('sharedSecret', seller?.channelPartners[0]?.sharedSecret || "");
    }, [seller, form])

    let isLoading = !!seller?.channelPartners[0] || form.formState.isSubmitting || isSubmitted;

    const onSubmit = async (values: z.infer<typeof ChannelFormSchema>) => {
        try {
            const response = await createChannel(values) ? setIsSubmitted(true) : setIsSubmitted(false);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">General Information</h2>
                    <p className="text-sm text-gray-500">Follow these instruction to add channel</p>
                    <FormField
                        control={form.control}
                        name="channelName"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center">
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
                                    Channel Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={true}
                                        placeholder="Enter the channel name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Order</h2>
                    <p className="text-sm text-gray-500">Automatically fetch orders from channel periodically</p>
                    <FormField
                        control={form.control}
                        name="isOrderSync"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center">
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
                                    Sync (Optional)
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={()=>{
                                            field.onChange(!field.value)
                                            seller?.channelPartners[0]._id && updateChannel(seller?.channelPartners[0]._id, !field.value)
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                <div>
                    <h2 className="text-xl font-semibold">Seller Panel</h2>
                    <p className="text-sm text-gray-500">Please provide below credentional for shopify.</p>
                    <FormField
                        control={form.control}
                        name="storeUrl"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center">
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
                                    Store Url
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="https://app.myshopify.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="apiKey"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center">
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
                                    API Key
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Enter the API Key"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="apiSk"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center">
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
                                    API secret key
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Enter the API Pass"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sharedSecret"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center">
                                <FormLabel className=" font-bold text-zinc-500 dark:text-secondary/70">
                                    Shared Secret
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Enter the Shared Secret"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    disabled={isLoading}
                    variant={'webPageBtn'}
                >
                    Connect Channel and Test
                </Button>


            </form>
        </Form>
    );
}