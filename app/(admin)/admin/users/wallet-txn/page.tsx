'use client'
import { WalletTxnCol } from "@/components/Admin/User/wallet-txn-col";
import { WalletTxnTable } from "@/components/Admin/User/wallet-txn-table";
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WalletTxnPage()  {

    const { allTxn } = useAdminProvider()
    return (
        <Card>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    All Transactions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <WalletTxnTable
                    columns={WalletTxnCol}
                    data={allTxn || []}
                />
            </CardContent>
        </Card>
    )
}