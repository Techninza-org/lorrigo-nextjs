'use client'
import { ColumnDef } from "@tanstack/react-table";
import { pickupAddressType } from "@/types/types";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import HoverCardToolTip from "../hover-card-tooltip";


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
        header: 'Contact Person',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.contactPersonName}</p>
                </div>
            )
        }
    },
    {
        header: 'Address',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <HoverCardToolTip label="Address" >
                    <p>{rowData.address1}</p>
                </HoverCardToolTip>
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
        header: 'Active',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <ToggleSwitch hub={rowData} />
            )
        }
    }
]

const ToggleSwitch = ({ hub }: { hub: pickupAddressType }) => {
    return (
        <div className="flex items-center space-x-2">
            <Switch
                className={"bg-red-500"}
                defaultChecked={hub.isActive}
                onCheckedChange={(checked) => console.log(checked, hub._id, "checked")}
                id="toggel-hub-active"
            />
        </div>
    )
}