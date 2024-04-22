'use client'
import React from 'react'
import { useKycProvider } from '../providers/KycProvider';

const KycStage = () => {
    const { step } = useKycProvider();

    return (
        <div className='flex justify-between w-full mt-2 mb-10'>
            <div>
                <div className='flex justify-center'>
                    <p className={` rounded-full grid place-content-center p-2 border-2 w-10 h-10 ${step === 1 ? 'border-red-600' : ''} ${step > 1 ? 'bg-red-600 text-white' : "bg-stone-300"}`}>1</p>
                </div>
                <p className='w-max'>Business Type</p>
            </div>
            <div className='border-b-2 border-black w-full h-0 mt-5'></div>
            <div>
                <div className='flex justify-center'>
                    <p className={`rounded-full grid place-content-center p-2 border-2 w-10 h-10 ${step === 2 ? 'border-red-600' : ''} ${step > 2 ? 'bg-red-600 text-white' : "bg-stone-300"}`}>2</p>
                </div>
                <p className='w-max'>Photo Identification</p>
            </div>
            <div className='border-b-2 border-black w-full h-0 mt-5'></div>
            <div>
                <div className='flex justify-center'>
                    <p className={`rounded-full grid place-content-center p-2 border-2 w-10 h-10 ${step === 3 ? 'border-red-600' : ''} ${step > 3 ? 'bg-red-600 text-white' : "bg-stone-300"}`}>3</p>
                </div>
                <p className='w-max'>Document Identification</p>
            </div>
        </div>
    )
}

export default KycStage