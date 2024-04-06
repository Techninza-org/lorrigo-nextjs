import { CompanyProfileForm } from '@/components/Settings/company-profile-form'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import React from 'react'

const CompanyProfile = () => {
  return (
    <div>
      <h1 className='py-5 text-2xl font-semibold'>Settings - Company Profile</h1>
      <Card>
        <CardContent className='px-10 py-5'>
          <CardTitle className='py-4 font-semibold'>Company Details</CardTitle>
          <hr />
          <CompanyProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default CompanyProfile