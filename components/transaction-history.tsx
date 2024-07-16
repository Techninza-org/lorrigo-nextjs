"use client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { formatCurrencyForIndia } from "@/lib/utils"
import { PaymentTransaction } from "@/types/types"
import { useEffect, useState } from "react"
import { usePaymentGateway } from "./providers/PaymentGatewayProvider";
import { useAxios } from "./providers/AxiosProvider";
import { formatDate } from "date-fns";
import Link from "next/link";
import { MoveDownLeft, MoveUpRightIcon } from "lucide-react";



export const TransactionsHistory = () => {
    const { getAllTransactions } = usePaymentGateway();
    const { axiosIWAuth } = useAxios();
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([])

    useEffect(() => {
        async function fetchTransactions() {
            const response = await getAllTransactions();
            console.log(response, "response")
            setTransactions(response ?? []);
        }
        fetchTransactions();

        return () => {
            setTransactions([]);
        }
    }, [axiosIWAuth])

    return (

        <Card>
            <CardHeader>
                <CardTitle>View Transaction</CardTitle>
                <CardDescription>Recent Transaction on Your Account!</CardDescription>
            </CardHeader>
            <CardContent>
                <Table className="text-center">
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow >
                            <TableHead className="text-center"></TableHead>
                            <TableHead className="text-center">Id</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Description</TableHead>
                            <TableHead className="text-center">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length > 0 ? transactions.map((item) => {
                            const stage = item.stage[item.stage.length - 1];
                            const { action, dateTime } = stage;
                            const status: any = stage.action === "Completed" ? "success" : "pending";
                            return (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">
                                    {
                                            item.code === "DEBIT" ? <MoveUpRightIcon size={18} className="text-red-500" /> : <MoveDownLeft className="text-green-600" size={18} />   
                                        }
                                    </TableCell>
                                    <TableCell className="font-medium">PID-{item.merchantTransactionId}</TableCell>
                                    <TableCell>
                                        <div>
                                            <Badge variant={status}>{action}</Badge>
                                        </div>
                                        <div>
                                            {formatDate(dateTime, 'dd-MM-yyyy hh:mm:ss a')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="underline underline-offset-4 text-center text-base text-blue-800">
                                        <Link className="text-center" href={`/track/${item?.desc?.split(" ")[1]?.replace(/,$/, "")}` || "#"}>{item?.desc}</Link>
                                    </TableCell>
                                    <TableCell>{formatCurrencyForIndia(Number(item.amount) ?? 0)}</TableCell>
                                </TableRow>
                            )
                        }) :
                            <TableRow>
                                <TableCell colSpan={3}>No Transaction Record found.</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}