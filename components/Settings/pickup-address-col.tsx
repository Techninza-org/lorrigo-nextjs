'use client'
import { ColumnDef } from "@tanstack/react-table";
import { pickupAddressType } from "@/types/types";
import { Switch } from "../ui/switch";
import HoverCardToolTip from "../hover-card-tooltip";
import { useHubProvider } from "../providers/HubProvider";
import { useEffect, useState } from "react";


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
        header: 'Phone',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>+{rowData.phone}</p>
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
        header: 'Primary',
        accessorKey: 'isPrimary',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <TogglePrimaryRadio hub={rowData} />
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
    const [checked, setChecked] = useState(hub.isActive)
    const { handleUpdateHub } = useHubProvider();
    const handleToggle = async (checked: boolean) => {
        try {
            const res = await handleUpdateHub(checked, hub._id)
            setChecked(res ? checked : !checked);

        } catch (error) {
            setChecked(!checked);
            console.log(error)
        }
    }
    return (
        <div className="flex items-center space-x-2">
            <Switch
                className={"bg-red-500"}
                checked={checked}
                onCheckedChange={(checked) => handleToggle(checked)}
                id="toggel-hub-active"
            />
        </div>
    )
}

const TogglePrimaryRadio = ({ hub }: { hub: pickupAddressType }) => {
    const [checked, setChecked] = useState(hub.isPrimary);
    const { handleUpdateHub } = useHubProvider();

    useEffect(() => {
        setChecked(hub.isPrimary); 
    }, [hub.isPrimary]);

    const handleToggle = async (isChecked: boolean) => {
        try {
            const res = await handleUpdateHub(hub.isActive, hub._id, isChecked);
            if (res) {
                setChecked(isChecked);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch
                key={hub._id}
                className={"bg-red-500"}
                checked={checked}
                onCheckedChange={(isChecked) => handleToggle(isChecked)}
                id={`toggle-hub-active-${hub._id}`}
            />
        </div>
    );
};


