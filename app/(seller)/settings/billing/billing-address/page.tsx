import BillingAddressForm from '@/components/Settings/billing-address-form'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import React from 'react'

const BillingAddress = () => {
  return (
    <div className='mb-8'>
      <h1 className='py-5 text-2xl font-semibold'>Settings - Billing</h1>  
      <Card>
        <CardContent className='px-10 py-5'>
          <CardTitle className='py-4 font-semibold'>Billing Address</CardTitle>
          <BillingAddressForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default BillingAddress