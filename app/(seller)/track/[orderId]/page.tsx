"use client"
import { OrderButton, getBucketStatus } from "@/components/Orders/order-action-button";
import OrderTrackTimeline from "@/components/Orders/order-track-timeline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function TrackOrder({ params }: { params: { orderId: string } }) {


    const order = {
        "_id": "6628d7d84971b9443ed51b0b",
        "sellerId": "65f3de361f8a4ac161eb4c41",
        "bucket": 0,
        "orderStages": [
            {
                "stage": 0,
                "action": "New",
                "stageDateTime": "2024-04-24T10:37:26.725Z",
                "_id": "6628e0e64971b9443ed51c47"
            }
        ],
        "pickupAddress": {
            "_id": "6628b2318c7fab9b834441b8",
            "sellerId": "65f3de361f8a4ac161eb4c41",
            "name": "Sam",
            "pincode": 110045,
            "city": "SOUTH WEST DELHI",
            "state": "Delhi",
            "address1": "K-10/767, Aurangabad, New Delhi",
            "address2": "K-10/767, Aurangabad, New Delhi",
            // "contactPersonName": "Alok",
            "phone": 917011609262,
            "delivery_type_id": 2,
            "hub_id": 120705,
            "__v": 0
        },
        "productId": {
            "_id": "6628d7d84971b9443ed51b09",
            "name": "Mango",
            "category": "Fruits",
            "hsn_code": "",
            "quantity": "1",
            "tax_rate": "0",
            "taxable_value": "100",
            "__v": 0
        },
        "order_reference_id": "SHIP-TEST",
        "payment_mode": 0,
        "order_invoice_date": "2024-04-24T09:56:21.785Z",
        "order_invoice_number": "",
        "isContainFragileItem": false,
        "numberOfBoxes": 1,
        "orderBoxHeight": 10,
        "orderBoxWidth": 10,
        "orderBoxLength": 10,
        "orderSizeUnit": "cm",
        "orderWeight": 1,
        "orderWeightUnit": "kg",
        "amount2Collect": 10,
        "customerDetails": {
            "name": "Alok Sharma",
            "phone": "+917011609262",
            "address": "I-10/969, Sangam Vihar, ND - 110080",
            "pincode": 110080,
            "state": "Delhi",
            "city": "Delhi"
        },
        "sellerDetails": {
            "sellerName": "Tony stark hu me",
            "sellerGSTIN": "",
            "sellerAddress": "",
            "isSellerAddressAdded": false,
            "sellerPincode": 0,
            "sellerCity": "",
            "sellerState": "",
            "sellerPhone": 0
        },
        "createdAt": "2024-04-24T09:58:48.352Z",
        "updatedAt": "2024-04-24T09:58:48.352Z",
        "__v": 0,
        "shiprocket_order_id": "531587380",
        "shiprocket_shipment_id": "529692730"
    }
    return (


        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    #{params.orderId}
                    <Badge variant={order?.bucket == -1 ? "failure" : "success"}>{getBucketStatus(order?.bucket ?? 0)}</Badge>
                    {/* <OrderButton rowData={order} /> */}
                    <div className="md:flex space-y-3 md:space-y-0 md:space-x-3 mt-6 md:mt-0">
                        {/* <DatePickerWithRange date={date} setDate={()=>setDate} disabledDates={{ after: new Date() }} /> */}
                        {/* <form action={() => handleSendReport(tableData.data, date)}>
                <SendReportButton />
            </form> */}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <OrderTrackTimeline />
            </CardContent>
        </Card>

    )
}