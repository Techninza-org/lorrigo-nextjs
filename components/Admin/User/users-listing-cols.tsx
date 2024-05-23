"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { BadgeCheck, LayoutDashboard, SquarePen, Wrench } from "lucide-react";
import { formatDate } from "date-fns";
import HoverCardToolTip from "@/components/hover-card-tooltip";

export const AdminUsersListingCols: ColumnDef<any>[] = [
    {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p className="flex">{rowData.name}{rowData.isVerified ? <div className="grid place-content-center ml-2"><BadgeCheck size={16} color="blue" /></div> : ''}</p>
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
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.billingAddress?.phone}</p>
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
        header: 'Billing Address',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                rowData.billingAddress ?
                    <HoverCardToolTip label="Address" >
                        <p>{rowData.billingAddress?.address_line_1}, {rowData.billingAddress?.city}, {rowData.billingAddress?.state}, {rowData.billingAddress?.pincode} </p>
                    </HoverCardToolTip>
                    : ''
            )
        }
    },
    {
        header: 'Bank Details',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                rowData.bankDetails ?
                    <HoverCardToolTip label="Bank Details" >
                        <p><span className="font-semibold">Acc No -</span> {rowData.bankDetails.accNumber} </p>
                        <p><span className="font-semibold">Acc Type -</span> {rowData.bankDetails.accType} </p>
                        <p><span className="font-semibold">IFSC No -</span> {rowData.bankDetails.ifscNumber} </p>
                        <p><span className="font-semibold">Acc Holder -</span> {rowData.bankDetails.accHolderName} </p>
                    </HoverCardToolTip>
                    :
                    ''
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
                    {
                        rowData.createdAt ? <p>{formatDate(new Date(rowData.createdAt), 'dd/MM/yyyy')}</p> : <p>Not Available</p>
                    }
                </div>
            )
        }
    },
    {
        header: 'Action',
        cell: ({ row }) => {
            const rowData = row.original;
            const sellerId = rowData._id;
            return (
                <div className="flex gap-x-6 text-[#be0c34]">
                    <Link href={`/admin/users/courier-configure`}><Wrench /></Link>
                    <Link href={`/admin/users/edit-user?sellerId=${sellerId}`}><SquarePen /></Link>
                    <Link href={`/admin/orders?sellerId=${sellerId}`}><LayoutDashboard /></Link>
                </div>
            )
        }
    },
];