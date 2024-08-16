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
import { formatCurrencyForIndia, getSvg, removeWhitespaceAndLowercase } from "@/lib/utils";
import { Fragment, useEffect, useState } from "react";
import { B2COrderType, OrderType } from "@/types/types";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { Loader2, LucideZap } from "lucide-react";
import HoverCardToolTip from "../hover-card-tooltip";

function mergeCouriers(couriers: any[]) {
    const mergedData = Object.values(
        couriers.reduce((acc, courier) => {
            if (acc[courier.name]) {
                acc[courier.name].charge += courier.charge;
                acc[courier.name].rtoCharges += courier.rtoCharges;
            } else {
                acc[courier.name] = { ...courier };
            }
            return acc;
        }, {})
    );

    const orderIdWCharges = couriers.reduce((acc, courier) => {
        if (!acc[courier.name]) {
            acc[courier.name] = [];
        }

        const existingOrder = acc[courier.name].find(
            (order: any) => order.orderRefId === courier.orderRefId
        );

        if (existingOrder) {
            existingOrder.charges += courier.charge;
        } else {
            acc[courier.name].push({
                orderRefId: courier.orderRefId,
                charges: courier.charge,
            });
        }

        return acc;
    }, {} as Record<string, any[]>);

    return {
        mergedData,
        orderIdWCharges
    }
}

function groupAndMergeCouriers(data: any[]) {
    if (!data || data.length === 0) return { groupedData: {}, mergedData: [] };

    const groupedByZone = Object.groupBy(data, courier => courier.order_zone);

    const groupedData = groupedByZone;

    const { mergedData, orderIdWCharges } = mergeCouriers(data ?? [])

    return { groupedData, mergedData, orderIdWCharges };
}

export const BulkShipNowModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const { orders } = data ?? {};

    const orderIds = orders?.map((order: B2COrderType) => order._id)

    const isModalOpen = isOpen && type === "BulkShipNow";

    const { getBulkCourierPartners, handleCreateBulkD2CShipment } = useSellerProvider()
    const { userToken } = useAuth()

    const [courierPartners, setCourierPartners] = useState<any>()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchCourierPartners() {
            const res = await getBulkCourierPartners(orderIds)
            setCourierPartners(groupAndMergeCouriers(res?.courierPartner || []))
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
            <DialogContent className="scrollbar-hide bg-white dark:text-white  text-black p-6 max-w-screen-md">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Bulk Ship Now
                    </DialogTitle>
                </DialogHeader>

                <div className="h-60 scrollbar-hide w-full overflow-x-scroll">
                    <div className="grid grid-cols-[auto] gap-4">
                        {/* Header Row for Zones */}
                        <div className="grid grid-flow-col text-sm auto-cols-max">
                            {Object.entries(courierPartners?.groupedData || {}).map(([zone, couriers]) => (
                                <div key={zone} className="flex flex-col min-w-max">
                                    <div className="font-bold border-b grid grid-cols-2 border-gray-300 p-1">
                                        {!!zone && (
                                            <>
                                                <div>{zone}</div>
                                                <div className="text-sm">Order Ref Id</div>
                                            </>
                                        )}

                                    </div>

                                    {/* Second Row for OrderRefId and CourierName */}
                                    <div className="grid grid-cols-2 gap-2 p-1">
                                        {(couriers as any)?.map((courier: any) => (
                                            <>
                                                <div key={courier.carrierID} className="flex flex-col">
                                                    <div className="text-sm">{courier.name}</div>
                                                    <div className="text-xs text-gray-500">{courier.nickName}</div>
                                                </div>
                                                <div>
                                                    {courier.orderRefId}
                                                </div>
                                            </>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <ScrollArea className="h-96 border w-full rounded-md p-2">

                    {
                        courierPartners?.mergedData ? courierPartners?.mergedData?.map((partner: any, i: number) => {

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
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex items-center">
                                            {formatCurrencyForIndia(partner.charge)}
                                        </div>
                                        <HoverCardToolTip side="top" className="overflow-auto max-h-24 p-3 scrollbar-hide" Icon={<LucideZap size={14} />} >
                                                {
                                                    courierPartners?.orderIdWCharges[partner.name]?.map((order: any, i: number) => (
                                                        <div key={i} className="grid grid-cols-2 text-xs text-gray-500">
                                                            <span>
                                                                {order.orderRefId}
                                                            </span>
                                                            <span>
                                                                {formatCurrencyForIndia(order.charges)}
                                                            </span>
                                                        </div>
                                                    ))
                                                }
                                        </HoverCardToolTip>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button disabled={loading} type="submit" variant={"themeButton"} size={"sm"} onClick={async () => {
                                        setLoading(true)
                                        try {
                                            const res = await handleCreateBulkD2CShipment({
                                                orderIdWCharges: courierPartners?.orderIdWCharges[partner.name],
                                                carrierId: partner.carrierID,
                                                carrierNickName: partner.nickName,
                                            })
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