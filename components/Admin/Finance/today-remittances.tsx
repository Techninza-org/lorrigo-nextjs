import { useAdminProvider } from '@/components/providers/AdminProvider';
import React from 'react'
import { AdminRemittancesCols } from './admin-remittances-col';
import { RemittancesTableAdmin } from './admin-remittances-table';

const TodayRemittances = () => {
    const { allRemittance } = useAdminProvider();
    const todaysRemittances = allRemittance?.filter(remittance => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to 00:00:00

        const remittanceDate = new Date(remittance.remittanceDate);
        remittanceDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00
        console.log(remittanceDate.getTime(), today.getTime());
        return remittanceDate.getTime() === today.getTime();
    }) || [];
    return (<RemittancesTableAdmin data={ todaysRemittances || []} columns={AdminRemittancesCols} />);
}

export default TodayRemittances