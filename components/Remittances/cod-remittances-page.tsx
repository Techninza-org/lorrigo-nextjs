"use client"
import { RemittancesTable } from "@/components/Remittances/remittances-table";
import { OrderStatusCol } from "./cod-remittances-col";
import { useSellerProvider } from "../providers/SellerProvider";

const CodRemittancePage = () => {
    const { sellerRemittance } = useSellerProvider();
    return (<RemittancesTable data={sellerRemittance || []} columns={OrderStatusCol} />);
}

export default CodRemittancePage;