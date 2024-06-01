"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ActionTooltip from "../action-tooltip"
import { Activity, IndianRupee, NotebookText, Package } from "lucide-react"
import { Label } from "../ui/label"
import { useSellerProvider } from "../providers/SellerProvider"
import { formatCurrencyForIndia } from "@/lib/utils"

export const DataAnalysis = () => {
    const {sellerDashboard}  = useSellerProvider()
    return (
        <div className="grid grid-cols-3 gap-3">
            <div className="max-w-[27rem] grid grid-rows-3 gap-3">
                <Card className="drop-shadow-md h-32">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
                    </CardHeader>
                    <CardContent className="flex items-center">
                        <div className="mr-4">
                            <NotebookText size={35} strokeWidth={1.25} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 ">
                            <div>Today&apos;s Orders:</div>
                            <div>{sellerDashboard?.todayYesterdayAnalysis?.todayOrdersCount}</div>
                            <div>Yesterday&apos;s Orders:</div>
                            <div>{sellerDashboard?.todayYesterdayAnalysis?.yesterdayOrdersCount}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="drop-shadow-md bg-[#dbf0df]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
                    </CardHeader>
                    <CardContent className="flex items-center">
                        <div className="mr-4">
                            <IndianRupee size={35} strokeWidth={1.25} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 ">
                            <div>Today&apos;s Revenue:</div>
                            <div>{formatCurrencyForIndia(sellerDashboard?.todayYesterdayAnalysis?.todayRevenue || 0)}</div>
                            <div>Yesterday&apos;s Revenue:</div>
                            <div>{formatCurrencyForIndia(sellerDashboard?.todayYesterdayAnalysis?.yesterdayRevenue || 0)}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* <Card className="drop-shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
                    </CardHeader>
                    <CardContent className="flex items-center">
                        <div className="mr-4">
                            <Package size={35} strokeWidth={1.25} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 ">
                            <div>Average Shipping:</div>
                            <div>{formatCurrencyForIndia(sellerDashboard?.todayYesterdayAnalysis?.todayAverageShippingCost)}</div>
                        </div>
                    </CardContent>
                </Card> */}
            </div>

            <div className="col-span-2">
                <div className="grid grid-rows-3 gap-3">
                    <Card className="drop-shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
                            <CardTitle className="text-lg font-medium">
                                Shipment Details
                            </CardTitle>
                            <ActionTooltip label="Last 30 days">
                                <Activity size={20} />
                            </ActionTooltip>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between gap-1">
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                                <span className="p-3">{sellerDashboard?.shipmentDetails?.totalShipments?.length}</span>
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
                    <Card className="drop-shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
                            <CardTitle className="text-lg font-medium">
                                NDR Details
                            </CardTitle>
                            <ActionTooltip label="Last 30 days">
                                <Activity size={20} />
                            </ActionTooltip>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between gap-1 w-full">
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                            <span className="p-3">{sellerDashboard?.NDRDetails?.TotalNRD}</span>
                                <Label>Total NDR</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                            <span className="p-3">{sellerDashboard?.NDRDetails?.buyerReattempt}</span>
                                <Label>Your reattempt request</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                            <span className="p-3">{sellerDashboard?.NDRDetails?.delivered || 0}</span>
                                <Label>NDR Delivered</Label>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="drop-shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
                            <CardTitle className="text-lg font-medium">
                            COD Status
                            </CardTitle>
                            <ActionTooltip label="Last 30 days">
                                <Activity size={20} />
                            </ActionTooltip>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between gap-1 w-full">
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                            <span className="p-3">{sellerDashboard?.CODDetails?.totalCODLast30Days || 0}</span>
                                <Label>Total COD (Last 30 Days)</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                            <span className="p-3">{sellerDashboard?.CODDetails?.CODAvailable || 0}</span>
                                <Label>Cod Available</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                                <span className="p-3">00</span>
                                <Label>COD Pending (Greater than 8 days)</Label>
                            </div>
                            <div className="flex flex-col justify-center shadow-md pb-2 items-center px-3">
                                <span className="p-3">00</span>
                                <Label>Last COD Remitted</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}