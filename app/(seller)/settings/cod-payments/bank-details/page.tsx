import BankDetailsForm from '@/components/Settings/bank-details'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'

const BankDetails = () => {
  return (
      <Card>
        <CardContent className='px-10 py-5'>
          <CardTitle className='py-4 font-semibold'>Bank Account Details</CardTitle>
          <CardDescription>As a verification process we will make a transaction of Rs 1.0 to your bank account. Your account is verified when your account credited successfully in bank account.</CardDescription>
          <p className='mt-4'>Note: Account holder&apos;s name should be same as the name mentioned in the KYC document</p>
          <BankDetailsForm />
        </CardContent>
      </Card>
  )
}

export default BankDetails