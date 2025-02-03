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
import React, { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-model-store";

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
        header: 'Due Amount',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>&#8377; {rowData.dueAmount}</p>
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
                // <PayNow row={rowData} />
                <PayNowButton row={rowData} />
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
    const [datas, setDatas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const cols = [
        { id: "awb", displayName: "AWB" },
        { id: "invoice_no", displayName: "Invoice No" },
        { id: "orderId", displayName: "Order ID" },
        { id: "zone", displayName: "Zone" },
        { id: "recipientName", displayName: "Recipient Name" },
        { id: "fromCity", displayName: "From City" },
        { id: "toCity", displayName: "To City" },
        { id: "createdAt", displayName: "Created At" },
        { id: "deliveredAt", displayName: "Delivered At" },
        { id: "forwardCharges", displayName: "Forward Charges" },
        { id: "rtoCharges", displayName: "RTO Charges" },
        { id: "codCharges", displayName: "COD Charges" },
        { id: "total", displayName: "Total" },
    ];

    const getData = async () => {
        setIsLoading(true);
        try {
            const response = await getInvoiceAwbTransactions(id);
            if (response) {
                const formattedData = response.map((item: any) => ({
                    invoice_no: id,
                    awb: item.awb,
                    forwardCharges: item.forwardCharges,
                    rtoCharges: item.rtoCharges,
                    codCharges: item.codCharges,
                    total: item.total,
                    zone: item.zone,
                    recipientName: item.recipientName,
                    fromCity: item.fromCity,
                    toCity: item.toCity,
                    orderId: item.orderId,
                    createdAt: item.createdAt,
                    deliveredAt: item.deliveredAt,
                }));
                setDatas(formattedData);
            } else {
                console.error("Invalid response format:", response);
            }
        } catch (error) {
            console.error("Error fetching AWB transactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    const handleDownload = async () => {
        await getData();
    };

    return (
        <div className="space-y-1 items-center text-blue-500">
            <CsvDownloader filename="AwbTransacs" datas={datas} columns={cols}>
                <Button variant={'webPageBtn'} size={'icon'} onClick={handleDownload} disabled={isLoading}>
                    <DownloadIcon size={18} />
                </Button>
            </CsvDownloader>
        </div>
    );
};
// const DownloadCsv = ({ id }: { id: any }) => {
//     const { getInvoiceAwbTransactions } = useSellerProvider();
//     console.log("id", id);
    
//     const [datas, setDatas] = React.useState([]);
//     const cols = [
//         { id: "awb", displayName: "AWB" },
//         { id: "invoice_no", displayName: "Invoice No" },
//         { id: "orderId", displayName: "Order ID" },
//         { id: "zone", displayName: "Zone" },
//         { id: "recipientName", displayName: "Recipient Name" },
//         { id: "fromCity", displayName: "From City" },
//         { id: "toCity", displayName: "To City" },
//         { id: "createdAt", displayName: "Created At" },
//         { id: "deliveredAt", displayName: "Delivered At" },
//         { id: "forwardCharges", displayName: "Forward Charges" },
//         { id: "rtoCharges", displayName: "RTO Charges" },
//         { id: "codCharges", displayName: "COD Charges" },
//         { id: "total", displayName: "Total" },
//     ];

//     function getData(): ReturnType<() => void> {
//         getInvoiceAwbTransactions(id)
//         .then((response: any) => {
//             if (response) {
//                 const formattedData = response.map((item: any) => ({
//                     invoice_no: id,
//                     awb: item.awb,
//                     forwardCharges: item.forwardCharges,
//                     rtoCharges: item.rtoCharges,
//                     codCharges: item.codCharges,
//                     total: item.total,
//                     zone: item.zone,
//                     recipientName: item.recipientName,
//                     fromCity: item.fromCity,
//                     toCity: item.toCity,
//                     orderId: item.orderId,
//                     createdAt: item.createdAt,
//                     deliveredAt: item.deliveredAt,
//                 }));

//                 setDatas(formattedData);
//             } else {
//                 console.error("Invalid response format:", response);
//             }

//         })
//         .catch((error: any) => {
//             console.error("Error fetching AWB transactions:", error);
//         });
//     };

//     useEffect(() => {
//         getData()
//         return () => getData()
//     }, [])

//     return (
//         <div className="space-y-1 items-center text-blue-500">
//             <CsvDownloader filename="AwbTransacs" datas={datas} columns={cols}>
//                 <Button variant={'webPageBtn'} size={'icon'} onClick={getData}>
//                     <DownloadIcon size={18} />
//                 </Button>
//             </CsvDownloader>
//         </div>
//     );
// };

const PayNowButton = ({ row }: { row: any }) => {
    const { onOpen } = useModal();
    return (
        row?.status?.toLowerCase() === "paid" ? (
            <Badge variant={'secondary'} className="bg-green-100 tracking-wide text-green-500">Paid</Badge>
        ) :
            (
                <button
                    disabled={row?.isPrepaidInvoice}
                    onClick={() => onOpen('payForInvoice', { invoicePaymentDetails: row })}
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

