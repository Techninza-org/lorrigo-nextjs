import Image from "next/image"
import { Separator } from "../ui/separator"
import Barcode from "react-barcode"
import { formatPhoneNumberIntl } from "react-phone-number-input"
import { LorrigoLogo } from "../Logos"
import { useSellerProvider } from "../providers/SellerProvider"
import { removeDoubleQuotes } from "@/lib/utils"

export const B2BInvoiceTemplate = ({ order, boxNumber }: { order?: any, boxNumber: string }) => {
    const { seller } = useSellerProvider();
    return (
        <div className="border border-gray-400 rounded-sm p-3 w-[31rem] text-lg">
            <div className=" grid grid-cols-2">
                <LorrigoLogo />

                <div className="text-right">
                    Order id: {order?.order_reference_id}
                </div>
                <div className="text-lg">
                    {boxNumber.includes("1") ? "Master" : "Child"} : {order.awb}
                </div>
                <div className="text-right">
                    Box: {boxNumber}
                </div>
            </div>
            <Separator orientation="horizontal" className="my-3 bg-gray-400" />
            <div className="">
                <div className=" flex flex-col items-center justify-center text-center">
                    <div className="row-span-7 justify-items-center">
                        <Barcode value={order?.awb} renderer="svg" width={1.6} height={50} displayValue={false} />
                    </div>
                    {order?.awb}
                </div>
                <div className="text-left">
                    Product Description: {removeDoubleQuotes(order?.product_description)}
                </div>
            </div>
            <Separator orientation="horizontal" className="my-3 bg-gray-400" />
            <div className="flex justify-between">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Shipping address:
                </h4>
                <LorrigoLogo />
            </div>
            <div>
                <div>{order?.customer?.name}</div>
                <div>{order?.customer?.address}</div>
                {/* <div>{order?.customerDetails?.city}, {order?.customerDetails?.state}</div> */}
                <div>{order?.customer?.pincode}</div>
                <div>{formatPhoneNumberIntl(`${order?.customer?.phone}`)}</div>
            </div>
            <Separator orientation="horizontal" className="my-3 bg-gray-400" />

            <div className="grid grid-cols-2">
                <div>
                    <div className="font-semibold">Return address:</div>
                    <div>{order?.pickupAddress.rtoAddress || order?.pickupAddress.address1}</div>
                    <div>{order?.pickupAddress?.rtoCity || order?.pickupAddress?.city}, {order?.pickupAddress?.rtoState || order?.pickupAddress?.state}</div>
                </div>
                <div className="row-span-7 justify-items-center ">
                    <Image
                        className="mx-auto"
                        src={`data:image/jpeg;base64,${seller?.companyProfile?.companyLogo}`}
                        width={80}
                        height={80}
                        alt="Company logo"
                    />
                </div>
            </div>
        </div>
    )
}