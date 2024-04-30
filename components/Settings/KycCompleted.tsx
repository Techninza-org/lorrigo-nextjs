import React, { useState, useEffect } from 'react'
import { useKycProvider } from '../providers/KycProvider';
import { Card, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import axios, { AxiosInstance } from 'axios';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSellerProvider } from '../providers/SellerProvider';

const KycCompleted = () => {
  const [submitted, setSubmitted] = useState(false);
  const [verified, setVerified] = useState(false);
  const { formData } = useKycProvider();
  const { userToken } = useAuth();
  const router = useRouter()
  const { seller } = useSellerProvider();

  const axiosConfig = {
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
    headers: {
      'Content-Type': 'application/json',        ///////sending Buffer files????
      ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
    },
  };

  const axiosIWAuth: AxiosInstance = axios.create(axiosConfig);

  useEffect(() => {
    if (seller?.kycDetails?.submitted === true) {
      setSubmitted(true);
    }
    if (seller?.kycDetails?.verified === true) {
      setVerified(true);
    }
  }, []);

  const handleCompleteKyc = async () => {
    const kycDetails = {
      kycDetails: {
        businessType: formData?.businessType,
        // photoUrl: formData?.photoUrl,
        // gstin: formData?.gstin,
        // pan: formData?.pan,
        // document1Front: formData?.document1Front,
        // document1Back: formData?.document1Back,
        // document2Front: formData?.document2Front,
        // document2Back: formData?.document2Back,
        submitted: true,
        verified: true,
      }
    }
    try {
      const userRes = await axiosIWAuth.put("/seller", kycDetails);

      if (userRes.data.message == 'request entity too large') {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File size too large. Please upload a file less than 2MB.",
        });
      }
      if (userRes) {
        toast({
          title: "Success",
          description: "KYC Documents submitted successfully.",
        });
      }
      router.push('/settings')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "error.response.data.message",
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