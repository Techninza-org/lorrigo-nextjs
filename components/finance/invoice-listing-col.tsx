"use client";

import Link from "next/link";
import InvoiceDetails from "../Admin/User/invoiceDetails";
import { cn } from "@/lib/utils";
import { usePaymentGateway } from "../providers/PaymentGatewayProvider";
import { Badge } from "../ui/badge";
import CsvDownloader from 'react-csv-downloader';
import { Button } from "../ui/button";
import { DownloadIcon } from "lucide-react";
import { useSellerProvider } from "../providers/SellerProvider";
import React, { useEffect } from "react";

export const InvoiceListingCols: any = [
    {
        header: 'Invoice Number',
        accessorKey: 'invoice_id',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <Link href={`/finance/invoice/${rowData._id}`}>
                        <p className="text-blue-500 hover:text-blue-700">{rowData.invoice_id}</p>
                    </Link>
                </div>
            )
        }
    },
    {
        header: 'Invoice Date',
        accessorKey: 'date',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.date}</p>
                </div>
            )
        }
    },
    {
        header: 'Invoice Amount',
        accessorKey: 'amount',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>&#8377; {rowData.amount}</p>
                </div>
            )
        }
    },
    {
        header: "Download",
        accessorKey: 'pdf',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center text-blue-500">
                    <InvoiceDetails pdf={rowData.pdf} />
                </div>
            )
        }
    },
    {
        header: "Pay Now",
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <PayNow row={rowData} />
            )
        }
    },
    {
        header: "AWB List",
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <DownloadCsv id={rowData._id} />
            )
        }
    },
];

const DownloadCsv = ({ id }: { id: any }) => {
    const { getInvoiceAwbTransactions } = useSellerProvider();
    const [datas, setDatas] = React.useState([]);
    const cols = [
        { id: "awb", displayName: "AWB" },
        { id: "forwardCharges", displayName: "Forward Charges" },
        { id: "rtoCharges", displayName: "RTO Charges" },
        { id: "codCharges", displayName: "COD Charges" },
        // { id: "excessCharges", displayName: "Excess Wt. Charges" },
        { id: "total", displayName: "Total" },
    ];

    function getData(): ReturnType<() => void> {
        getInvoiceAwbTransactions(id)
            .then((response: any) => {
                if (response) {
                    const formattedData = response.map((item: any) => ({
                        awb: String(item.awb),
                        forwardCharges: item.forwardCharges,
                        rtoCharges: item.rtoCharges,
                        codCharges: item.codCharges,
                        // excessCharges: item.excessCharges,
                        total: item.total,
                    }));
                    console.log(formattedData, 'formattedData');
                    
                    setDatas(formattedData);
                } else {
                    console.error("Invalid response format:", response);
                }
                
            })
            .catch((error: any) => {
                console.error("Error fetching AWB transactions:", error);
            });
    };

    useEffect(() => {
        getData()
        return () => getData()
    }, [])

    return (
        <div className="space-y-1 items-center text-blue-500">
            <CsvDownloader filename="AwbTransacs" datas={datas} columns={cols}>
                <Button variant={'webPageBtn'} size={'icon'} onClick={getData}>
                    <DownloadIcon size={18} />
                </Button>
            </CsvDownloader>
        </div>
    );
};

const PayNow = ({ row }: { row: any }) => {
    const { payInvoiceIntent } = usePaymentGateway();
    return (
        row?.status?.toLowerCase() === "paid" ? (
            <Badge variant={'secondary'} className="bg-green-100 tracking-wide text-green-500">Paid</Badge>
        ) :
            (
                <button
                    disabled={row?.isPrepaidInvoice}
                    onClick={() => payInvoiceIntent(row?.amount, row?._id)}
                    className={cn(
                        "space-y-1 items-center text-blue-500",
                        row?.isPrepaidInvoice && "hidden disabled:cursor-not-allowed"
                    )}
                >
                    Pay Now
                </button >
            )
    )
}

