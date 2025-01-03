'use client'
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { CardContent } from "../../ui/card";
import { FormField, FormItem, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Fragment, useCallback, useEffect, useState } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";

interface BoxDetailsProps {
    form: any;
    isLoading: boolean;
    fields: any[];
    append: (value: any) => void;
    remove: (index: number) => void;
}

export const B2bBoxDetails = ({ form, isLoading, fields, append, remove }: BoxDetailsProps) => {
    const [boxesLeft, setBoxesLeft] = useState(0);
    const total = form.watch('quantity');
    const boxes = form.watch('boxes');
    const { formState: { errors } } = form;

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number, fieldName: string) => {
        let numericValue = e.target.value.replace(/[^0-9.]/g, '');
        const parts = numericValue?.split('.');
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }
        const field = e.target.name;
        form.setValue(field, numericValue);

        const updatedBoxes = [...boxes];
        updatedBoxes[index][fieldName] = numericValue;
        const updatedTotalQty = updatedBoxes.reduce((sum: number, box: any) => sum + Number(box.qty || 0), 0);
        setBoxesLeft(total - updatedTotalQty);
    }, [form, total, boxes]);

    const isError = (name: string) => {
        const nameParts = name.match(/^boxes\[(\d+)\]\.(.+)$/);
        if (!nameParts) return false;

        const index = parseInt(nameParts[1], 10);
        const fieldName = nameParts[2];

        return errors?.boxes?.[index]?.[fieldName] ? true : false;
    };

    useEffect(() => {
        const totalQty = boxes?.reduce((sum: number, box: any) => sum + Number(box.qty || 0), 0);
        setBoxesLeft(total - totalQty);
    }, [total, boxes]);

    const addMoreFields = () => {
        append({ qty: "", orderBoxLength: "", orderBoxWidth: "", orderBoxHeight: "", orderBoxWeight: "", boxSizeUnit: "cm", boxWeightUnit: "kg" });
    };

    const removeFields = (index: number) => {
        remove(index);
    }

    return (
        <CardContent className="grid gap-4 p-2 sm:p-4 md:p-6 items-center justify-items-center">
            {fields.map((field: any, index: number) => (
                <Fragment key={field.id}>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 w-full">
                        <FormField
                            control={form.control}
                            name={`boxes[${index}].qty`}
                            render={({ field }) => (
                                <FormItem>
                                    <Input
                                        disabled={isLoading}
                                        className={cn("w-full text-center bg-zinc-200/50 dark:bg-zinc-700 dark:text-white", 
                                            isError(field.name) ? "border-red-500" : "border-0"
                                        )}
                                        placeholder="Qty"
                                        {...field}
                                        onChange={(e) => handleChange(e, index, 'qty')}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`boxes[${index}].orderBoxWeight`}
                            render={({ field }) => (
                                <FormItem>
                                    <Input
                                        disabled={isLoading}
                                        className={cn("w-full text-center bg-zinc-200/50 dark:bg-zinc-700 dark:text-white", 
                                            isError(field.name) ? "border-red-500" : "border-0"
                                        )}
                                        placeholder="Weight"
                                        {...field}
                                        onChange={(e) => handleChange(e, index, 'orderBoxWeight')}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`boxes[${index}].orderBoxLength`}
                            render={({ field }) => (
                                <FormItem>
                                    <Input
                                        disabled={isLoading}
                                        className={cn("w-full text-center bg-zinc-200/50 dark:bg-zinc-700 dark:text-white", 
                                            isError(field.name) ? "border-red-500" : "border-0"
                                        )}
                                        placeholder="Length"
                                        {...field}
                                        onChange={(e) => handleChange(e, index, 'orderBoxLength')}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`boxes[${index}].orderBoxWidth`}
                            render={({ field }) => (
                                <FormItem>
                                    <Input
                                        disabled={isLoading}
                                        className={cn("w-full text-center bg-zinc-200/50 dark:bg-zinc-700 dark:text-white", 
                                            isError(field.name) ? "border-red-500" : "border-0"
                                        )}
                                        placeholder="Width"
                                        {...field}
                                        onChange={(e) => handleChange(e, index, 'orderBoxWidth')}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`boxes[${index}].orderBoxHeight`}
                            render={({ field }) => (
                                <FormItem>
                                    <Input
                                        disabled={isLoading}
                                        className={cn("w-full text-center bg-zinc-200/50 dark:bg-zinc-700 dark:text-white", 
                                            isError(field.name) ? "border-red-500" : "border-0"
                                        )}
                                        placeholder="Height"
                                        {...field}
                                        onChange={(e) => handleChange(e, index, 'orderBoxHeight')}
                                    />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between items-center">
                            <Button type='button' variant="secondary" className="w-full">
                                cm
                            </Button>
                            <Button
                                type="button"
                                size={'icon'}
                                variant="destructive"
                                onClick={() => removeFields(index)}
                                disabled={isLoading || fields?.length <= 1 || boxesLeft <= 0}
                            >
                                <Trash2Icon size={18} />
                            </Button>
                        </div>
                    </div>
                </Fragment>
            ))}
            <div className="flex justify-between items-center w-full">
                <Button
                    type="button"
                    variant={'webPageBtn'}
                    size={'icon'}
                    onClick={addMoreFields}
                    disabled={boxesLeft <= 0}
                >
                    <PlusCircleIcon size={20} />
                </Button>
                {boxesLeft > 0 && (
                    <FormMessage className="text-center text-sm text-red-600">
                        {boxesLeft} boxes left
                    </FormMessage>
                )}
            </div>
        </CardContent>
    );
};

