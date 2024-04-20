import React from 'react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'


const BusinessType = () => {
    return (
        <div>
            <div className='grid gap-6'>
                <Card className='px-10 py-4 flex hover:shadow-md hover:shadow-slate-200'>
                    <input type="radio" id="individual" name="businessType" value="individual" className='mr-8 accent-red-600 scale-125' />
                    <label htmlFor="individual" className="cursor-pointer" >
                        <CardTitle>Individual</CardTitle>
                        <CardDescription className='pt-3'>A Seller who is selling through online selling platforms, and has not registered his/her firm under Companies Act 2013</CardDescription>
                    </label>
                </Card>
                <Card className='px-10 py-4 flex hover:shadow-md hover:shadow-slate-200'>
                    <input type="radio" id="solo" name="businessType" value="solo" className='mr-8 accent-red-600 scale-125' />
                    <label htmlFor="solo" className="cursor-pointer">
                        <CardTitle>Sole Proprietor</CardTitle>
                        <CardDescription className='pt-3'>Registered company as &apos;Sole Proprietor&apos; under Companies Act 2013</CardDescription>
                    </label>
                </Card>
                <Card className='px-10 py-4 flex hover:shadow-md hover:shadow-slate-200'>
                    <input type="radio" id="company" name="businessType" value="company" className='mr-8 accent-red-600 scale-125' />
                    <label htmlFor="company" className="cursor-pointer">
                        <CardTitle>Company</CardTitle>
                        <CardDescription className='pt-3'>Registered company as &apos;LLP&apos;, &apos;Private&apos;, &apos;Subsidiary&apos;, &apos;Holding&apos;, etc. under Companies Act 2013</CardDescription>
                    </label>
                </Card>
            </div>
            <Button variant={'themeButton'} className='px-10 mt-6'>Next</Button>
        </div>
    )
}

const KycForm = () => {
    return (
        <div className='px-10 py-6'>
            <BusinessType />
        </div>
    )
}

export default KycForm