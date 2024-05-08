import { CompanyProfileForm } from '@/components/Settings/company-profile-form'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import React from 'react'

const CompanyProfile = () => {
  return (
    <Card>
      <CardContent className='px-10 py-5'>
        <CardTitle className='py-4 font-semibold'>Company Details</CardTitle>
        <CompanyProfileForm />
      </CardContent>
    </Card>
  )
}

export default CompanyProfile