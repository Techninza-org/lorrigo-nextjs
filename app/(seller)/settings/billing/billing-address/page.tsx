import BillingAddressForm from '@/components/Settings/billing-address-form'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import React from 'react'

const BillingAddress = () => {
  return (
      <Card>
        <CardContent className='px-10 py-5'>
          <CardTitle className='py-4 font-semibold'>Billing Address</CardTitle>
          <BillingAddressForm />
        </CardContent>
      </Card>
  )
}

export default BillingAddress