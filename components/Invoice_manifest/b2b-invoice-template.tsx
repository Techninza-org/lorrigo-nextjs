import Image from "next/image"
import { Separator } from "../ui/separator"
import Barcode from "react-barcode"
import { formatCurrencyForIndia } from "@/lib/utils"
import { formatPhoneNumberIntl } from "react-phone-number-input"
import { LorrigoLogo } from "../Logos"
import { useSellerProvider } from "../providers/SellerProvider"

export const B2BInvoiceTemplate = ({ order }: { order?: any }) => {
    const { seller } = useSellerProvider();
    return (
        <div className="border border-gray-400 rounded-sm p-3 w-[28rem]">
            <div className="flex justify-between">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Ship To:
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
                    <div>Weight: {order?.total_weight} kg</div>
                    <div>Payment: {order?.payment_mode == 0 ? "Prepaid" : "COD"}</div>
                    {
                        order?.payment_mode == 1 && (
                            <div className="font-bold">(Collect Rs {formatCurrencyForIndia(Number(order?.amount))})</div>
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
                    <div>{order?.sellerId?.name}</div>
                    <div>{order?.sellerId?.address || order?.pickupAddress.address1}</div>
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
                    <span className="font-semibold">Product Description : </span> {order?.product_description}
                    <div><span className="font-semibold">Invoice:</span> {order?.invoiceNumber}</div>
                    {
                        order?.sellerId?.gstInvoice?.gstin && (
                            <div><span className="font-semibold">GST:</span> {order?.sellerId?.gstInvoice?.gstin}</div>
                        )
                    }
                </div>
                <LorrigoLogo />
            </div>
        </div>
    )
}