import BankDetailsForm from '@/components/Settings/bank-details'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'

const BankDetails = () => {
  return (
      <Card>
        <CardContent className='px-1 sm:px-10 py-5'>
          <CardTitle className='py-4 font-semibold'>Bank Account Details</CardTitle>
          <p className='mt-4'>Note: Account holder&apos;s name should be same as the name mentioned in the KYC document</p>
          <BankDetailsForm />
        </CardContent>
      </Card>
  )
}

export default BankDetails