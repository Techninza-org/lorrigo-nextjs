"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";
import Link from "next/link";
import { LayoutDashboard, SquarePen, Wrench } from "lucide-react";

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
        cell: ({ row }) => {
            // const rowData = row.original;
            return (
                <div>
                    <Link href={`#`}><Wrench /></Link>
                    <Link href={`#`}><SquarePen /></Link>
                    <Link href={`#`}><LayoutDashboard /></Link>
                </div>
            )
        }
    },
];