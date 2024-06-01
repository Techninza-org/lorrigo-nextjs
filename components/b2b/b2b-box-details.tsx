'use client'
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";

interface BoxDetailsProps {
    form: any;
    isLoading: boolean;
    fields: any[];
    append: (value: any) => void;
}

export const B2bBoxDetails = ({ form, isLoading, fields, append }: BoxDetailsProps) => {
  
    const [boxesLeft, setBoxesLeft] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let numericValue = e.target.value.replace(/[^0-9.]/g, '');
        const parts = numericValue?.split('.');
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }
        const field = e.target.name;
        form.setValue(field, numericValue);
    };

    const isError = (name: string) => {
        return form.formState.isSubmitted && form.formState.errors[name] ? true : false;
    };

    const total = form.watch('quantity');
    const boxes = form.watch('boxes');
    console.log(boxes);
    let isFilled = false;
    if(boxes.length >= 1){
        if(Number(boxes[boxes.length-1].qty) === 0 || Number.isNaN(Number(boxes[0].qty))){
            isFilled = false; 
        }else{
            isFilled = true;
        }
    }
    useEffect(() => {
        let totalQty = fields.reduce((sum, field) => sum + Number(field.qty), 0);
        const leftOne = (total - totalQty);
        setBoxesLeft(leftOne);
        }, [fields, total]); 
        
    const addMoreFields = () => {
        append({ qty: "", orderBoxLength: "", orderBoxWidth: "", orderBoxHeight: "", orderBoxWeight: "", boxSizeUnit: "cm", boxWeightUnit: "kg"});
    };

    return (
        <CardContent className="grid grid-cols-6 gap-3 items-center justify-items-center">
            {fields.map((field: any, index: number) => (
                <>
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type='button' variant={"secondary"}>cm</Button>
                </>
            ))}
            {boxesLeft > 0 && <FormMessage className="col-span-5 text-center text-sm text-red-600">{boxesLeft} boxes left</FormMessage>}
            {(boxesLeft   && isFilled)&& <Button type="button" onClick={addMoreFields} disabled={boxesLeft === 0} >ADD MORE</Button>}
        </CardContent>
    );
}