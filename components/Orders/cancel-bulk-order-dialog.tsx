"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useSellerProvider } from "../providers/SellerProvider"
import { Button } from "../ui/button"
import { CircleAlert, TriangleAlertIcon } from "lucide-react"
import { useModal } from "@/hooks/use-model-store"
import { useState } from "react"
import { B2COrderType } from "@/types/types"


export const CancelBulkOrderDialog = () => {
    const { handleCancelOrder } = useSellerProvider()
    const { onClose, type, isOpen, data } = useModal();
    const [isLoading, setIsLoading] = useState(false)
    const { orders } = data
    const isModalOpen = isOpen && type === "cancelBulkOrder";

    const handleOrder = async (orderIds: string[], type: "order" | "shipment") => {
        setIsLoading(true)
        const res = await handleCancelOrder(orderIds, type);
        if (res) {
            setIsLoading(false)
            handleClose();
        }
    }

    const handleClose = () => {
        onClose();
    }

    const isAllOrdersHasAwb = orders?.every((order: B2COrderType) => order.awb);
    const isAllWOAwb = orders?.every((order: B2COrderType) => !order.awb);
    const orderIds = orders?.map((order: B2COrderType) => order._id);
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="space-y-6">
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center text-xl"><TriangleAlertIcon size={75} className="mx-auto mb-3" color="red" />Do you want to cancel the Order or Shipment?</DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        You can&apos;t undo this action.
                    </DialogDescription>
                    <div className="bg-yellow-100 bg-opacity-60 rounded-md p-4 flex">
                        <CircleAlert size={22} className="text-yellow-600 w-20" />
                        <ul className="text-sm space-y-4">
                            <li>Once the Shipment is cancelled, you can still reassign the Order to a different courier.</li>
                            <li>However, a cancelled Order will not be available in the panel for reassignment. Please choose to cancel the Order only if there is no need to ship it anymore.</li>
                            <li>In-both case, a cancellation request would be went to the courier partner. Once confirmed by the parther, the freight charges will be refunded and credited to your Lorrigo wallet immediately.</li>
                        </ul>
                    </div>
                </DialogHeader>
                <DialogFooter>
                    {
                        isAllWOAwb ? (
                            <Button variant={"destructive"} disabled={isLoading} className="w-full" onClick={() => handleOrder(orderIds || [], "order")}>
                                Cancel Order
                            </Button>
                        ) : null
                    }
                    {
                        isAllOrdersHasAwb ? (
                            <Button variant={"destructive"} disabled={isLoading} className="w-full" onClick={() => handleOrder(orderIds || [], "shipment")}>
                                Cancel Shipment
                            </Button>
                        ) : null
                    }
                    {
                        !isAllWOAwb && !isAllOrdersHasAwb ? (
                            <p className=" text-center">
                                <span className="text-lg">Note*:</span> <span className="text-red-500">You can only cancel orders or shipments in bulk. Please select orders with or without AWB to proceed.</span>
                            </p>
                        ) : null
                    }

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}