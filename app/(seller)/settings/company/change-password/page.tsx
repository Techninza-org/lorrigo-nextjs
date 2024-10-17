import ChangePasswordForm from '@/components/Settings/change-password-form'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import React from 'react'

const ChangePassword = () => {
  return (
      <Card>
        <CardContent className='px-1 sm:px-10 py-5'>
          <CardTitle className='py-4 pl-2 sm:pl-0 font-semibold'>Change Password</CardTitle>
            <ChangePasswordForm />
        </CardContent>
      </Card>
  )
}

export default ChangePassword