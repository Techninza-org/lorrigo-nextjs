"use client"
import { InvoiceTemplate } from "./invoice-template";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const InvoicePage = () => {
    const printDocument = () => {
        const input = document.getElementById("divToPrint");
        html2canvas(input!)?.then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 3, 3, canvas.width * 0.16, canvas.height * 0.16);
            pdf.output('dataurlnewwindow');
            pdf.save("Invoice.pdf");
            pdf.autoPrint();
        });
    };

    return (
        <>
            <button onClick={printDocument}>sss</button>
            <div id="divToPrint" className="gap-y-14 w-full grid grid-cols-3 ">
                <InvoiceTemplate />
                <InvoiceTemplate />
                <InvoiceTemplate />
                <InvoiceTemplate />
                <InvoiceTemplate />
            </div>
        </>
    );
}