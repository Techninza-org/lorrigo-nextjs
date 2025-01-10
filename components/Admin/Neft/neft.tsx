'use client';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/use-model-store';
import React from 'react'
import { NeftListingTable } from './neft-listing-table';
import { NeftListingCols } from './neft-listing-col';
import { useAdminProvider } from '@/components/providers/AdminProvider';

export default function Neft() {
    const { onOpen } = useModal();
    const { neft } = useAdminProvider();
    return (
        <>
            <div className='flex justify-end'>
                <Button
                    variant={"themeButton"}
                    onClick={() => onOpen("neftTransactionForm")}
                // className="flex items-center justify-center"
                >Add Payment</Button>
            </div>
            <NeftListingTable data={neft || []} columns={NeftListingCols} />
        </>
    )
}
