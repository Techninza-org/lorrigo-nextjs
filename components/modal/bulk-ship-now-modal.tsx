import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useModal } from "@/hooks/use-model-store";
import { useSellerProvider } from "../providers/SellerProvider";
import { getSvg, removeWhitespaceAndLowercase } from "@/lib/utils";
import { useEffect, useState } from "react";
import { B2COrderType, OrderType } from "@/types/types";
import { LoadingComponent } from "../loading-spinner";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";


export const BulkShipNowModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const { orders } = data ?? {};

    const orderIds = orders?.map((order: B2COrderType) => order._id)

    console.log(orderIds, "orderIds")

    const isModalOpen = isOpen && type === "BulkShipNow";

    const { getBulkCourierPartners, handleCreateBulkD2CShipment } = useSellerProvider()
    const { userToken } = useAuth()
    const [volWeight, setVolWeight] = useState(0)

    const [courierPartners, setCourierPartners] = useState<OrderType>()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchCourierPartners() {
            const res = await getBulkCourierPartners(orderIds)
            console.log(res)
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
    }, [userToken, isModalOpen])

    if (!orderIds) {
        return null
    }

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="scrollbar-hide bg-white dark:text-white  text-black p-6 max-w-screen-sm">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Bulk Ship Now
                    </DialogTitle>
                </DialogHeader>


                <ScrollArea className="h-96 border w-full rounded-md p-2">

                    {
                        courierPartners?.courierPartner ? courierPartners?.courierPartner?.map((partner, i) => {

                            return <TableRow key={i}>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Image
                                            className="mr-2 mix-blend-multiply"
                                            src={getSvg(removeWhitespaceAndLowercase(partner.name))}
                                            width={60} height={60} alt="logo" />
                                        {partner.name}
                                        <span className="text-slate-500 mx-1">({partner.nickName})</span> | Min. weight: {partner.minWeight}kg
                                    </div>
                                    {/* {!partner.isReversedCourier && <div>{!!partner.cod && (<>COD Charges Applied: {formatCurrencyForIndia(partner.cod)} |</>)}  RTO Charges : {formatCurrencyForIndia(partner.rtoCharges ?? 0)}</div>} */}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button disabled={loading} type="submit" variant={"themeButton"} size={"sm"} onClick={async () => {
                                        setLoading(true)
                                        try {
                                            // if (params.type == "b2c") {

                                            const res = await handleCreateBulkD2CShipment({
                                                orderId: orderIds,
                                                carrierId: partner.carrierID,
                                                carrierNickName: partner.nickName,
                                                charge: partner.charge,
                                            })
                                            // } else {
                                            //     const res = await handleCreateB2BShipment({
                                            //         orderId: courierPartners.orderDetails._id,
                                            //         carrierId: partner.carrierID,
                                            //         carrierNickName: partner.nickName,
                                            //         charge: partner.charge,
                                            //     })
                                            // }
                                        } finally {
                                            setLoading(false)
                                        }
                                    }}>Ship now</Button>
                                </TableCell>
                            </TableRow>
                        }) : <div className="text-gray-600 text-center">
                            <Loader2 size={18} className="animate-spin mx-auto my-6" />
                            <span className="block text-center">
                                Please wait while we fetch the courier partners for you,
                            </span>
                            <span className="block">
                                this may take a few seconds.
                            </span>
                        </div>
                    }
                </ScrollArea>

            </DialogContent>
        </Dialog>
    )
};