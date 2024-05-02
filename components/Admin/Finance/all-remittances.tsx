import { useAdminProvider } from '@/components/providers/AdminProvider';
import React from 'react'
import { AdminRemittancesCols } from './admin-remittances-col';
import { RemittancesTableAdmin } from './admin-remittances-table';

const AllRemittances = () => {
    const { allRemittance } = useAdminProvider();
    
    return (<RemittancesTableAdmin data={ allRemittance || []} columns={AdminRemittancesCols} />);
}

export default AllRemittances