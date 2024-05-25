'use client'
import React, { useState } from 'react'
import { CardTitle } from '@/components/ui/card'
import { useAdminProvider } from '@/components/providers/AdminProvider';
import { RemittancesTableAdmin } from './admin-remittances-table';
import { AdminRemittancesCols } from './admin-remittances-col';

const Remittances = () => {
    const [activeButton, setActiveButton] = useState<string>('all');
    const { allRemittance, futureRemittance } = useAdminProvider();

    return (
        <>
            <div className="flex gap-x-16 ml-6 mb-6 mt-4">
                <CardTitle onClick={() => setActiveButton('all')} className={activeButton === 'all' ? 'text-[#be0c34] border-[#be0c34] border-b-2 cursor-pointer' : ' cursor-pointer'}>All COD report</CardTitle>
                <CardTitle onClick={() => setActiveButton('future')} className={activeButton === 'future' ? 'text-[#be0c34] border-[#be0c34] border-b-2 cursor-pointer' : ' cursor-pointer'}>Future COD</CardTitle>
            </div>
             <RemittancesTableAdmin data={(activeButton === 'all' ? allRemittance : futureRemittance) || []} columns={AdminRemittancesCols} />
        </>
    )
}

export default Remittances