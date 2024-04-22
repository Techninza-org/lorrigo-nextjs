'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useModal } from '@/hooks/use-model-store';
import { useKycProvider } from '../providers/KycProvider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronsUpDown, Upload } from 'lucide-react';

const DocumentUploadSchema = z.object({
    document1Front: z.string().min(1, 'Document is required'),
    document1Back: z.string().optional(),
    document2Front: z.string().min(1, 'Document is required'),
    document2Back: z.string().optional(),
})

export const DocumentUploadForm = () => {
    const router = useRouter();
    const { onClose } = useModal();
    const { formData, setFormData, verifyOtpOpen, setVerifyOtpOpen, onHandleNext } = useKycProvider();
    const businessType = formData?.businessType;

    const form = useForm<z.infer<typeof DocumentUploadSchema>>({
        resolver: zodResolver(DocumentUploadSchema),
    })

    const onSubmit = async (values: z.infer<typeof DocumentUploadSchema>) => {
        try {
            setFormData((prev: any) => ({ ...prev, ...values }));
            console.log('documents submitted');
            //go to next step
            onHandleNext();
            
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileChange = (fieldName: "document1Front" | "document1Back" | "document2Front" | "document2Back") => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            form.setValue(fieldName, reader.result as string);
            console.log(fieldName, form.getValues(fieldName));
            console.log(formData);

        };
        reader.readAsDataURL(file);
    };

    function handleOpen() {
        setVerifyOtpOpen(!verifyOtpOpen);
    }

    return (
        <Card className='h-full'>
            <div className='flex p-6 justify-between'>
                <div>
                    <CardTitle>KYC by uploading ID & Address Proofs</CardTitle>
                    <CardDescription>(Upload pdf or images)</CardDescription>
                </div>
                <div className='cursor-pointer' onClick={handleOpen}><ChevronsUpDown /></div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={verifyOtpOpen ? 'hidden' : ''}>
                    <hr />
                    <div className='grid grid-cols-2 p-10 h-full'>
                        <div>
                            <h1 className='font-semibold mb-4'>Document Type</h1>
                            <Select>
                                <SelectTrigger className="w-2/3">
                                    <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessType === 'company' ?
                                        <SelectGroup>
                                            <SelectItem value="coi">Certificate of Incorporation </SelectItem>
                                            <SelectItem value="llp-aggrement">LLP agreement </SelectItem>
                                            <SelectItem value="pan">PAN Card</SelectItem>
                                            <SelectItem value="memoradum">Memorandum & Articles of Association</SelectItem>
                                        </SelectGroup>
                                        :
                                        <SelectGroup>
                                            <SelectItem value="aadhar">Aadhar Card</SelectItem>
                                            <SelectItem value="pan">Pan Card</SelectItem>
                                        </SelectGroup>}
                                </SelectContent>
                            </Select>
                            <h1 className='font-semibold my-4'>Document Image</h1>
                            <div className='flex gap-8'>
                                <div>
                                    <div className='border-2 border-dashed border-[#be0c34] rounded-lg w-2/3 h-[150px] grid place-content-center bg-[#F7F7F7]'>
                                        <div className='flex justify-center mb-2'><Upload size={30} color='#be0c34' /></div>
                                        <p>Upload Front Side</p>
                                    </div>
                                    <br />
                                    <input type='file' onChange={handleFileChange('document1Front')} accept='.png, .jpg, .jpeg' />
                                    <FormMessage />
                                </div>
                                <div>
                                    <div className='border-2 border-dashed border-[#be0c34] rounded-lg w-2/3 h-[150px] grid place-content-center bg-[#F7F7F7]'>
                                        <div className='flex justify-center mb-2'><Upload size={30} color='#be0c34' /></div>
                                        <p>Upload Back Side</p>
                                    </div>
                                    <br />
                                    <input type='file' onChange={handleFileChange('document1Back')} accept='.png, .jpg, .jpeg' />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className='font-semibold mb-4'>Document Type</h1>
                            <Select>
                                <SelectTrigger className="w-2/3">
                                    <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessType === 'company' ?
                                        <SelectGroup>
                                            <SelectItem value="coi">Certificate of Incorporation </SelectItem>
                                            <SelectItem value="llp-aggrement">LLP agreement </SelectItem>
                                            <SelectItem value="pan">PAN Card</SelectItem>
                                            <SelectItem value="memoradum">Memorandum & Articles of Association</SelectItem>
                                        </SelectGroup>
                                        :
                                        <SelectGroup>
                                            <SelectItem value="aadhar">Aadhar Card</SelectItem>
                                            <SelectItem value="pan">Pan Card</SelectItem>
                                        </SelectGroup>}
                                </SelectContent>
                            </Select>
                            <h1 className='font-semibold my-4'>Document Image</h1>
                            <div className='flex gap-8'>
                                <div>
                                    <div className='border-2 border-dashed border-[#be0c34] rounded-lg w-2/3 h-[150px] grid place-content-center bg-[#F7F7F7]'>
                                        <div className='flex justify-center mb-2'><Upload size={30} color='#be0c34' /></div>
                                        <p>Upload Front Side</p>
                                    </div>
                                    <br />
                                    <input type='file' onChange={handleFileChange('document2Front')} accept='.png, .jpg, .jpeg' />
                                    <FormMessage />
                                </div>
                                <div>
                                    <div className='border-2 border-dashed border-[#be0c34] rounded-lg w-2/3 h-[150px] grid place-content-center bg-[#F7F7F7]'>
                                        <div className='flex justify-center mb-2'><Upload size={30} color='#be0c34' /></div>
                                        <p>Upload Back Side</p>
                                    </div>
                                    <br />
                                    <input type='file' onChange={handleFileChange('document2Back')} accept='.png, .jpg, .jpeg' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button type='submit' variant={'themeButton'}>Submit Documents</Button>
                </form>
            </Form>
        </Card>
    )
}

