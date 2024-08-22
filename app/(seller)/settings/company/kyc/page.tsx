'use client'
import KycCompleted from '@/components/Settings/KycCompleted';
import KycStage from '@/components/Settings/KycStage';
import DocumentVerification from '@/components/Settings/document-verification';
import { KycBusinessTypeForm } from '@/components/Settings/kyc-business-type-form';
import PhotoIdentification from '@/components/Settings/photo-identification';
import { useKycProvider } from '@/components/providers/KycProvider';

function ActiveStepFormComponent() {
    const { step } = useKycProvider();

    switch (step) {
        case 1:
            return <KycBusinessTypeForm />;
        case 2:
            return <PhotoIdentification />
        case 3:
            return  <DocumentVerification />
        default:
            return <KycCompleted />
    }
}

const Kyc = () => {
    return (
        <>
            <KycStage  />
            <ActiveStepFormComponent />
        </>
    )
}

export default Kyc