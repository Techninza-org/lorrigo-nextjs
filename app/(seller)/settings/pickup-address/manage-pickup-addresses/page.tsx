import PickupAddresses from '@/components/Settings/pickup-addresses'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'


const ManagePickupAddresses = () => {
  return (
    <div>
      <h1 className='py-5 text-2xl font-semibold'>Settings - Manage Pickup Addresses</h1>
      <Card>
        <CardContent className='px-10 py-5'>
          <PickupAddresses />
        </CardContent>
      </Card>
      

    </div>
  )
}

export default ManagePickupAddresses