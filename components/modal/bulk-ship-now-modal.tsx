import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

import { useModal } from "@/hooks/use-model-store";
import { useSellerProvider } from "../providers/SellerProvider";
import { cn, formatCurrencyForIndia, getSvg, removeWhitespaceAndLowercase } from "@/lib/utils";
import { useEffect, useState } from "react";
import { B2COrderType } from "@/types/types";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { Info, Loader2, } from "lucide-react";
import HoverCardToolTip from "../hover-card-tooltip";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

function mergeCouriers(couriers: any[]) {
    const orderIdWCharges = couriers.reduce((acc, courier) => {
        const courierNameWNick = courier.name + " " + courier.nickName;
        if (!acc[courierNameWNick]) {
            acc[courierNameWNick] = [];
        }

        const existingOrder = acc[courierNameWNick].find(
            (order: any) => order.orderRefId === courier.orderRefId
        );

        if (existingOrder) {
            existingOrder.charges += courier.charge;
        } else {
            acc[courierNameWNick].push({
                ...courier
            });
        }

        return acc;
    }, {} as Record<string, any[]>);

    return {
        orderIdWCharges
    }
}

function groupAndMergeCouriers(data: any[]) {
    if (!data || data.length === 0) return { groupedData: {}, mergedData: [] };

    const groupedByRefId = Object.groupBy(data, courier => courier.orderRefId);

    const { orderIdWCharges } = mergeCouriers(data ?? [])

    return { groupedByRefId, orderIdWCharges };
}

export const BulkShipNowModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const { orders } = data ?? {};

    const orderIds = orders?.map((order: B2COrderType) => order._id)

    const isModalOpen = isOpen && type === "BulkShipNow";

    const { getBulkCourierPartners, handleCreateBulkD2CShipment } = useSellerProvider()
    const { userToken } = useAuth()

    const [courierPartners, setCourierPartners] = useState<any>()

    const [selectedItems, setSelectedItems] = useState<any[]>([])
    const handleCheckboxChange = (value: any) => {
        if (selectedItems.includes(value)) {
            setSelectedItems(selectedItems.filter((item) => item !== value))
        } else {
            setSelectedItems([...selectedItems, value])
        }
    }

    useEffect(() => {
        async function fetchCourierPartners() {
            const res = await getBulkCourierPartners(orderIds)
            setCourierPartners(groupAndMergeCouriers(res?.courierPartner))
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
        setSelectedItems([])
    }

    function calcTotalCharge() {
        return selectedItems.reduce((acc, item) => acc + item.charge, 0)
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="scrollbar-hide bg-white dark:text-white  text-black p-6 max-w-screen-md">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Bulk Ship Now
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-96 w-full rounded-md">
                    <div className="border rounded-lg w-full">
                        <div className="bg-muted px-4 py-3 text-sm font-medium">
                            <div className="grid grid-cols-[100px_1fr_100px_100px] items-center gap-4">
                                <div>Courier Name</div>
                            </div>
                        </div>
                        <Accordion type="single" collapsible>
                            {courierPartners?.orderIdWCharges ? Object?.keys(courierPartners?.orderIdWCharges)?.map((partner: any, i: number) => {
                                return (
                                    <AccordionItem key={i} value={partner}>
                                        <AccordionTrigger className="flex items-center h-16 justify-between bg-muted px-4 py-3 text-sm font-medium">
                                            <div className="flex items-center gap-3">
                                                <Image className="mr-2 mix-blend-multiply"
                                                    src={getSvg(removeWhitespaceAndLowercase(partner))}
                                                    width={50} height={50} alt="logo" />
                                                {partner}
                                            </div>
                                        </AccordionTrigger>
                                        {courierPartners?.orderIdWCharges[partner].map((item: any) => {
                                            const itemAlreadySelected: any = selectedItems.find((selectedItem: any) => selectedItem.orderRefId === item.orderRefId)
                                            const isDisable = itemAlreadySelected && !(`${itemAlreadySelected?.name} ${itemAlreadySelected?.nickName}` === partner)
                                            return (
                                                <AccordionContent key={item.orderRefId} className="p-3 border-t">
                                                    <div className="grid grid-cols-4 px-6 items-center gap-4">
                                                        <div className="flex gap-3 items-center cursor-pointer">
                                                            <Checkbox
                                                                id={item.orderRefId}
                                                                checked={itemAlreadySelected ? true : false}
                                                                disabled={isDisable}
                                                                onCheckedChange={() => handleCheckboxChange(item)}
                                                            />
                                                            <Label htmlFor={item.orderRefId} className={cn("font-medium",
                                                                isDisable ? "line-through" : ""
                                                            )}>{item.orderRefId}</Label>

                                                            {isDisable && <HoverCardToolTip Icon={<Info size={18} />} className="font-semibold">
                                                                <h3>{itemAlreadySelected.orderRefId} is already selected</h3>
                                                                <div className="flex gap-3 items-center pt-2 font-medium">
                                                                    <span>
                                                                        {itemAlreadySelected.name} {itemAlreadySelected.nickName}
                                                                    </span>
                                                                    <span>
                                                                        {formatCurrencyForIndia(itemAlreadySelected.charge)}
                                                                    </span>
                                                                </div>
                                                            </HoverCardToolTip>}

                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium">{item.minWeight}kg</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium">{item.order_zone}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium">{formatCurrencyForIndia(item.charge)}</p>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            )
                                        })}
                                    </AccordionItem>
                                )
                            }) : <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
                        </Accordion>
                    </div>
                </ScrollArea>

                <DialogFooter className="flex lg:justify-between">
                    <Button variant={'outline'}>Selected order {selectedItems.length} out of {courierPartners?.groupedByRefId && Object?.keys(courierPartners?.groupedByRefId).length}</Button>
                    <div className="flex gap-2">
                        <Button variant={'outline'}>{formatCurrencyForIndia(calcTotalCharge())}</Button>
                        <Button
                            variant={'themeNavActiveBtn'}
                            disabled={selectedItems.length <= 0}
                            onClick={() => handleCreateBulkD2CShipment(selectedItems, calcTotalCharge())}
                        >Ship now</Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog >
    )
};