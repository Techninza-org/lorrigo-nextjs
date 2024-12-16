"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, InfoIcon } from "lucide-react";

export const SellerDisputeColDefs: ColumnDef<any>[] = [
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
        cell: ({ row }) => {
            const rowData = row.original;
            console.log(rowData, "rowData");
            
            return (
                <DisputeDetailsButton details={rowData}/>
            )
        }
    },
    {
        header: 'Description',
        accessorKey: "stage",
        cell: ({ row }) => {

            const stage = row.getValue('stage');
            let desc = ''
            switch(stage){
                case 1: 
                    desc = "Raised"
                    break 
                case 2: 
                    desc = "Accepted"
                    break 
                case 3: 
                    desc = "Auto Accepted"
                    break 
                case 4: 
                    desc = "Not Accepeted"
                    break 
            }
            return (
                <div>{desc}</div>
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