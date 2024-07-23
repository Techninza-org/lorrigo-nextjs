import { format } from 'date-fns';
import { CalendarIcon, Equal, Minus, Plus } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
    CardContent,
} from "@/components/ui/card"
import { SellerType } from '@/types/types';

interface OrderDetailFormProps {
    seller?: SellerType | null;
    form: any;
    isLoading: boolean;
    orderRefDisable?: boolean;
    handleIncrement: () => void;
    handleDecrement: () => void;
    collectableFeild: boolean;
}

export const OrderDetailForm = ({ seller, form, isLoading, handleIncrement, handleDecrement, collectableFeild, orderRefDisable }: OrderDetailFormProps) => {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);

    return (

        <CardContent className='space-y-6'>
            <FormField
                control={form.control}
                name="order_reference_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel
                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                        >
                            Order ID/Reference Number <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading || orderRefDisable}
                                className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                placeholder="Enter the order reference ID"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Separator orientation='horizontal' />

            <div className='grid grid-cols-2 gap-5'>
                <FormField
                    control={form.control}
                    name="productDetails.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                Product Name <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the product name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex'>
                    <FormField
                        control={form.control}
                        name="productDetails.quantity"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                >
                                    Item Count <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className='flex'>
                                        <Button type='button' size={"icon"} variant={'ghost'} onClick={handleDecrement}><Minus size={18} /></Button>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-200/50 border-0 text-center dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter the quantity of items"
                                            {...field}
                                        />
                                        <Button type='button' size={"icon"} variant={'ghost'} onClick={handleIncrement}><Plus size={18} /></Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="productDetails.category"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                Product Category <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the product category"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="productDetails.hsn_code"
                    render={({ field }) => (
                        <FormItem className='pt-2'>
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                <div className='flex justify-between'>HSN Code <span className='opacity-60'  >Optional</span></div>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the HSN code"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </div>

            <div className='grid grid-cols-5 items-center justify-items-center'>
                <FormField
                    control={form.control}
                    name="productDetails.taxableValue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                Shipment Value <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the shipment value"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Plus size={18} className='mt-7' />
                <FormField
                    control={form.control}
                    name="productDetails.taxRate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                Tax Rate <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the tax rate"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Equal size={18} className='mt-7' />
                <FormField
                    control={form.control}
                    name="productDetails.taxableValue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                Total Value
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={true}
                                    className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the total value"
                                    {...field}
                                    value={
                                        (Number(form.watch('productDetails.taxableValue')) +
                                            (Number(form.watch('productDetails.taxRate')) / 100) *
                                            Number(form.watch('productDetails.taxableValue'))).toFixed(2)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex items-center space-x-2">
                <FormField
                    control={form.control}
                    name="fragile_items"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    My shipment contains fragile items.
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
            </div>

            <Separator orientation='horizontal' />

            <div className='grid grid-cols-3 gap-5'>
                <FormField
                    control={form.control}
                    name="order_invoice_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                <p className='flex justify-between'>
                                    Invoice Number
                                    <span className='text-xs opacity-60' >Optional</span>
                                </p>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the invoice number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="order_invoice_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                <p className='flex justify-between'>
                                    Invoice Date
                                    <span className='text-xs opacity-60' >Optional</span>
                                </p>
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal bg-zinc-200/50",
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
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ewaybill"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                <p className='flex justify-between'>
                                    Eway Bill
                                    <span className='text-xs opacity-60' >Optional</span>
                                </p>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-200/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the Eway Bill"
                                    {...field}
                                    maxLength={12}
                                    type='text'
                                    inputMode='numeric'
                                    pattern="\d*"
                                    //@ts-ignore
                                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="payment_mode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                Payment Mode <span className='text-red-500'>*</span>
                            </FormLabel>
                            <Select
                                disabled={isLoading || form.watch("isReverseOrder") === true }
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger
                                        className="bg-zinc-300/50 dark:bg-zinc-700 dark:text-white border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                    >
                                        <SelectValue placeholder={form.watch("payment_mode") || "Select a payment mode"} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={"COD"}>Cash on Delivery</SelectItem>
                                    <SelectItem  value={"Prepaid"}>Prepaid</SelectItem>
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
                            name="amount2Collect"
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

    )
}