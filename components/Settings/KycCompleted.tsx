"use client"
import React, { useState, useEffect } from 'react'
import { useKycProvider } from '../providers/KycProvider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
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
    if (seller?.kycDetails?.verified === true) {
      setVerified(true);
    }
  }, [seller]);

  const handleCompleteKyc = async () => {

    const form = new FormData();
    form.append('businessType', formData?.businessType || '');
    form.append('photoUrl', formData?.photoUrl || '');  //Base64 (String) image
    form.append('gstin', seller?.gstInvoice?.gstin || '');
    form.append('pan', formData?.pan || '');
    form.append('document1Feild', formData?.document1Feild || '');
    form.append('document1Front', formData?.document1Front || '');
    form.append('document1Back', formData?.document1Back || '');
    form.append('document2Feild', formData?.document2Feild || '');
    form.append('document2Front', formData?.document2Front || '');
    form.append('document2Back', formData?.document2Back || '');
    form.append('document1Type', formData?.document1Type || '');
    form.append('document2Type', formData?.document2Type || '');

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
      {submitted && (
        <CardContent>
          <Alert className={cn(verified ? 'bg-green-300' : 'bg-amber-300')}>
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
                    <div className='capitalize'>{seller?.kycDetails.document1Type || formData?.document1Type}</div>
                  </div>
                  <div className='grid grid-cols-2'>
                    <div>Document 1 No:</div>
                    <div className='capitalize'>{seller?.kycDetails.document1Feild || formData?.document1Feild || 1}</div>
                  </div>
                </div>
                <div className='w-full'>
                  <div className='grid grid-cols-2'>
                    <div>Document 2 Type:</div>
                    <div className='capitalize'>{seller?.kycDetails.document2Type || formData?.document2Type || 2}</div>
                  </div>
                  <div className='grid grid-cols-2'>
                    <div>Document 2 No:</div>
                    <div className='capitalize'>{seller?.kycDetails.document2Feild || formData?.document2Feild || 2}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </CardContent>
      )}
      {!submitted && !verified && <p className='pl-5'>Submit your KYC details</p>}
      <CardFooter>
        {!submitted && !verified && <Button variant={'themeButton'} type="button" onClick={handleCompleteKyc} className='mt-6'>Submit your KYC details</Button>}
      </CardFooter>
    </Card>
  )
}

export default KycCompleted