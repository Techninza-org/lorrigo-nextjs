"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusTable } from "./order-status-table";
import { OrderStatusCol } from "./order-status-col";
import { useSellerProvider } from "../providers/SellerProvider";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { BoxIcon } from "lucide-react";

export default function Orders() {
    const { orders } = useSellerProvider()

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between">
                    <div className="mb-4 sm:mb-0">
                        View Shipment
                    </div>
                    <Link href="/new/b2c" className={cn(buttonVariants({
                        variant: "themeNavActiveBtn",
                        size: "sm",
                    }), "gap-1")}>
                        <BoxIcon size={18} /> Create Forward Shipment
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <OrderStatusTable columns={OrderStatusCol} data={orders || []} />
            </CardContent>
        </Card>
    )
}
