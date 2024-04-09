"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";

export const AdminUsersListingCols: ColumnDef<B2COrderType>[] = [
    {
        header: 'Id',
        
    },
    {
        header: 'Email',
        
    },
    {
        header: 'Name',
        
    },
    {
        header: 'Phone',
        
    },
    {
        header: 'Company Name',
        
    },
    {
        header: 'Creation Date',
        
    },
    {
        header: 'Action',
        
    },
];