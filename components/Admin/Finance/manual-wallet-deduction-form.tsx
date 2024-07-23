"use client"
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatCurrencyForIndia } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckIcon, LucideSeparatorHorizontal } from "lucide-react";
import { useAdminProvider } from "@/components/providers/AdminProvider";

export const WalletDeductionSchema = z.object({
    amt: z.string().refine(
        v => {
            let n = Number(v);
            return !isNaN(n) && v?.length > 0 && n >= 50 && n <= 10000;
        },
        { message: "Invalid amount or recharge amount must be between 500 and 10000" }
    ),
    type: z.enum(['Credit', 'Debit']),
    desc: z.string().min(5).max(100),
    sellerId: z.string().optional(),
});


export const ManualDeductionForm = () => {

    const { users, walletDeduction } = useAdminProvider()

    const form = useForm({
        resolver: zodResolver(WalletDeductionSchema),
        defaultValues: {
            amt: "",
            type: "Debit" as 'Credit' | 'Debit',
            desc: "",
            sellerId: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof WalletDeductionSchema>) => {
        try {
            await walletDeduction(values);
            form.reset();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[400px]   ">

                <FormField
                    control={form.control}
                    name="sellerId"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Seller</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "justify-between bg-zinc-100/50 focus-visible:ring-0 text-black focus-visible:ring-offset-0 border-0",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? users.find(
                                                    (user) => user._id === field.value
                                                )?.name
                                                : "Select Seller"}
                                            <LucideSeparatorHorizontal className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search Seller..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>No framework found.</CommandEmpty>
                                            <CommandGroup>
                                                {users.map((user) => (
                                                    <CommandItem
                                                        value={user.name}
                                                        key={user._id}
                                                        onSelect={() => {
                                                            form.setValue("sellerId", user._id)
                                                        }}
                                                        className="flex gap-3 justify-start text-left"
                                                    >
                                                        <div>{user.name}</div>
                                                        <div className="text-xs font-semibold">{user.email}</div>
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                user._id === field.value
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


                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Trasaction Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Debit" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Debit
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Credit" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Credit
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                Enter Amount
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the amount"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                Description
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the Description"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button disabled={isLoading} variant={'themeButton'}>
                    Pay {formatCurrencyForIndia(Number(form.watch('amt')))}
                </Button>
            </form>
        </Form>

    )
};