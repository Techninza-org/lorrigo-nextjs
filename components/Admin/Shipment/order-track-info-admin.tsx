
"use client"
import { useParams } from "next/navigation"
import { formatCurrencyForIndia, handleCopyText } from "@/lib/utils"
import { Suspense, useEffect, useState } from "react"
import { B2COrderType } from "@/types/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/providers/AuthProvider"
import { LoadingComponent } from "@/components/loading-spinner"
import { getBucketStatus } from "@/components/Orders/order-action-button"
import { Badge } from "@/components/ui/badge"
import { OrderTrackTimeline } from "@/components/Orders/order-track-timeline"
import axios, { AxiosInstance } from "axios"

export const OrderTrackInfoAdmin = () => {
    const params = useParams()
    const { userToken } = useAuth()
    const orderId = params.orderId.toString()
    const [order, setOrderDetails] = useState<B2COrderType | null>(null)

    const axiosConfig = {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
        headers: {
            'Content-Type': 'application/json',
            ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
        },
    };
    const axiosIWAuth: AxiosInstance = axios.create(axiosConfig);

    const getOrderDetailsAdmin = async (orderId: string) => {
        try {
            const res = await axiosIWAuth.get(`/admin/order/${orderId}`);
            if (res.data?.valid) {
                setOrderDetails(res.data.order);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if (!userToken) return;
        getOrderDetailsAdmin(orderId) 
    }, [userToken, orderId]);

    if (!order) return (
        <div className="grid grid-cols-6 gap-3">
            <Card className="col-span-6">
                <CardContent>
                    <LoadingComponent />
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div>
            <Suspense fallback={<LoadingComponent />}>
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <div className="flex gap-3 items-center">
                            #{order?.order_reference_id}
                            <Badge variant={order?.bucket == -1 ? "failure" : "success"}>{getBucketStatus(order?.bucket ?? 0)}</Badge>
                        </div>
                    </CardTitle>
                </CardHeader>

                <Card className="col-span-4 grid grid-cols-2">
                    <Card className="p-6 m-6">
                        <CardTitle>Package Details</CardTitle>
                        <CardContent className="space-y-3 my-3 bg-slate-50 leading-6">
                            <p><span className="font-semibold mr-4">Delivery Partner:</span> {order.carrierName}</p>
                            <p><span className="font-semibold mr-4">Weight:</span> {order.orderWeight} ({order.orderWeightUnit})</p>
                            <p><span className="font-semibold mr-4">Volumetric Weight:</span>  {((order.orderBoxLength || 1) * (order.orderBoxWidth || 1) * (order.orderBoxHeight || 1)) / 5000} ({order.orderWeightUnit})</p>
                            <p><span className="font-semibold mr-4">Dimensions:</span> <span className="font-semibold">L:</span> {order.orderBoxLength}  <span className="font-semibold">B:</span> {order.orderBoxWidth} <span className="font-semibold">H:</span> {order.orderBoxHeight}</p>
                            <p><span className="font-semibold mr-4">Payment Mode:</span> {order.payment_mode == 0 ? "Prepaid" : "COD"}</p>
                            <p><span className="font-semibold mr-4">AWB:</span> {order.awb}</p>
                        </CardContent>
                    </Card>
                    <Card className="p-6 m-6">
                        <CardTitle>Recipient Details</CardTitle>
                        <CardContent className="space-y-3 my-3 bg-slate-50 leading-6">
                            <p><span className="font-semibold mr-4">Name:</span> {order.customerDetails?.name}</p>
                            <p><span className="font-semibold mr-4">Phone:</span> {order.customerDetails?.phone}</p>
                            <p><span className="font-semibold mr-4">City:</span> {order.customerDetails?.city}</p>
                            <p><span className="font-semibold mr-4">State:</span> {order.customerDetails?.state}</p>
                            <p><span className="font-semibold mr-4">Address:</span> {order.customerDetails?.address}</p>
                            <p><span className="font-semibold mr-4">Pincode:</span> {order.customerDetails?.pincode}</p>
                        </CardContent>
                    </Card>
                    <Card className="p-6 m-6">
                        <CardTitle>Order Details</CardTitle>
                        <CardContent className="space-y-3 my-3 bg-slate-50 leading-6">
                            <p><span className="font-semibold mr-4">Product name:</span> {order.productId?.name}</p>
                            <p><span className="font-semibold mr-4">Product type:</span> {order.productId?.category}</p>
                            <p><span className="font-semibold mr-4">Order value:</span> {formatCurrencyForIndia(Number(order.productId?.taxable_value))}</p>
                            <p><span className="font-semibold mr-4">Order quantity:</span> {order.productId?.quantity}</p>
                            <p><span className="font-semibold mr-4">COD amount:</span> {order.payment_mode == 0 ? "0" : order.productId?.taxable_value}</p>
                            <hr />
                            <p><span className="font-semibold mr-4">Total:</span>{formatCurrencyForIndia(Number(order.productId?.quantity) * Number(order.productId?.taxable_value))} /-</p>
                        </CardContent>
                    </Card>
                    <Card className="p-6 m-6">
                        <CardTitle>Seller Info</CardTitle>
                        <CardContent className="space-y-3 my-3 bg-slate-50 leading-6">
                            <p><span className="font-semibold mr-4">Seller name:</span> {order.sellerDetails?.sellerName}</p>
                            <p><span className="font-semibold mr-4">Seller address:</span> {order.sellerDetails?.sellerAddress}</p>
                            <p><span className="font-semibold mr-4">GSTIN:</span> {order.sellerDetails?.sellerGSTIN}</p>
                            <p><span className="font-semibold mr-4">Invoice:</span> {order.order_invoice_number}</p>
                        </CardContent>
                    </Card>
                    <Card className="p-6 m-6">
                        <CardTitle>Pickup Details</CardTitle>
                        <CardContent className="space-y-3 my-3 bg-slate-50 leading-6">
                            <p><span className="font-semibold mr-4">Pickup Id:</span> {order.pickupAddress?.hub_id}</p>
                            <p><span className="font-semibold mr-4">Name:</span> {order.pickupAddress?.name}</p>
                            <p><span className="font-semibold mr-4">Address:</span> {order.pickupAddress?.address1}</p>
                            <p><span className="font-semibold mr-4">Pincode:</span> {order.pickupAddress?.pincode}</p>
                            <p><span className="font-semibold mr-4">City:</span> {order.pickupAddress?.city}</p>
                            <p><span className="font-semibold mr-4">State:</span> {order.pickupAddress?.state}</p>
                            <p><span className="font-semibold mr-4">Country:</span> India</p>
                        </CardContent>
                    </Card>
                </Card>

                <Card className="p-2 mt-10">
                    <CardContent className="p-2 space-y-3 grid place-content-center">
                        {order && <OrderTrackTimeline order={order} />}
                    </CardContent>
                </Card>

            </Suspense>

        </div>
    )
}

