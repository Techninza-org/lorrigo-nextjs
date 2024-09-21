import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { buttonVariants } from "./ui/button"

export const AlertNRedirect = ({ message, billingAddress, gstInvoice }: { message: string, billingAddress: boolean, gstInvoice: boolean }) => {
    return (
        <Alert className="my-3 bg-yellow-200 py-3">
            <AlertTitle className="font-bold text-xl">Alert!</AlertTitle>
            <AlertDescription>
                <div className="flex justify-between items-center">
                    {message}
                    <div className="space-x-3">
                        {gstInvoice && <Link className={buttonVariants({
                            variant: "themeNavActiveBtn",
                            size: "sm"
                        })} href='/settings/billing/gstin-invoicing'>
                            GST Invoice
                        </Link>}
                        {billingAddress && <Link className={buttonVariants({
                            variant: "themeNavActiveBtn",
                            size: "sm"
                        })} href='/settings/billing/billing-address'>
                            Billing Address
                        </Link>}
                    </div>
                </div>
            </AlertDescription>
        </Alert>
    )
}