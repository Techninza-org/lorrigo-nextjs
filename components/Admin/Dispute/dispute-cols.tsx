"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, InfoIcon } from "lucide-react";

export const AdminDisputeColDefs: ColumnDef<any>[] = [
    {
        header: 'Client Name',
        accessorKey: 'sellerId',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">

                    <p>
                        {
                            // @ts-ignore
                            rowData?.sellerId?.name || "N/A"
                        }
                    </p>
                </div>
            )
        }
    },
    {
        header: 'AWB number',
        accessorKey: 'awb',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("awb")}</p>
                </div>
            )
        }
    },
    {
        header: 'View Details',
        accessorKey: 'awb',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <DisputeDetailsButton details={rowData} />
            )
        }
    },
];

const DisputeDetailsButton = ({ details }: { details: any }) => {
    const { onOpen } = useModal();
    return (
        <Button variant={'secondary'} size={'icon'} onClick={() => onOpen('disputeDetails', { details })}>
            <EyeIcon size={15} />
        </Button>
    )
}