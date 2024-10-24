"use client";
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { useState } from "react";

const Delete = ({ id }: { id: string }) => { 
    const { handleDeleteSubadmin } = useAdminProvider();

    return (
        <div className="space-y-1 items-center">
            <Button variant={'secondary'} size={'icon'} onClick={() => handleDeleteSubadmin(id)}>
                <Trash size={18} color="red" />
            </Button>
        </div>
    );
};

const ToggleSwitch = ({ dept, path }: { dept: any; path: string }) => {
    const [checked, setChecked] = useState(dept.subadminpaths.includes(path));
    const { handleUpdateSubadminPaths } = useAdminProvider();

    const handleToggle = async (checked: boolean) => {
        try {
            let updatedPaths = checked
                ? [...dept.subadminpaths, path]
                : dept.subadminpaths.filter((p: string) => p !== path);

            const res = await handleUpdateSubadminPaths(dept._id, updatedPaths);
            setChecked(res ? checked : !checked);
        } catch (error) {
            setChecked(!checked);
            console.error(error);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch
                className="bg-red-500"
                checked={checked}
                onCheckedChange={handleToggle}
                id={`toggle-${path}-active`}
            />
        </div>
    );
};

// Column definitions for the listing
export const ListingCols: ColumnDef<any>[] = [
    {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p className="flex gap-2">{rowData.name}</p>
                </div>
            );
        }
    },
    {
        header: 'Pincodes',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <ToggleSwitch dept={rowData} path="pincodes" />
                </div>
            );
        }
    },
    {
        header: 'Users',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <ToggleSwitch dept={rowData} path="users" />
                </div>
            );
        }
    },
    {
        header: 'Remittance',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <ToggleSwitch dept={rowData} path="finance/remittance" />
                </div>
            );
        }
    },
    {
        header: 'Vendor Billing',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <ToggleSwitch dept={rowData} path="finance/vendor-billing" />
                </div>
            );
        }
    },
    {
        header: 'Client Billing',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <ToggleSwitch dept={rowData} path="finance/client-billing" />
                </div>
            );
        }
    },
    {
        header: 'Manual Deduction',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <ToggleSwitch dept={rowData} path="finance/manual-deduction" />
                </div>
            );
        }
    },
    {
        header: 'Action',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <Delete id={rowData._id} />
            );
        }
    }
];
