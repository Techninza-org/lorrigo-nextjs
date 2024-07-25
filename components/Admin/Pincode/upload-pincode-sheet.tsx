'use client'

import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { useModal } from '@/hooks/use-model-store'
import { Upload } from 'lucide-react'
import React from 'react'
import { Download } from "lucide-react";
import { handleFileDownload } from "@/lib/utils";

const UploadPincodes = () => {
    const { onOpen } = useModal()
    return (
        <Card>
            <CardTitle className='bg-[#be0c34] p-4 text-center text-white font-medium rounded-t-md'>
                Upload
            </CardTitle>
            <Button variant={'webPageBtn'}  className='m-3 space-x-2' size={'sm'} onClick={() => handleFileDownload("pincode-sample.csv")}>
              <span>Download Sample</span>  <Download size={18} />
            </Button>
            <div className='grid place-content-center'>
                <div className='border-2 border-dashed border-[#be0c34] rounded-lg px-20 h-[100px] m-10 grid place-content-center bg-[#F7F7F7] cursor-pointer' onClick={() => onOpen("BulkPincodeUpload")} >
                    <div className='flex justify-center mb-2'><Upload size={30} color='#be0c34' /></div>
                </div>
            </div>
        </Card>
    )
}

export default UploadPincodes
