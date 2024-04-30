"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";

export const AdminClientBillingCols: ColumnDef<B2COrderType>[] = [
    {
        header: 'Order ID',
        
    },
    {
        header: 'AWB number',
        
    },
    {
        header: 'Courier',
        
    },
    {
        header: 'Shipment Status',
        
    },
    {
        header: 'AWB Assigned Date',
        
    },
    {
        header: 'Applied Weight Charges (₹)',
        
    },
    {
        header: 'Excess Weight Charges (₹)',
        
    },
    {
        header: 'On Hold Amount (₹)',
        
    },
    {
        header: 'Total Freight Charges (₹)',
        
    },
    {
        header: 'Entered Weight & Dimensions',
        
    },
    {
        header: 'View Transaction Details',
        
    },
    {
        header: 'Status',
        
    },
];