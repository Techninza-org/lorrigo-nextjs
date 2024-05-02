'use client'
import { CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'
import AllRemittances from './all-remittances';
import TodayRemittances from './today-remittances';

const Remittances = () => {
    const [activeButton, setActiveButton] = useState<string>('all');
    return (
        <>
            <div className="flex gap-x-16 ml-6 mb-6 mt-4">
                {/* <CardTitle onClick={() => setActiveButton('todays')} className={activeButton === 'todays' ? 'text-[#be0c34] border-[#be0c34] border-b-2 cursor-pointer' : ' cursor-pointer'}>Today's COD</CardTitle> */}
                <CardTitle onClick={() => setActiveButton('all')} className={activeButton === 'all' ? 'text-[#be0c34] border-[#be0c34] border-b-2 cursor-pointer' : ' cursor-pointer'}>All COD report</CardTitle>
                <CardTitle onClick={() => setActiveButton('future')} className={activeButton === 'future' ? 'text-[#be0c34] border-[#be0c34] border-b-2 cursor-pointer' : ' cursor-pointer'}>Future COD</CardTitle>
            </div>
            {/* {activeButton === 'todays' && <TodayRemittances />} */}
            {activeButton === 'all' && <AllRemittances />}
            {/* {activeButton === 'future' && <FutureCOD />} */}
        </>
    )
}

export default Remittances