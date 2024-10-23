import Image from "next/image"
import { Separator } from "../ui/separator"
import Barcode from "react-barcode"
import { B2COrderType } from "@/types/types"
import { formatCurrencyForIndia } from "@/lib/utils"
import { formatPhoneNumberIntl } from "react-phone-number-input"
import { LorrigoLogo } from "../Logos"
import { useSellerProvider } from "../providers/SellerProvider"

export const InvoiceTemplate = ({ order }: { order?: B2COrderType }) => {
    const { seller } = useSellerProvider();
    return (
        <div className="border border-gray-400 rounded-sm p-3 w-full h-full">
            <div className="flex justify-between">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Ship To:
                </h4>
                <LorrigoLogo />
            </div>
            <div>
                <div>{order?.customerDetails?.name}</div>
                <div>{order?.customerDetails?.address}</div>
                {/* <div>{order?.customerDetails?.city}, {order?.customerDetails?.state}</div> */}
                <div>{order?.customerDetails?.pincode}</div>
                <div>{formatPhoneNumberIntl(`${order?.customerDetails?.phone}`)}</div>
            </div>
            <Separator orientation="horizontal" className="my-3 bg-gray-400" />
            <div className="grid grid-cols-2">
                <div>
                    <div>Dimensions: {order?.orderBoxLength} x {order?.orderBoxWidth} x {order?.orderBoxHeight}</div>
                    <div>Weight: {order?.orderWeight} {order?.orderWeightUnit}</div>
                    <div>Payment: {order?.payment_mode == 0 ? "Prepaid" : "COD"}</div>
                    {
                        order?.payment_mode == 1 && (
                            <div className="font-bold">(Collect Rs {formatCurrencyForIndia(Number(order?.amount2Collect))})</div>
                        )
                    }
                    <div className="capitalize">{order?.carrierName}</div>
                    {
                        order?.awb && (
                            <div>AWB: {order?.awb}</div>
                        )
                    }
                    <div>SID: {order?.order_reference_id}</div>
                </div>
                <div className="row-span-7 justify-items-center">
                    <Barcode value={`${order?.awb}`} renderer="svg" width={1.4} displayValue={false} />
                </div>
            </div>
            <Separator orientation="horizontal" className="my-3 bg-gray-400" />
            <div className="grid grid-cols-2">
                <div>
                    <div className="font-semibold">Shipped by:</div>
                    <div>{order?.sellerDetails?.sellerName}</div>
                    {order?.sellerDetails?.sellerAddress ?
                        <div>{order?.sellerDetails?.sellerAddress}</div> :
                        <div>{order?.pickupAddress.address1}</div>
                    }
                    <div>India</div>
                    <div className="font-semibold">If not delivered, return to:</div>
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
            <Separator orientation="horizontal" className="my-3 bg-gray-400" />

            <div className="flex justify-between">
                <div className="scroll-m-20 tracking-tight">
                    <span className="font-semibold">Product Description :</span> {order?.productId?.name}
                    <div><span className="font-semibold">Invoice:</span> {order?.order_invoice_number}</div>
                    {
                        order?.sellerDetails?.sellerGSTIN && (
                            <div><span className="font-semibold">GST:</span> {order?.sellerDetails?.sellerGSTIN}</div>
                        )
                    }
                </div>
                <LorrigoLogo />
            </div>
        </div>
    )
}