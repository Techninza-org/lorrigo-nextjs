'use client'
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Fragment, useCallback, useEffect, useState } from "react";
import { PlusCircleIcon } from "lucide-react";

interface BoxDetailsProps {
    form: any;
    isLoading: boolean;
    fields: any[];
    append: (value: any) => void;
}

export const B2bBoxDetails = ({ form, isLoading, fields, append }: BoxDetailsProps) => {

    const [boxesLeft, setBoxesLeft] = useState(0);
    const total = form.watch('quantity');
    const boxes = form.watch('boxes');

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number, fieldName: string) => {
        let numericValue = e.target.value.replace(/[^0-9.]/g, '');
        const parts = numericValue?.split('.');
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }
        const field = e.target.name;
        form.setValue(field, numericValue);
    
        // Update the boxesLeft state when the quantity changes
        const updatedBoxes = [...boxes];
        updatedBoxes[index][fieldName] = numericValue;
        const updatedTotalQty = updatedBoxes.reduce((sum: number, box: any) => sum + Number(box.qty || 0), 0);
        setBoxesLeft(total - updatedTotalQty);
    }, [form, total, boxes]);
    
    const isError = (name: string) => {
        return form.formState.isSubmitted && form.formState.errors[name];
    };
    
    useEffect(() => {
        const totalQty = boxes.reduce((sum: number, box: any) => sum + Number(box.qty || 0), 0);
        setBoxesLeft(total - totalQty);
    }, [total, boxes]);
    
    const addMoreFields = () => {
        append({ qty: "", orderBoxLength: "", orderBoxWidth: "", orderBoxHeight: "", orderBoxWeight: "", boxSizeUnit: "cm", boxWeightUnit: "kg" });
    };

    return (
        <CardContent className="grid grid-cols-6 gap-3 items-center justify-items-center">
            {fields.map((field: any, index: number) => (
                <Fragment key={index}>
                    <FormField
                        control={form.control}
                        name={`boxes[${index}].qty`}
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex flex-row justify-between items-center">
                                        <Input
                                            disabled={isLoading}
                                            className={cn("w-full bg-zinc-200/50  text-center dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                            )}
                                            placeholder="Qty"
                                            {...field}
                                            onChange={(e) => handleChange(e, index, 'qty')}
                                        />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`boxes[${index}].orderBoxWeight`}
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex flex-row justify-between items-center">
                                        <Input
                                            disabled={isLoading}
                                            className={cn("w-full bg-zinc-200/50 text-center dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                            )}
                                            placeholder="Weight"
                                            {...field}
                                            onChange={(e) => handleChange(e, index, 'orderBoxWeight')}
                                        />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`boxes[${index}].orderBoxLength`}
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex flex-row justify-between items-center">
                                        <Input
                                            disabled={isLoading}
                                            className={cn("w-full bg-zinc-200/50  text-center dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                            )}
                                            placeholder="Length"
                                            {...field}
                                           onChange={(e) => handleChange(e, index, 'orderBoxLength')}
                                        />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`boxes[${index}].orderBoxWidth`}
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex flex-row justify-between items-center">
                                        <Input
                                            disabled={isLoading}
                                            className={cn("w-full bg-zinc-200/50 text-center dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                            )}
                                            placeholder="Width"
                                            {...field}
                                           onChange={(e) => handleChange(e, index, 'orderBoxWidth')}
                                        />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`boxes[${index}].orderBoxHeight`}
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex flex-row justify-between items-center">
                                        <Input
                                            disabled={isLoading}
                                            className={cn("w-full bg-zinc-200/50 text-center dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                                                isError(field.name) ? "border-red-500 dark:border-red-500" : "border-0 dark:border-0"
                                            )}
                                            placeholder="Height"
                                            {...field}
                                           onChange={(e) => handleChange(e, index, 'orderBoxHeight')}
                                        />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type='button' variant={"secondary"}>cm</Button>
                </Fragment>
            ))}
            <Button
                type="button"
                variant={'webPageBtn'}
                size={'icon'}
                onClick={addMoreFields}
                disabled={boxesLeft <= 0}>
                <PlusCircleIcon size={20} />
            </Button>
            {boxesLeft > 0 && <FormMessage className="col-span-5 text-center text-sm text-red-600">{boxesLeft} boxes left</FormMessage>}
        </CardContent>
    );
}