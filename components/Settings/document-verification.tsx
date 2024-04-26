'use client'
import React from 'react'
import { Button } from '../ui/button';
import { useKycProvider } from '../providers/KycProvider';
import { GstinTanVerificationForm } from './GstinTanVerificationForm';
import { DocumentUploadForm } from './DocumentUploadForm';
import { AadharPanVerificationForm } from './AadharPanVerification';

const DocumentVerification = () => {
  const { onHandleBack, formData } = useKycProvider();
  const businessType = formData?.businessType;

  return (
    <>
      {/* {businessType === 'company' ? <GstinTanVerificationForm /> : <AadharPanVerificationForm />}
      <br /> */}
      <DocumentUploadForm />
      <div className='flex justify-between'>
        <Button type="button" variant={'themeButton'} onClick={onHandleBack} className='mt-6'>Back</Button>
      </div>
    </>
  )
}

export default DocumentVerification