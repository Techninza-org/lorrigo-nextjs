"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusTable } from "./order-status-table";
import { OrderStatusCol } from "./order-status-col";
import { useEffect } from "react";
import { useSellerProvider } from "../providers/SellerProvider";
import { useSearchParams } from "next/navigation";

export default function Orders() {

    const { getAllOrdersByStatus, orders } = useSellerProvider()

    const searchParams = useSearchParams()
    const status = searchParams.get("status")

    useEffect(() => {
        async function fetchData() {
            await getAllOrdersByStatus(status ? status : "all")
        }
        fetchData()
    }, [status])

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    View Shipment
                    <div className="md:flex space-y-3 md:space-y-0 md:space-x-3 mt-6 md:mt-0">
                        {/* <DatePickerWithRange date={date} setDate={()=>setDate} disabledDates={{ after: new Date() }} /> */}
                        {/* <form action={() => handleSendReport(tableData.data, date)}>
                            <SendReportButton />
                        </form> */}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <OrderStatusTable columns={OrderStatusCol} data={orders} />
            </CardContent>
        </Card>
    )
}
