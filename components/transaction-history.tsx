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
import { cn, formatCurrencyForIndia } from "@/lib/utils"
import { PaymentTransaction } from "@/types/types"
import { useEffect, useState } from "react"
import { usePaymentGateway } from "./providers/PaymentGatewayProvider";
import { useAxios } from "./providers/AxiosProvider";
import { format } from "date-fns";
import Link from "next/link";
import { CircleAlertIcon, CircleX, MoveDownLeft, MoveUpRightIcon, RotateCwIcon } from "lucide-react";
import { Input } from "./ui/input";
import { buttonVariants } from "./ui/button";
import HoverCardToolTip from "./hover-card-tooltip";


const iconMap: { [key: string]: { component: any; color: string } } = {
    "PAYMENT_INITIATED": {
        component: CircleX,
        color: "text-red-500",
    },
    "PAYMENT_SUCCESS": {
        component: MoveDownLeft,
        color: "text-green-600",
    },
    "PAYMENT_PENDING": {
        component: CircleAlertIcon,
        color: "text-yellow-600",
    },
    "PAYMENT_ERROR": {
        component: CircleX,
        color: "text-red-600",
    },
    "CREDIT": {
        component: MoveDownLeft,
        color: "text-green-600",
    },
    "DEBIT": {
        component: MoveUpRightIcon,
        color: "text-red-600",
    },
    // Add more mappings here as needed
};

export const IconComponent = ({ item }: { item: any }) => {
    const { component: Icon, color } = iconMap[item.code] || {};
    return Icon ? <Icon size={18} className={color} /> : null;
};

export const TransactionsHistory = () => {
    const { getAllTransactions, refetchLast5txn, walletBalance } = usePaymentGateway();
    const { axiosIWAuth } = useAxios();
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchTransactions() {
            const response = await getAllTransactions();
            setTransactions(response ?? []);
        }
        fetchTransactions();

        return () => {
            setTransactions([]);
        }
    }, [axiosIWAuth]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredTransactions = transactions?.filter((transaction) => {
        const { merchantTransactionId, stage, desc, amount } = transaction;
        const lastStage = stage[stage.length - 1];
        const { action } = lastStage;

        return (
            merchantTransactionId?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            formatCurrencyForIndia(Number(amount))?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
    });



    return (
        <Card>
            <CardHeader>
                <CardTitle>View Transaction</CardTitle>
                <CardDescription>Recent Transaction on Your Account!</CardDescription>
                <span>Wallet Balance: {formatCurrencyForIndia(walletBalance || 0)}</span>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between">
                    <Input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="max-w-xs rounded"
                    />
                    <div onClick={async () => {
                        setLoading(true);
                        const response = await refetchLast5txn();
                        setLoading(false);
                        setTransactions(response ?? []);
                    }}>

                        <HoverCardToolTip
                            side="top"
                            triggerClassName={cn("gap-2", buttonVariants({
                                variant: "outline",
                            }))}
                            Icon={<RotateCwIcon size={18} className={cn(loading && "animate-spin")} />}
                            className="text-gray-600 text-sm rounded-lg max-w-52 p-3" align="center"
                        >
                            <div className="text-center">
                                If your amount is debited and not credited, please click here to refresh the last 5 transaction or If the issue persists, please contact our support team.
                            </div>
                        </HoverCardToolTip>
                    </div>

                </div>
                <Table className="text-center">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center"></TableHead>
                            <TableHead className="text-center">Id</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Description</TableHead>
                            <TableHead className="text-center">Amount</TableHead>
                            <TableHead className="text-center">Previous Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions?.length > 0 ? filteredTransactions?.map((item) => {
                            const stage = item?.stage[item?.stage?.length - 1];
                            const { action, dateTime } = stage;
                            const status: any = ["Completed", "PAYMENT_SUCCESSFUL"].includes(action) ? "success" : "destructive";
                            return (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">
                                        <IconComponent item={item} />
                                    </TableCell>
                                    <TableCell className="font-medium">PID-{item?.merchantTransactionId}</TableCell>
                                    <TableCell>
                                        <div>
                                            <Badge className="font-normal" variant={status}>{action}</Badge>
                                        </div>
                                        <div>
                                            {format(new Date(dateTime), 'dd-MM-yyyy hh:mm:ss a')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="underline underline-offset-4 text-center text-base text-blue-800">
                                        <Link className="text-center" href={`/track/${item?.desc?.split(" ")[1]?.replace(/,$/, "")}` || "#"}>{item?.desc}</Link>
                                    </TableCell>
                                    <TableCell>{formatCurrencyForIndia(Number(item?.amount) ?? 0)}</TableCell>
                                    <TableCell>{isNaN(Number(item?.lastWalletBalance)) ? "" : formatCurrencyForIndia((Number(item?.lastWalletBalance)))}</TableCell>

                                </TableRow>
                            )
                        }) :
                            <TableRow>
                                <TableCell colSpan={5}>No Transaction Record found.</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
