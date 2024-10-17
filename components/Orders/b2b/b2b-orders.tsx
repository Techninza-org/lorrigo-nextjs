"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSellerProvider } from "../../providers/SellerProvider";
import { B2BOrderStatusTable } from "./b2b-order-status-table";
import { B2BOrderStatusCol } from "./b2b-order-status-col";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BoxIcon } from "lucide-react";

export default function B2BOrders() {

    const { b2bOrders } = useSellerProvider()

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between">
                    <div className="mb-4 sm:mb-0">
                        View B2B Shipment
                    </div>
                    <Link href="/new/b2b" className={cn(buttonVariants({
                        variant: "themeNavActiveBtn",
                        size: "sm",
                    }), "gap-1")}>
                        <BoxIcon size={18} /> Create B2B Shipment
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <B2BOrderStatusTable columns={B2BOrderStatusCol} data={b2bOrders} />
            </CardContent>
        </Card>
    )
}
