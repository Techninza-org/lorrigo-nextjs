'use client'
import React, { useEffect } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button';
import { useKycProvider } from '../providers/KycProvider';
import { Smartphone } from 'lucide-react';
import { GstinTanVerificationForm } from './GstinTanVerificationForm';
import { DocumentUploadForm } from './DocumentUploadForm';
import { AadharPanVerificationForm } from './AadharPanVerification';

const DocumentVerification = () => {
  const { onHandleBack, formData } = useKycProvider();
  const businessType = formData?.businessType;
  let completed = false;

  function handleCompleteKyc(){
    console.log('KYC Completed');
    console.log('formdata: ', formData);
  }

  return (
    <>
      {businessType === 'company' ? <GstinTanVerificationForm /> : <AadharPanVerificationForm />}
      <br />
      <DocumentUploadForm />
      <div className='flex justify-between'>
        <Button type="button" variant={'themeButton'} onClick={onHandleBack} className='mt-6'>Back</Button>
        <Button type="submit" variant={'themeButton'} onClick={handleCompleteKyc} className={completed? 'mt-6': 'hidden'}>Complete KYC</Button>
      </div>
    </>
  )
}

export default DocumentVerification