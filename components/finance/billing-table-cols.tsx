"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";
import { formatCurrencyForIndia } from "@/lib/utils";
import HoverCardToolTip from "@/components/hover-card-tooltip";
import { InfoIcon, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { useSellerProvider } from "../providers/SellerProvider";
import { useAuth } from "../providers/AuthProvider";
import { useModal } from "@/hooks/use-model-store";
import { Button } from "../ui/button";


export const SellerBillingCols: ColumnDef<any>[] = [
    {
        header: 'Date',
        accessorKey: 'billingDate',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    {/* <div>{row.getValue("billingDate")}</div> */}
                    <p>{row.getValue("billingDate") ?  format(row.getValue("billingDate"), "dd-MM-yyyy") : null}</p>
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
        header: 'Order ID',
        accessorKey: 'orderRefId',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("orderRefId")}</p>
                </div>
            )
        }
    },
    {
        header: 'Shipment Type',
        accessorKey: 'shipmentType',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("shipmentType") ? "COD" : "Prepaid"}</p>
                </div>
            )
        }

    },
    {
        header: 'Carrier Name',
        accessorKey: 'vendorWNickName',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("vendorWNickName")}</p>
                </div>
            )
        }

    },
    {
        header: 'Applied Weight',
        accessorKey: 'orderWeight',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("orderWeight")}</p>
                </div>
            )
        }
    },
    {
        header: 'Charged Weight',
        accessorKey: 'chargedWeight',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("chargedWeight")} Kg</p>
                </div>
            )
        }
    },
    {
        header: 'Zone',
        accessorKey: 'zone',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("zone")}</p>
                </div>
            )
        }
    },
    {
        header: 'Applied Weight Charges',
        accessorKey: 'orderCharges',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{formatCurrencyForIndia(Number(row.getValue("orderCharges")))}</p>
                </div>
            )
        }
    },
    {
        header: 'Excess Charges',
        accessorKey: 'billingAmount',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{formatCurrencyForIndia(Number(row.getValue("billingAmount")))}</p>
                </div>
            )
        }
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("status")}</p>
                </div>
            )
        }
    },
    {
        header: 'Total Charge',
        accessorKey: 'billingAmount',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="items-center flex gap-1">
                    <p>{formatCurrencyForIndia((Number(row.getValue("billingAmount")) + Number(row.getValue("orderCharges"))) || 0)}</p>
                    <HoverCardToolTip Icon={<InfoIcon size={13} />} side="top" className="flex-col max-w-fit">
                        <div>Forward Charge: {rowData.isForwardApplicable ? rowData.rtoCharge : 0}</div>
                        <div>RTO Charge: {rowData.isRTOApplicable ? rowData.rtoCharge : 0}</div>
                        <div>COD Value: {rowData.codValue}</div>
                    </HoverCardToolTip>
                </div>
            )
        }
    },
    {
        header: 'Raise Dispute',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <RaiseDisputeButton awb={rowData.awb} />
            )
        }
    },
];

export const SellerB2BBillingCols: ColumnDef<B2COrderType>[] = [
    {
        header: 'Order ID',
        accessorKey: 'orderRefId',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("orderRefId")}</p>
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
        header: 'Weight',
        accessorKey: 'orderWeight',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("orderWeight")}kg</p>
                </div>
            )
        }
    },
    {
        header: 'ODA Applicable',
        accessorKey: 'isODAApplicable',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("isODAApplicable") || "False"}</p>
                </div>
            )
        }
    },
    {
        header: 'Other Charges',
        accessorKey: 'otherCharges',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{formatCurrencyForIndia(row.getValue("otherCharges") || 0)}</p>
                </div>
            )
        }
    },
    {
        header: 'Charged Amount',
        accessorKey: 'billingAmount',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{formatCurrencyForIndia(row.getValue("billingAmount") || 0)}</p>
                </div>
            )
        }
    },

];

const DisplaySellerName = () => {
    const { user } = useAuth();
    return (
        <div className="space-y-1 items-center">
            <p className="capitalize">{user?.name}</p>
        </div>
    )
}

const RaiseDisputeButton = ({ awb }: { awb: string }) => {
    const { onOpen } = useModal();
    return (
        <Button variant={'secondary'} size={'icon'} onClick={() => onOpen('raiseDisputeManage', { awb })}>
            <PencilIcon size={15} />
        </Button>
    )
}