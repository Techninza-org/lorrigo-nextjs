"use client"
import { useModal } from "@/hooks/use-model-store"
import { pickupAddressType } from "@/types/types"
import { SquarePen } from "lucide-react"

export const EditAddress = ({ hub }: { hub: pickupAddressType }) => {

    const { onOpen } = useModal()

    return (
        <button onClick={() => onOpen("editPickupLocation", { hub: hub })}><SquarePen className='text-[#747474] size-4' /></button>
    )
}