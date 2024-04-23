import React from 'react'
import { useKycProvider } from '../providers/KycProvider';
import { Card, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import axios, { AxiosInstance } from 'axios';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';

const KycCompleted = () => {
    const { formData } = useKycProvider();
    const { userToken } = useAuth();
    const router = useRouter()

    const axiosConfig = {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
      headers: {
          'Content-Type': 'application/json',        ///////sending Buffer files????
          ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
      },
  };

  const axiosIWAuth: AxiosInstance = axios.create(axiosConfig);

    const handleCompleteKyc = async () =>{
        try{
            const userRes = await axiosIWAuth.put("/seller", formData);
            console.log(userRes);
            console.log(formData);
            
            if(userRes.data.message == 'request entity too large'){
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "File size too large. Please upload a file less than 2MB.",
                });
            }
            if(userRes){
                toast({
                    title: "Success",
                    description: "KYC Documents submitted successfully.",
                });
            }
            router.push('/settings')
        }catch (error) {
          toast({
              variant: "destructive",
              title: "Error",
              description: "error.response.data.message",
          });
      }
    }
    
    
  return (
    <Card className='p-10'>
      <CardTitle>KYC Documents Uploaded</CardTitle>
      <Button variant={'themeButton'} type="button" onClick={handleCompleteKyc} className='mt-6'>Complete KYC</Button>
    </Card>
  )
}

export default KycCompleted