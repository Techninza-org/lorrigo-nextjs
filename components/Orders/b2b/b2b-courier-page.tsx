"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrencyForIndia, getSvg, removeWhitespaceAndLowercase } from "@/lib/utils"
import { useParams } from "next/navigation"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useSellerProvider } from "@/components/providers/SellerProvider"
import { useEffect, useState } from "react"
import { useAuth } from "../../providers/AuthProvider"
import { useFormStatus } from "react-dom";
import { LoadingComponent } from "../../loading-spinner"
import { OrderType } from "@/types/types"

export const dynamic = 'force-dynamic'

export default function B2BCourierPage() {
    const params = useParams()
    const { getB2bCourierPartners , handleCreateB2BShipment } = useSellerProvider()
    const { userToken } = useAuth()
    const { pending } = useFormStatus();

    const [courierPartners, setCourierPartners] = useState<any>()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchCourierPartners() {
            const res = await getB2bCourierPartners(String(params.id))
            setCourierPartners(res)
        }
        fetchCourierPartners()
        return () => {
            setCourierPartners(undefined)
        }
    }, [userToken, params.id])

    useEffect(() => {
        console.log(courierPartners, "courierPartners");
        
    }, [courierPartners])

    if (!courierPartners) {
        return <LoadingComponent />
    }


    return (
        <>
            {loading && <LoadingComponent />}
            <div className="grid gap-3">
                <Card className="drop-shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            B2B Order Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                            <p className="text-sm font-semibold">Order Reference ID</p>
                            <p className="text-sm text-blue-700 underline-offset-4 underline">{courierPartners?.orderDetails.order_reference_id}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Pickup From</p>
                            <p className="text-sm">{courierPartners.orderDetails?.pickupAddress?.pincode}, {courierPartners.orderDetails?.pickupAddress.state ?? ""}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Deliver To</p>
                            <p className="text-sm"> {courierPartners.orderDetails?.customer?.pincode}, {courierPartners.orderDetails?.customer?.city ?? ""}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Order Value</p>
                            <p className="text-sm"> {formatCurrencyForIndia(Number(courierPartners.orderDetails?.amount))}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Payment Mode</p>
                            <Badge variant={"success"}>{"Prepaid"}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Approximate Weight (kg)</p>
                            <p className="text-sm">{courierPartners.orderDetails?.orderWeight} {courierPartners.orderDetails?.total_weight}</p>
                        </div>

                    </CardContent>
                </Card>
            </div>

            <div className="col-span-2">
                <div className="grid gap-3">
                    <Card className="drop-shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>
                                Select Courier Partner
                            </CardTitle>

                        </CardHeader>
                        <CardContent className="flex items-center justify-between gap-1">
                            <Table>
                                <TableCaption>A list of our Courier Partners</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="">Courier Partner</TableHead>
                                        <TableHead>Expected Pickup</TableHead>
                                        <TableHead>Zone</TableHead>
                                        <TableHead>Charges</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody >
                                    {
                                        courierPartners?.couriers?.map((partner: any, i: any) => {

                                            return <TableRow key={i}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Image className="mr-2 mix-blend-multiply"
                                                            src={getSvg(removeWhitespaceAndLowercase(partner.name))}
                                                            width={60} height={60} alt="logo" />
                                                        {partner.name}
                                                        <span className="text-slate-500 mx-1">({partner.nickName})</span> | Min. weight: {partner.minWeight}kg
                                                    </div>
                                                    <div>RTO Charges : {formatCurrencyForIndia(partner.charge)}</div>
                                                </TableCell>
                                                <TableCell>{partner.expectedPickup}</TableCell>
                                                <TableCell>{partner.order_zone}</TableCell>
                                                <TableCell>{formatCurrencyForIndia(partner.charge)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button disabled={pending} type="submit" variant={"themeButton"} size={"sm"} onClick={async () => {
                                                        setLoading(true)
                                                        try {
                                                            const res = await handleCreateB2BShipment({
                                                                orderId: courierPartners.orderDetails._id,
                                                                carrierId: partner.carrierID,
                                                            })
                                                        } finally {
                                                            setLoading(false)
                                                        }
                                                    }}>Ship now</Button>
                                                </TableCell>
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )

}