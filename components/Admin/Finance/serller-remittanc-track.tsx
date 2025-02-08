"use client"
import { useParams } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useState } from "react";
import { RemittanceType } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { format, formatDate, parse } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CircleAlert, CircleCheck, DownloadIcon, NotepadTextDashed, PackageIcon, XCircle } from "lucide-react";
import { formatCurrencyForIndia } from "@/lib/utils";
import { LoadingComponent } from "@/components/loading-spinner";
import CsvDownloader from 'react-csv-downloader';
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TrackSellerRemittance = () => {
    const params = useParams()
    const [remittanceDetails, setRemittanceDetails] = useState<RemittanceType | null>(null)
    const { userToken } = useAuth()
    const { getSellerRemittanceID } = useAdminProvider()


    useEffect(() => {
        async function fetchRemittance() {
            const res = await getSellerRemittanceID(params.sellerId.toString(), params.remittanceId.toString())
            if (res) {
                setRemittanceDetails(res)
            }
        }
        fetchRemittance()
        return () => {
            setRemittanceDetails(null)
        }

    }, [userToken, params])

    if (!remittanceDetails) {
        return <LoadingComponent />
    }

    const status = remittanceDetails.remittanceStatus;
    const statusText: "success" | "failure" | "warning" = status === 'success' ? 'success' : status === 'pending' ? 'warning' : 'failure';
    const StatusIcon = status === 'success' ? CircleCheck : status === 'pending' ? CircleAlert : XCircle;

    const cols = [

        {
            id: "Remittance_no",
            displayName: "Remittance Number"
        },
        {
            id: "date",
            displayName: "Date"
        },
        {
            id: "txnId",
            displayName: "Bank Transaction ID"
        },
        {
            id: "Status",
            displayName: "Status"
        },
        {
            id: "awbs",
            displayName: "AWB"
        },

    ]

    const datas = {
        Remittance_no: remittanceDetails.remittanceId,
        awbs: remittanceDetails.orders.map((o: any) => `${o.awb}, ${o.amount2Collect}`).join(`\n${remittanceDetails.remittanceId},${remittanceDetails.remittanceDate},${remittanceDetails.BankTransactionId},${remittanceDetails.remittanceStatus},`),
        date: remittanceDetails.remittanceDate,
        txnId: remittanceDetails.BankTransactionId,
        Status: remittanceDetails.remittanceStatus,
    }
    return (
        <>
            <div className="space-x-3 my-3">
                <Badge variant={statusText} className="capitalize">
                    {status}
                </Badge>
                <Badge variant={"secondary"}>

                    {/* Processed on: {formatDate(parse(remittanceDetails.remittanceDate, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy')} */}
                    Processed on: {remittanceDetails.remittanceDate}
                </Badge>
            </div>

            <Card className="col-span-4 max-w-2xl">
                <CardHeader className="p-3">
                    <CardTitle className="flex justify-between gap-3">
                        <div className="flex gap-3">
                            <NotepadTextDashed />
                            <span>Remittance Details</span>
                        </div>
                        <CsvDownloader filename="remittance-report" datas={[datas]} columns={cols}>
                            <Button variant={'webPageBtn'} size={'sm'}><DownloadIcon size={16} className="mr-3" /> Download Report</Button>
                        </CsvDownloader>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pl-2 space-y-6">
                    <div className="flex justify-center py-4 items-center gap-2">
                        <StatusIcon size={60} strokeWidth={1.2} />
                        <div className="flex flex-col">
                            <span>Remittance Amount</span>
                            <span className="text-4xl">{formatCurrencyForIndia(remittanceDetails.remittanceAmount)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center">
                        <PackageIcon size={24} />
                        <span className="text-xl font-bold">AWB Numbers</span>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>AWB Number</TableHead>
                                <TableHead>Amount Collected</TableHead>
                                <TableHead>Deliverd At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                remittanceDetails.orders.map((order, index) => {
                                    const length = order?.orderStages?.length
                                    //@ts-ignore
                                    const date = order?.orderStages[length - 1]?.stageDateTime
                                    // const formattedDate = formatDate(date, 'dd-MM-yyyy')
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Link
                                                    className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center"
                                                    href={`/track/${order.awb}`}>
                                                    {order.awb}
                                                </Link>
                                            </TableCell>
                                            
                                            <TableCell>{formatCurrencyForIndia(Number(order?.amount2Collect))}</TableCell>
                                            <TableCell>
                                                {date && format(date || new Date(), 'dd/MM/yyyy')}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })

                            }
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </>
    );
}

export default TrackSellerRemittance;

