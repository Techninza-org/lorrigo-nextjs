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


export const CancelOrderDialog = () => {
    const { handleCancelOrder } = useSellerProvider()
    const { onClose, type, isOpen, data } = useModal();
    const { order } = data
    const isModalOpen = isOpen && type === "cancelOrder";

    const handleOrder = async (orderId: string, type: "order" | "shipment") => {
        const res = await handleCancelOrder(orderId, type);
        if (res) {
            handleClose();
        }
    }

    const handleClose = () => {
        onClose();
    }
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
                    <Button variant={"destructive"} className="w-full" onClick={() => handleOrder(order?._id ?? "", "order")}>
                        Cancel Order
                    </Button>

                    {
                        order?.awb ? (
                            <Button variant={"secondary"} className="w-full" onClick={() => handleOrder(order?._id ?? "", "shipment")}>
                                Cancel Shipment
                            </Button>
                        ) : null
                    }

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}