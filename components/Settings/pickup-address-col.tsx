'use client'
import { ColumnDef } from "@tanstack/react-table";
import { pickupAddressType } from "@/types/types";


export const PickupAddressCol: ColumnDef<pickupAddressType>[] = [
    {
        header: 'Facility Name',
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
        header: 'Location',
        accessorKey: 'location',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.city}, {rowData.state}, {rowData.pincode}</p>
                </div>
            )
        }
    },
    {
        header: 'Edit',
        accessorKey: 'edit',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    Action
                </div>
            )
        }
    }
]