import React from 'react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'


const BusinessType = () => {
    return (
        <div>
            <div className='grid gap-6'>
                <label htmlFor="individual">
                    <Card className='px-10 py-4 flex hover:shadow-md hover:shadow-slate-200'>
                        <input type="radio" id="individual" name="businessType" value="individual" className='mr-8 accent-red-600 scale-125' />
                        <div>
                            <CardTitle>Individual</CardTitle>
                            <CardDescription className='pt-3'>A Seller who is selling through online selling platforms, and has not registered his/her firm under Companies Act 2013</CardDescription>
                        </div>
                    </Card>
                </label>
                <label htmlFor="solo">
                    <Card className='px-10 py-4 flex hover:shadow-md hover:shadow-slate-200'>
                        <input type="radio" id="solo" name="businessType" value="solo" className='mr-8 accent-red-600 scale-125' />
                        <div>
                            <CardTitle>Solo Proprietor</CardTitle>
                            <CardDescription className='pt-3'>Registered company as 'Solo Proprietor' under Companies Act 2013</CardDescription>
                        </div>
                    </Card>
                </label>

                <label htmlFor="company">
                    <Card className='px-10 py-4 flex hover:shadow-md hover:shadow-slate-200'>
                        <input type="radio" id="company" name="businessType" value="company" className='mr-8 accent-red-600 scale-125' />
                        <div>
                            <CardTitle>Company</CardTitle>
                            <CardDescription className='pt-3'>Registered company as 'LLP', 'Private', 'Subsidiary', 'Holding', etc. under Companies Act 2013</CardDescription>
                        </div>
                    </Card>
                </label>

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