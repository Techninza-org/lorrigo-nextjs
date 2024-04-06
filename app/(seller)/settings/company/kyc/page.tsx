import KycForm from '@/components/Settings/kyc-form'
import { Card } from '@/components/ui/card'
import React from 'react'

const KYC = () => {
  return (
    <div>
      <h1 className='py-5 text-2xl font-semibold'>KYC</h1>
      <div className='flex justify-center'>
        <Card className='w-4/5'>
          <KycForm />
        </Card>
      </div>
    </div>
  )
}

export default KYC