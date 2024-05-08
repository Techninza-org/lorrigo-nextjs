"use client"
import React, { useState, useEffect } from 'react'
import { useKycProvider } from '../providers/KycProvider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useSellerProvider } from '../providers/SellerProvider';
import { useAxios } from '../providers/AxiosProvider';
import { useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, ShieldAlertIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Separator } from '../ui/separator';


const KycCompleted = () => {
  const { formData } = useKycProvider();
  const { seller, getSeller } = useSellerProvider();
  const { axiosIWAuth4Upload } = useAxios();

  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {

    if (seller?.kycDetails?.submitted === true) {
      setSubmitted(true);
    }
    if (seller?.isVerified === true) {
      setVerified(true);
    }
  }, [seller]);

  const handleCompleteKyc = async () => {

    const form = new FormData();
    form.append('businessType', formData?.businessType || '');
    form.append('photoUrl', formData?.photoUrl || '');  //Base64 (String) image
    form.append('gstin', seller?.gstInvoice?.gstin || '');
    form.append('pan', formData?.pan || '');
    form.append('document1Front', formData?.document1Front || '');
    form.append('document1Back', formData?.document1Back || '');
    form.append('document2Front', formData?.document2Front || '');
    form.append('document2Back', formData?.document2Back || '');
    form.append('submitted', 'true');
    form.append('verified', 'false');

    try {
      const userRes = await axiosIWAuth4Upload.put("/seller/kyc", form);

      if (userRes?.data?.valid) {

        toast({
          title: "Success",
          description: "KYC Documents submitted successfully.",
        });
        getSeller()
      }
      router.push('/settings')
    } catch (error: any) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  }

  const StatusIcon = verified ? Check : ShieldAlertIcon

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Status</CardTitle>
      </CardHeader>
      {!verified && submitted && (
        <CardContent>
          <Alert className='bg-amber-300'>
            <StatusIcon size={26} className='animate-pulse' />
            <AlertTitle className='text-lg'>{verified ? "Congratulation" : "Pending"}</AlertTitle>
            <AlertDescription>
              {verified ? "KYC is completed." : "KYC is in the queue for verification."}
            </AlertDescription>
          </Alert>

          <div className='p-3 flex gap-3'>

            <Image src={`data:image/jpeg;base64,${seller?.kycDetails?.photoUrl || formData?.photoUrl || ""}`} alt="photo" width={330} height={330} />

            <div className='w-full'>
              <div className='flex justify-between w-full px-3 py-4'>
                <p className='space-x-2'><span className='text-gray-500'>KYC Status:</span> <span className={cn(verified ? "text-green-500" : "text-yellow-500")}>{verified ? "Verified" : "Pending"}</span></p>
                <p className='space-x-2'><span className='text-gray-500'>Current business type:</span> <span className='capitalize'>{seller?.kycDetails.businessType || formData?.businessType}</span></p>
              </div>
              <Separator orientation='horizontal' />
              <div className='flex w-full p-5'>
                <div className='w-full'>
                  <div className='grid grid-cols-2'>
                    <div>Document 1 Type:</div>
                    <div>{seller?.kycDetails.pan || formData?.pan || 1}</div>
                  </div>
                  <div className='grid grid-cols-2'>
                    <div>Document 1 Type:</div>
                    <div>{seller?.kycDetails.pan || formData?.pan || 1}</div>
                  </div>
                </div>
                <div className='w-full'>
                  <div className='grid grid-cols-2'>
                    <div>Document 2 Type:</div>
                    <div>{seller?.kycDetails.pan || formData?.pan || 2}</div>
                  </div>
                  <div className='grid grid-cols-2'>
                    <div>Document 2 Type:</div>
                    <div>{seller?.kycDetails.pan || formData?.pan || 2}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </CardContent>
      )}
      {verified && <p>KYC is completed.</p>}
      {!submitted && !verified && <p>Submit your KYC details</p>}
      {!submitted && !verified && <Button variant={'themeButton'} type="button" onClick={handleCompleteKyc} className='mt-6'>Complete KYC</Button>}
    </Card>
  )
}

export default KycCompleted