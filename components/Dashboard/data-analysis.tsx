"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ActionTooltip from "../action-tooltip"
import { Activity, IndianRupee, NotebookText } from "lucide-react"
import { Label } from "../ui/label"
import { useSellerProvider } from "../providers/SellerProvider"
import { formatCurrencyForIndia } from "@/lib/utils"

export const DataAnalysis = () => {
    const { sellerDashboard } = useSellerProvider()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="max-w-full lg:max-w-[27rem] grid grid-rows-2 md:grid-rows-3 gap-3">
                <Card className="drop-shadow-md h-32">
                    <CardHeader className="flex flex-row items-center justify-between py-2">
                    </CardHeader>
                    <CardContent className="flex items-center">
                        <div className="mr-4">
                            <NotebookText size={35} strokeWidth={1.25} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-2">
                            <div>Today&apos;s Orders:</div>
                            <div>{sellerDashboard?.todayYesterdayAnalysis?.todayOrdersCount}</div>
                            <div>Yesterday&apos;s Orders:</div>
                            <div>{sellerDashboard?.todayYesterdayAnalysis?.yesterdayOrdersCount}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="drop-shadow-md bg-[#dbf0df]">
                    <CardHeader className="flex flex-row items-center justify-between py-2">
                    </CardHeader>
                    <CardContent className="flex items-center">
                        <div className="mr-4">
                            <IndianRupee size={35} strokeWidth={1.25} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-2">
                            <div>Today&apos;s Revenue:</div>
                            <div>{formatCurrencyForIndia(sellerDashboard?.todayYesterdayAnalysis?.todayRevenue || 0)}</div>
                            <div>Yesterday&apos;s Revenue:</div>
                            <div>{formatCurrencyForIndia(sellerDashboard?.todayYesterdayAnalysis?.yesterdayRevenue || 0)}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="col-span-1 lg:col-span-2">
                <div className="grid grid-rows-1 mb-10 gap-3">
                    <Card className="drop-shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between py-1">
                            <CardTitle className="text-lg font-medium">
                                Shipment Details
                            </CardTitle>
                            <ActionTooltip label="Last 30 days">
                                <Activity size={20} />
                            </ActionTooltip>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 justify-between">
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                                <span className="p-3">{sellerDashboard?.shipmentDetails?.totalShipments}</span>
                                <Label>Total Shipments</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                                <span className="p-3">{sellerDashboard?.shipmentDetails?.pickupPending}</span>
                                <Label>Pickup Pending</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                                <span className="p-3">{sellerDashboard?.shipmentDetails?.inTransit}</span>
                                <Label>In-Transit</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                                <span className="p-3">{sellerDashboard?.shipmentDetails?.delivered}</span>
                                <Label>Delivered</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                                <span className="p-3">00</span>
                                <Label>NDR Pending</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                                <span className="p-3">00</span>
                                <Label>RTO</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
