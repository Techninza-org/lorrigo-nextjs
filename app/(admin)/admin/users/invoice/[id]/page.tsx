import AdminInvoiceById from '@/components/Admin/User/AdminInvoiceById'
import { Card, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function page() {
  return (
    <Card className='p-5'>
      <CardTitle className='mb-5'>Inovice</CardTitle>
      <AdminInvoiceById />
    </Card>
  )
}
