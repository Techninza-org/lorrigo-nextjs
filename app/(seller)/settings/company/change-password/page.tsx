import ChangePasswordForm from '@/components/Settings/change-password-form'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import React from 'react'

const ChangePassword = () => {
  return (
    <div>
      <h1 className='py-5 text-2xl font-semibold'>Settings - Password</h1>
      <Card>
        <CardContent className='px-10 py-5'>
          <CardTitle className='py-4 font-semibold'>Change Password</CardTitle>
            <ChangePasswordForm />
        </CardContent>

      </Card>
    </div>
  )
}

export default ChangePassword