import GstinForm from '@/components/Settings/gstin-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React from 'react'
const GstinInvoicing = () => {
  return (
    <Card>
      <CardContent className='px-1 sm:px-10 py-5'>
        <CardTitle className='py-4 font-semibold'>GSTIN Invoicing</CardTitle>
        
        <GstinForm />
        
        {/* <div className='w-1/2 mt-6'>
          <div className='flex justify-between font-semibold'>
            <h3>Enable State GST Invoicing</h3>
            <Button variant={'themeButton'} className='rounded-full'><Plus size={15} /> Add State</Button>
          </div>
          <div className='text-sm text-slate-500'>
            Want to enable GST?
            <ul className='list-disc mx-4'>
              <li>When you have multiple GSTINs from different state.</li>
              <li>When you want to generate separate freight invoices for each pickup address.</li>
              <li>When you want to calm input credit on tax paid by you on your purchase.</li>
            </ul>
          </div>
        </div> */}
        <p className='my-6'>Note: <span className='text-slate-500 text-sm'>Customer&apos;s Invoices will be generated with pickup address</span></p>
      </CardContent>
    </Card>
  )
}

export default GstinInvoicing