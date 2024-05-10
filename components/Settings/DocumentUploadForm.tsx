'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '../ui/button';
import { Card, CardDescription, CardTitle } from '../ui/card';
import { useKycProvider } from '../providers/KycProvider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronsUpDown } from 'lucide-react';
import { toast } from '../ui/use-toast';
import ImageUpload from '../file-upload';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type DocumentUploadSchema = {
    document1Front: File | string | null,
    document1Back: File | string | null,
    document2Front: File | string | null,
    document2Back: File | string | null,
}

export const DocumentUploadFormSchema = z.object({
    document1Feild: z.string().min(1, "Required"),
    document1Front: z.instanceof(File),
    document1Back: z.instanceof(File),
    document2Feild: z.string().min(1, "Required"),
    document2Front: z.instanceof(File),
    document2Back: z.instanceof(File),
    document1Type: z.string().min(1, "Required"),
    document2Type: z.string().min(1, "Required"),
})


export const DocumentUploadForm = () => {
    const { formData, setFormData, verifyOtpOpen, setVerifyOtpOpen, onHandleNext } = useKycProvider();
    const businessType = formData?.businessType;

    const form = useForm({
        resolver: zodResolver(DocumentUploadFormSchema),
        defaultValues: {
            document1Feild: "",
            document1Front: typeof File,
            document1Back: typeof File,
            document2Feild: "",
            document2Front: typeof File,
            document2Back: typeof File,
        }
    });


    const onSubmit = async (values: DocumentUploadSchema) => {
        console.log(values,
            "document1Front", values.document1Front instanceof File,
        )
        try {
            const { document1Front, document2Front } = values;

            if (!document1Front || !document2Front) {
                toast({
                    variant: 'destructive',
                    title: "Documents not uploaded",
                    description: "Please upload all the documents.",
                })
                return;
            }
            setFormData((prev: any) => ({ ...prev, ...values }));
            onHandleNext();
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileChange = ({ fieldName, file }: { fieldName: keyof DocumentUploadSchema, file: File }) => {
        form.setValue(fieldName, file as any);
    };

    const renderDocumentTypeOptions = () => {
        if (businessType === 'Company') {
            return (
                <SelectGroup>
                    <SelectItem value="coi">Certificate of Incorporation </SelectItem>
                    <SelectItem value="llp-aggrement">LLP agreement </SelectItem>
                    <SelectItem value="pan">PAN Card</SelectItem>
                    <SelectItem value="memoradum">Memorandum & Articles of Association</SelectItem>
                </SelectGroup>
            );
        } else {
            return (
                <SelectGroup>
                    <SelectItem value="aadhar">Aadhar Card</SelectItem>
                    <SelectItem value="pan">Pan Card</SelectItem>
                </SelectGroup>
            );
        }
    };

    const handleOpen = () => {
        setVerifyOtpOpen(!verifyOtpOpen);
    }

    return (
        <Card className='h-full'>
            <div className='flex p-6 justify-between'>
                <div>
                    <CardTitle>KYC by uploading ID & Address Proofs</CardTitle>
                    <CardDescription>(Upload documents as jpeg, jpg or png)</CardDescription>
                </div>
                <div className='cursor-pointer' onClick={handleOpen}><ChevronsUpDown /></div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={verifyOtpOpen ? 'hidden' : ''}>
                    <hr />
                    <div className='grid grid-cols-2 p-10 h-full'>
                        {[1, 2].map((index) => (
                            <div key={index} className='w-2/3 space-y-3'>
                                {/* <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                    <SelectContent>{renderDocumentTypeOptions()}</SelectContent>
                                </Select> */}
                                <FormField
                                    control={form.control}
                                    name={`document${index}Type` as keyof DocumentUploadSchema}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className="font-bold"
                                            >
                                                Document Type <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='capitalize'>
                                                        <SelectValue placeholder={"Select a Document Type"} />
                                                    </SelectTrigger>
                                                </FormControl>  
                                                <SelectContent>
                                                    {renderDocumentTypeOptions()}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`document${index}Feild` as keyof DocumentUploadSchema}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>
                                                Document {index} <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter the Document Number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Label className='font-semibold'>Document Image <span className='text-red-500'>*</span></Label>
                                <div className='flex gap-8'>
                                    <div className='w-60'>
                                        <ImageUpload
                                            Label={"Front Side"}
                                            handleFileChange={handleFileChange}
                                            fieldName={`document${index}Front` as keyof DocumentUploadSchema}
                                        />
                                        <FormMessage />
                                    </div>
                                    <div className='w-60'>
                                        <ImageUpload
                                            Label={"Back Side"}
                                            handleFileChange={handleFileChange}
                                            fieldName={`document${index}Back` as keyof DocumentUploadSchema}
                                        />

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-end mb-6 mr-6'><Button type='submit' variant={'themeButton'}>Submit Documents</Button></div>
                </form>
            </Form>
        </Card>
    )
}
