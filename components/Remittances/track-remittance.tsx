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

import { useAuth } from "../providers/AuthProvider";
import { useSellerProvider } from "../providers/SellerProvider";
import { useEffect, useState } from "react";
import { RemittanceType } from "@/types/types";
import { Badge } from "../ui/badge";
import { formatDate } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CircleAlert, CircleCheck, NotepadTextDashed, PackageIcon, XCircle } from "lucide-react";
import { formatCurrencyForIndia } from "@/lib/utils";

const TrackRemittance = () => {
    const params = useParams()
    const [remittanceDetails, setRemittanceDetails] = useState<RemittanceType | null>(null)
    const { getSellerRemittanceDetails } = useSellerProvider()
    const { userToken } = useAuth()


    useEffect(() => {
        async function fetchRemittance() {
            const res = await getSellerRemittanceDetails(params.id.toString())
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
        return <div>Loading...</div>
    }

    const status = remittanceDetails.remittanceStatus;
    const statusText: "success" | "failure" | "warning" = status === 'success' ? 'success' : status === 'pending' ? 'warning' : 'failure';
    const StatusIcon = status === 'success' ? CircleCheck : status === 'pending' ? CircleAlert : XCircle;
    return (
        <>
            <div className="space-x-3 my-3">
                <Badge variant={statusText} className="capitalize">
                    {status}
                </Badge>
                <Badge variant={"secondary"}>
                    Processed on: {formatDate(`${remittanceDetails.remittanceDate}`, 'MMM dd, yyyy')}
                </Badge>
            </div>

            <Card className="col-span-4 max-w-2xl">
                <CardHeader className="p-3">
                    <CardTitle className="flex gap-3">
                        <NotepadTextDashed />
                        <span>Remittance Details</span>
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
                    <Table className="overflow-x-scroll overflow-y-scroll max-h-80">
                        <TableHeader>
                            <TableRow>
                                <TableHead>AWB Number</TableHead>
                                <TableHead>Amount Collected</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                remittanceDetails.orders.map((order, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{order.awb}</TableCell>
                                            <TableCell>{formatCurrencyForIndia(Number(order?.amount2Collect))}</TableCell>
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

export default TrackRemittance;

