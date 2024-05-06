'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormMessage } from '@/components/ui/form';
import { Button } from '../ui/button';
import { Card, CardDescription, CardTitle } from '../ui/card';
import { useKycProvider } from '../providers/KycProvider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronsUpDown } from 'lucide-react';
import { toast } from '../ui/use-toast';
import ImageUpload from '../file-upload';

export type DocumentUploadSchema = {
    document1Front: File | string | null,
    document1Back: File | string | null,
    document2Front: File | string | null,
    document2Back: File | string | null,
}

export const DocumentUploadForm = () => {
    const { formData, setFormData, verifyOtpOpen, setVerifyOtpOpen, onHandleNext } = useKycProvider();
    const businessType = formData?.businessType;

    const form = useForm<DocumentUploadSchema>();

    const onSubmit = async (values: DocumentUploadSchema) => {
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
        form.setValue(fieldName, file);
    };

    const renderDocumentTypeOptions = () => {
        if (businessType === 'company') {
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
                            <div key={index}>
                                <h1 className='font-semibold mb-4'>Document Type</h1>
                                <Select>
                                    <SelectTrigger className="w-2/3">
                                        <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                    <SelectContent>{renderDocumentTypeOptions()}</SelectContent>
                                </Select>
                                <h1 className='font-semibold my-4'>Document Image</h1>
                                <div className='flex gap-8'>
                                    <div className='w-60'>
                                        <ImageUpload
                                            Label={"Front Side"}
                                            uploadUrl=''
                                            handleFileChange={handleFileChange}
                                            fieldName={`document${index}Front` as keyof DocumentUploadSchema}
                                        />
                                        <FormMessage />
                                    </div>
                                    <div className='w-60'>
                                        <ImageUpload
                                            Label={"Back Side"}
                                            uploadUrl=''
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
