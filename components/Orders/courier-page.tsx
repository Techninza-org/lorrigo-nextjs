"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useAuth } from "../providers/AuthProvider"
import { useFormStatus } from "react-dom";
import { LoadingComponent } from "../loading-spinner"
import { OrderType } from "@/types/types"

export const dynamic = 'force-dynamic'

export default function CourierPage() {
    const params = useParams()
    const { getCourierPartners, handleCreateD2CShipment, handleCreateB2BShipment } = useSellerProvider()
    const { userToken } = useAuth()
    const { pending } = useFormStatus();
    const [volWeight, setVolWeight] = useState(0)

    const [courierPartners, setCourierPartners] = useState<OrderType>()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchCourierPartners() {
            const res = await getCourierPartners(String(params.id), String(params.type))
            setCourierPartners(res)
            const volume = res?.orderDetails?.orderBoxLength * res?.orderDetails?.orderBoxWidth * res?.orderDetails?.orderBoxHeight;
            const b2bVol = res?.orderDetails?.packageDetails?.reduce((sum: any, box: any) => sum + parseFloat(String(box.orderBoxHeight * box.orderBoxLength * box.orderBoxWidth) || '0'), 0);
            console.log(volume, b2bVol)
            setVolWeight((volume || b2bVol) / 5000)
        }

        fetchCourierPartners()
        return () => {
            setCourierPartners(undefined)
        }
    }, [userToken, params.type, params.id])

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
                            Order Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                            <p className="text-sm font-semibold">Order Reference ID</p>
                            <p className="text-sm text-blue-700 underline-offset-4 underline">{courierPartners.orderDetails.order_reference_id}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Pickup From</p>
                            <p className="text-sm">{courierPartners.orderDetails?.pickupAddress?.pincode}, {courierPartners.orderDetails?.pickupAddress.state ?? ""}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Deliver To</p>
                            {<p className="text-sm"> {courierPartners.orderDetails?.customerDetails?.pincode}, {courierPartners.orderDetails?.customerDetails?.city ?? ""}</p>}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Order Value</p>
                            {courierPartners.orderDetails?.productId?.taxable_value && <p className="text-sm"> {formatCurrencyForIndia(Number(courierPartners.orderDetails?.productId?.taxable_value))}</p>}
                            {courierPartners.orderDetails?.amount && <p className="text-sm"> {formatCurrencyForIndia(Number(courierPartners.orderDetails?.amount))}</p>}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Payment Mode</p>
                            <Badge variant={courierPartners.orderDetails?.payment_mode == 0 ? "success" : "failure"}>{courierPartners.orderDetails?.payment_mode == 0 ? "Prepaid" : "COD"}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Approximate Weight (kg)</p>
                            <p className="text-sm">{courierPartners.orderDetails?.orderWeight} {courierPartners.orderDetails?.orderWeightUnit}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Volumetric Weight (kg)</p>
                            <p className="text-sm">{volWeight} kg</p>
                        </div>
                        {courierPartners.orderDetails.payment_mode != 0 && <div>
                            <p className="text-sm font-semibold">Collectable Amount</p>
                            <p className="text-sm">Rs. {courierPartners.orderDetails.amount2Collect}</p>
                        </div>}

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
                            <p>* All prices are inclusive of all taxes (Gst included)</p>

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
                                        courierPartners.courierPartner.map((partner, i) => {

                                            return <TableRow key={i}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Image className="mr-2 mix-blend-multiply"
                                                            src={getSvg(removeWhitespaceAndLowercase(partner.name))}
                                                            width={60} height={60} alt="logo" />
                                                        {partner.name}
                                                        <span className="text-slate-500 mx-1">({partner.nickName})</span> | Min. weight: {partner.minWeight}kg
                                                    </div>
                                                    {!partner.isReversedCourier && <div>{!!partner.cod && (<>COD Charges Applied: {formatCurrencyForIndia(partner.cod)} |</>)}  RTO Charges : {formatCurrencyForIndia(partner.rtoCharges ?? 0)}</div>}
                                                </TableCell>
                                                <TableCell>{partner.expectedPickup}</TableCell>
                                                <TableCell>{partner.order_zone}</TableCell>
                                                <TableCell>{formatCurrencyForIndia(partner.charge)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button disabled={pending} type="submit" variant={"themeButton"} size={"sm"} onClick={async () => {
                                                        setLoading(true)
                                                        try {
                                                            if (params.type == "b2c") {

                                                                const res = await handleCreateD2CShipment({
                                                                    orderId: [courierPartners.orderDetails._id],
                                                                    carrierId: partner.carrierID,
                                                                    carrierNickName: partner.nickName,
                                                                    charge: partner.charge,
                                                                    type: partner.type || ''
                                                                })
                                                            } else {
                                                                const res = await handleCreateB2BShipment({
                                                                    orderId: courierPartners.orderDetails._id,
                                                                    carrierId: partner.carrierID,
                                                                    carrierNickName: partner.nickName,
                                                                    charge: partner.charge,
                                                                })
                                                            }
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