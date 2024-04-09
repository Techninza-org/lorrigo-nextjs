"use client"
import { B2COrderType } from "@/types/types";
import { InvoiceTemplate } from "./invoice-template";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "../ui/button";

export const InvoicePage = ({ order }: { order?: B2COrderType }) => {
    const printDocument = () => {
        const input = document.getElementById("divToPrint");
        html2canvas(input!)?.then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 3, 3, canvas.width * 0.16, canvas.height * 0.16);
            pdf.output('dataurlnewwindow');
            pdf.save(`label_${order?.order_invoice_number}.pdf`);
            pdf.autoPrint();
        });
    };

    return (
        <>
            <Button size={"sm"} variant={"webPageBtn"} onClick={printDocument}>Download Label</Button>
            {/* <div id="divToPrint" className="gap-y-14 w-full grid grid-cols-3 "> */}
            <div id="divToPrint" className="mx-auto pb-3">
                <InvoiceTemplate order={order}/>
            </div>
            {/* </div> */}
        </>
    );
}