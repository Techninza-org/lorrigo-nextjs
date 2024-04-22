import React from 'react'
import { useKycProvider } from '../providers/KycProvider';

const KycCompleted = () => {
    const { onHandleBack, formData } = useKycProvider();
    console.log('KYC Completed');
    console.log('formdata: ', formData);
    
    
  return (
    <div>KYC Documents Submitted</div>
  )
}

export default KycCompleted