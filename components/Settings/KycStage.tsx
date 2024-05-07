'use client'
import React from 'react';
import { useKycProvider } from '../providers/KycProvider';
import { cn } from '@/lib/utils';

const KycStage = () => {
    const { step } = useKycProvider();

    return (
        <div className='flex justify-between w-full mt-2 mb-10'>
            <StageStep stepNumber={1} currentStep={step} label="Business Type" />
            <div className='border-b-2 border-black w-full h-0 mt-5'></div>
            <StageStep stepNumber={2} currentStep={step} label="Photo Identification" />
            <div className='border-b-2 border-black w-full h-0 mt-5'></div>
            <StageStep stepNumber={3} currentStep={step} label="Document Identification" />
        </div>
    );
};

const StageStep = ({ stepNumber, currentStep, label }: { stepNumber: number, currentStep: number, label: string }) => {
    const stepClass = cn(
        'rounded-full', 'grid', 'place-content-center', 'p-2', 'border-2', 'w-10', 'h-10',
        {
            'border-red-600': stepNumber === currentStep,
            'bg-red-600 text-white': stepNumber < currentStep,
            'bg-stone-300': stepNumber > currentStep
        }
    );

    return (
        <div>
            <div className='flex justify-center'>
                <p className={stepClass}>{stepNumber}</p>
            </div>
            <p className='w-max'>{label}</p>
        </div>
    );
};

export default KycStage;
