import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface BoxDetailsProps {
    form: any;
    isLoading: boolean;
}
export const BoxDetails = ({ form, isLoading }: BoxDetailsProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let numericValue = e.target.value.replace(/[^0-9.]/g, '');
        const parts = numericValue.split('.');
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }
        const field = e.target.name;
        form.setValue(field, numericValue);
    };

    const isError = (name: string) => {
        return form.formState.isSubmitted && form.formState.errors[name] ? true : false;
    };

    return (
        <CardContent className="grid grid-cols-4 gap-3 items-center justify-items-center">
            <div className="col-span-4 mb-2">
            </div>
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
            <FormDescription className="col-span-4 w-full">Length x Breadth x Height <span className='text-red-500'>*</span></FormDescription>
            <div className="col-span-4 flex items-end gap-3 w-full">
                <FormField
                    control={form.control}
                    name="orderWeight"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                            >
                                Weight <span className='text-red-500'>*</span>
                            </FormLabel>
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

        </CardContent>
    );
}