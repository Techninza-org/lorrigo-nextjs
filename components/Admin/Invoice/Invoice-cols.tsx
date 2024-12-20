"use client";
import { useSellerProvider } from "@/components/providers/SellerProvider";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CsvDownloader from 'react-csv-downloader';

export const InvoiceCols: ColumnDef<any>[] = [
    {
        header: 'Date',
        accessorKey: 'date',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("date")}</p>
                </div>
            )
        }
    },
    {
        header: 'Invoice No.',
        accessorKey: 'invoice_id',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("invoice_id")}</p>
                </div>
            )
        }
    },
    {
        header: 'Client Name',
        accessorKey: 'sellerName',
        cell: ({ row }) => {
            const rowData = row.original;
            const sellerId = rowData.sellerId.name;
            return (
                <div className="space-y-1 items-center">
                    <p>{sellerId}</p>
                </div>
            )
        }
    },
    {
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("amount")}</p>
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
        header: "AWB List",
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <DownloadCsv id={rowData._id} />
            )
        }
    },
]


const DownloadCsv = ({ id }: { id: any }) => {
    const { getInvoiceAwbTransactions } = useSellerProvider();
    const [datas, setDatas] = useState([]);
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
                        awb: item.awb,
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
