"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { LayoutDashboard, SquarePen, Wrench } from "lucide-react";
import { formatDate } from "date-fns";

export const AdminUsersListingCols: ColumnDef<any>[] = [
    {
        header: 'Id',
        accessorKey: '_id',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData._id}</p>
                </div>
            )
        }

    },
    {
        header: 'Email',
        accessorKey: 'email',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.email}</p>
                </div>
            )
        }

    },
    {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.name}</p>
                </div>
            )
        }

    },
    {
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.phone}</p>
                </div>
            )
        }
    },
    {
        header: 'Company Name',
        accessorKey: 'companyName',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.companyProfile?.companyName}</p>
                </div>
            )
        }

    },
    {
        header: 'Creation Date',
        accessorKey: 'createdAt',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{formatDate(`${rowData.createdAt}`, 'MMM dd, yyyy')}</p>
                </div>
            )
        }

    },
    {
        header: 'Action',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="flex gap-x-6 text-[#be0c34]">
                    <Link href={`#`}><Wrench /></Link>
                    <Link href={`#`}><SquarePen /></Link>
                    <Link href={`#`}><LayoutDashboard /></Link>
                </div>
            )
        }
    },
];