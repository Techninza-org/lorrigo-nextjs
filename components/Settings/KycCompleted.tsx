import React, { useState, useEffect } from 'react'
import { useKycProvider } from '../providers/KycProvider';
import { Card, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useSellerProvider } from '../providers/SellerProvider';
import { useAxios } from '../providers/AxiosProvider';
import { useRouter } from 'next/router';
import { toast } from '../ui/use-toast';

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
    if ( seller?.isVerified === true) {
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


  return (
    <Card className='p-10'>
      <CardTitle className='mb-8'>KYC Status</CardTitle>
      {!verified && submitted && <p>Documents are uploaded and KYC is under process.</p>}
      {verified && <p>KYC is completed.</p>}
      {!submitted && !verified && <p>Submit your KYC details</p>}
      {!submitted && !verified && <Button variant={'themeButton'} type="button" onClick={handleCompleteKyc} className='mt-6'>Complete KYC</Button>}
    </Card>
  )
}

export default KycCompleted