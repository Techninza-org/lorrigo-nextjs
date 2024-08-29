import Link from "next/link"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "./ui/button"

export const AlertNRedirect = ({ message, billingAddress, gstInvoice }: { message: string, billingAddress: boolean, gstInvoice: boolean }) => {
    return (
        <AlertDialog open={billingAddress || gstInvoice}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Alert!</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {gstInvoice && <Link className={buttonVariants({
                        variant: "themeNavActiveBtn",
                    })} href='/settings/billing/gstin-invoicing'>
                        GST Invoice
                    </Link>}
                    {billingAddress && <Link className={buttonVariants({
                        variant: "themeNavActiveBtn",
                    })} href='/settings/billing/billing-address'>
                        Billing Address
                    </Link>}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}