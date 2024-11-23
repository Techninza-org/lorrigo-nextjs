"use client"

import { useSellerProvider } from "../providers/SellerProvider"
import { DisputeTable } from "./disputes-table"
import { SellerDisputeColDefs } from "./disputes-cols"

export const Disputes = () => {
    const { disputes } = useSellerProvider()
    return (
        <DisputeTable data={disputes || []} columns={SellerDisputeColDefs} />
    )
}