import Invoice from '@/components/Admin/Invoice/Invoice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function page() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="md:flex justify-between space-y-3">
          Invoice List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Invoice />
      </CardContent>
    </Card>
  )
}
