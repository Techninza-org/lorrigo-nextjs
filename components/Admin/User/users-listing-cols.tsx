"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { BadgeCheck, ImagesIcon, LayoutDashboard, SquarePen, Wrench } from "lucide-react";
import { formatDate } from "date-fns";
import HoverCardToolTip from "@/components/hover-card-tooltip";
import { useModal } from "@/hooks/use-model-store";
import { SellerType } from "@/types/types";
import { formatPhoneNumberIntl } from "react-phone-number-input";

export const AdminUsersListingCols: ColumnDef<SellerType>[] = [
    {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => {
            const rowData = row.original;
            const ICON_SIZE = 18;
            return (
                <div className="space-y-1 items-center">
                    <p className="flex gap-2">{rowData.name}
                        {
                            rowData.isVerified ? <div className="grid place-content-center ml-2">
                                <BadgeCheck size={ICON_SIZE} color="blue" />
                            </div>
                                :
                                null
                        }
                        {rowData?.kycDetails.submitted && <ViewSellerDocsBtn seller={rowData} />}

                    </p>
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
                    <p>{formatPhoneNumberIntl(`${rowData?.billingAddress?.phone}`)}</p>
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
                    <p>{rowData.companyProfile?.companyName || ""}</p>
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
                    <Link href={`/admin/users/courier-configure?sellerId=${sellerId}`}><Wrench /></Link>
                    <Link href={`/admin/users/edit-user?sellerId=${sellerId}`}><SquarePen /></Link>
                    <Link href={`/admin/orders?sellerId=${sellerId}`}><LayoutDashboard /></Link>
                </div>
            )
        }
    },
];

export const ViewSellerDocsBtn = ({ seller }: { seller: SellerType }) => {
    const { onOpen } = useModal()

    return (
        <ImagesIcon size={18} className="cursor-pointer" onClick={() => onOpen("ViewUserDocsAdmin", { seller })} />
    )
}