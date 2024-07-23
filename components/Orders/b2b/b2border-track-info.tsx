
"use client"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getBucketStatus } from "./b2b-order-action-button"
import { OrderTrackTimeline } from "../order-track-timeline"
import { ClipboardList, Copy, Package2, ShoppingCartIcon, UserRound } from "lucide-react"
import { formatCurrencyForIndia, handleCopyText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatPhoneNumberIntl } from "react-phone-number-input"
import { Suspense, useEffect, useState } from "react"
import { useSellerProvider } from "@/components/providers/SellerProvider"
import { useAuth } from "@/components/providers/AuthProvider"
import HoverCardToolTip from "@/components/hover-card-tooltip"
import { B2BOrderType } from "@/types/B2BTypes"

export const B2BOrderTrackInfo = () => {
    const params = useParams()
    const { userToken } = useAuth()
    const { getOrderDetails } = useSellerProvider()
    const [order, setOrderDetails] = useState<B2BOrderType | null>(null)


    useEffect(() => {
        async function fetchRemittance() {
            const res = await getOrderDetails(params.orderId.toString())
            if (res) {
                setOrderDetails(res as any)
            }
        }
        fetchRemittance()
        return () => {
            setOrderDetails(null)
        }
    }, [userToken, params])

    if (!order) return (
        <div className="grid grid-cols-6 gap-3">
            <Card className="col-span-6">
                <CardContent>
                    {/* <LoadingComponent /> */}
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="grid grid-cols-6 gap-3">
            <Suspense fallback={<>Loading...</>}>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="flex justify-between">
                            <div className="flex gap-3 items-center">
                                #{order?.order_reference_id}
                                <Badge variant={order?.bucket == -1 ? "failure" : "success"}>{getBucketStatus(order?.bucket ?? 0)}</Badge>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 my-3 bg-slate-50">
                        <div className="flex items-center gap-3 pt-2">
                            <Button size="icon" variant={"secondary"}>
                                <ClipboardList size={24} />
                            </Button>
                            <span className="font-bold">Order Details</span>
                        </div>
                        <div className="grid grid-cols-4 gap-5 w-full">
                            <div>
                                <span className="text-gray-400">
                                    Order created
                                </span>
                                <div>
                                    {new Date(order?.createdAt ?? "").toLocaleDateString() || ""}
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-400">
                                    Channel
                                </span>
                                <p className="uppercase flex gap-1"><ShoppingCartIcon size={18} /> Custom</p>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">
                                    Pickup Address
                                </span>
                                <HoverCardToolTip label={order?.pickupAddress?.name} side="bottom">
                                    {`${order?.pickupAddress?.address1}, ${order?.pickupAddress?.address2}, ${order?.pickupAddress?.city}, ${order?.pickupAddress?.state}, ${order?.pickupAddress?.pincode}`}
                                </HoverCardToolTip>

                            </div>
                            <div>
                                <span className="text-gray-400">
                                    Payment
                                </span>
                                <div className="flex gap-3">
                                    <p>{formatCurrencyForIndia(Number(order?.amount))}</p>
                                    <Badge variant={order?.payment_mode == 0 ? "success" : "failure"}>{order?.payment_mode == 0 ? "Prepaid" : "COD"}</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    {
                        order?.awb ? (
                            <CardContent className="space-y-3 my-3 bg-slate-50">
                                <div className="flex items-center gap-3 pt-2">
                                    <Button size="icon" variant={"secondary"} onClick={() => navigator.clipboard.writeText(order?.order_reference_id ?? "")}>
                                        <Package2 size={24} />
                                    </Button>
                                    <span className="font-bold">Shipping Details</span>
                                </div>

                                <div className="grid grid-cols-4 gap-5 w-full">
                                    <div>
                                        <span className="text-gray-400">
                                            Courier
                                        </span>
                                        <div>
                                            <p className="capitalize">{order?.carrierName || "Awaited"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">
                                            AWB
                                        </span>
                                        <p>
                                            <span className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center">
                                                {order?.awb || "Awaited"}
                                                <Copy className="ml-2 cursor-pointer" size={15} onClick={() => handleCopyText(`${order?.awb || ""}`)} />
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">
                                            Mode
                                        </span>
                                        <p className="capitalize">Surface</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">
                                            Pickup Id
                                        </span>
                                        <div className="flex gap-3">
                                            {order?.pickupAddress?.hub_id || "-"}
                                        </div>
                                    </div>
                                </div>

                            </CardContent>
                        ) : null
                    }

                    <CardContent className="space-y-3 my-3 bg-slate-50">
                        <div className="flex items-center gap-3 pt-2">
                            <Button size="icon" variant={"secondary"}>
                                <Package2 size={24} />
                            </Button>
                            <span className="font-bold">Package Details</span>
                        </div>

                        <div className="grid grid-cols-4 gap-5 w-full">
                            <div>
                                <span className="text-gray-400">
                                    Dead Weight
                                </span>
                                <div>
                                    <p className="capitalize">0.5Kg</p>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-400">
                                    Dimensions (in cm)
                                </span>
                                {
                                    order?.packageDetails?.map((item, i) => (
                                        <p key={i}>{item?.qty} x {item?.orderBoxWidth} x {item?.orderBoxHeight}</p>
                                    ))
                                }
                            </div>
                            <div>
                                <span className="text-gray-400">
                                    Volumetric Weight
                                </span>
                                <div>{(order?.packageDetails?.reduce((sum: any, box: any) => sum + parseFloat(String(box.orderBoxHeight * box.orderBoxLength * box.orderBoxWidth) || '0'), 0)/5000)}Kg</div>
                            </div>

                        </div>

                    </CardContent>


                    <CardContent className="space-y-3 my-3 bg-slate-50">
                        <div className="flex items-center gap-3 pt-2">
                            <Button size="icon" variant={"secondary"}>
                                <UserRound size={24} />
                            </Button>
                            <span className="font-bold">Customer Details</span>
                        </div>

                        <div className="grid grid-cols-4 gap-5 w-full">
                            <div>
                                <span className="text-gray-400">
                                    Name
                                </span>
                                <div>
                                    <p className="capitalize">{order?.customer?.name}</p>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-400">
                                    Phone
                                </span>
                                <p>{formatPhoneNumberIntl(`${order?.customer?.phone}`)}</p>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">
                                    Address
                                </span>
                                <HoverCardToolTip label="Address" side="bottom" >
                                    {`${order?.customer?.address}, ${order?.customer?.city}, ${order?.customer?.state}, ${order?.customer?.pincode}`}
                                </HoverCardToolTip>
                            </div>
                            <div>
                                <span className="text-gray-400">
                                    Pincode
                                </span>
                                <p>{order?.customer?.pincode}</p>
                            </div>

                        </div>

                    </CardContent>
                </Card>


                <Card className="p-2 col-span-2">
                    <CardContent className="p-2 space-y-3">
                        {order && <OrderTrackTimeline order={order as any} />}
                    </CardContent>
                </Card>

            </Suspense>

        </div>
    )
}

