"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";

export const AdminVendorBillingCols: ColumnDef<B2COrderType>[] = [
    {
        header: 'AWB number',
        
    },
    {
        header: 'Order Create Date',
        
    },
    {
        header: 'Courier Partner',
        
    },
    {
        header: 'Weight',
        
    },
    {
        header: 'Volumetric Weight',
        
    },
    {
        header: 'Delivery Date',
        
    },
    {
        header: 'Freight Cost',
        
    },
];