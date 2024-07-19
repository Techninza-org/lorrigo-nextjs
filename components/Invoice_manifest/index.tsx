"use client"
import { B2COrderType } from "@/types/types";
import { InvoiceTemplate } from "./invoice-template";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "../ui/button";
import GenerateManifestTemplate from "./manifest-template";
import { usePDF } from 'react-to-pdf';
import { B2BInvoiceTemplate } from "./b2b-invoice-template";
import { B2BOrderType } from "@/types/B2BTypes";

export const InvoicePage = ({ order }: { order?: B2COrderType }) => {
    const printDocument = () => {
        const input = document.getElementById("divToPrint");
        html2canvas(input!)?.then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 3, 3, canvas.width * 0.16, canvas.height * 0.16);
            pdf.save(`label_${order?.order_invoice_number}.pdf`);
            pdf.autoPrint();
        });
    };

    return (
        <>
            <Button size={"sm"} variant={"webPageBtn"} onClick={printDocument}>Download Label</Button>
            <div id="divToPrint" className="mx-auto pb-3">
                <InvoiceTemplate order={order} />
            </div>
        </>
    );
}

export const B2BInvoicePage = ({ order }: { order?: B2BOrderType }) => {
    const printDocument = () => {
        const input = document.getElementById("divToPrint");
        html2canvas(input!)?.then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 3, 3, canvas.width * 0.16, canvas.height * 0.16);
            pdf.save(`label_${order?.invoiceNumber}.pdf`);
            pdf.autoPrint();
        });
    };

    return (
        <>
            <Button size={"sm"} variant={"webPageBtn"} onClick={printDocument}>Download Label</Button>
            <div id="divToPrint" className="mx-auto pb-3">
                <B2BInvoiceTemplate order={order} />
            </div>
        </>
    );
}

export const GenerateManifest = ({ order }: { order?: B2COrderType }) => {
    const printDocument = () => {
        const input = document.getElementById("divToPrint");
        html2canvas(input!)?.then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 3, 3, canvas.width * 0.155, canvas.height * 0.155);
            pdf.save(`label_${order?.order_invoice_number}.pdf`);
            pdf.autoPrint();
        });
    };
    return (
        <>
            <Button size={"sm"} variant={"webPageBtn"} onClick={printDocument}>Download Manifest</Button>
            <div className="w-full p-4" id="divToPrint">
                <GenerateManifestTemplate order={order} />
            </div>
        </>
    )
}



export const InvoiceBulk = ({ orders }: {orders: B2COrderType[]}) => {
    const { toPDF, targetRef } = usePDF({ filename: 'bulk_label.pdf' });

    const chunkArray = (array: B2COrderType[], size: number) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArray.push(array.slice(i, i + size));
        }
        return chunkedArray;
    };

    const chunkedOrders = chunkArray(orders, 4);

    return (
        <>
            <Button size={"sm"} variant={"webPageBtn"} onClick={() => toPDF()}>Download Label</Button>
            <div ref={targetRef} className="mx-auto w-full h-full flex flex-col gap-16 p-10 justify-center">
                {
                    chunkedOrders.map((orderChunk, pageIndex) => (
                        <div key={pageIndex} className={`page-break grid grid-cols-2 gap-14 justify-items-center ${pageIndex > 0 ? 'mt-[650px]' : ''}`}>
                            {
                                orderChunk.map((order:B2COrderType) => (
                                    <div key={order._id} className="w-full">
                                        <InvoiceTemplate order={order} />
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </>
    );
};



export const GenerateBulkManifest = ({ orders }: { orders: B2COrderType[] }) => {
    const { toPDF, targetRef } = usePDF({ filename: 'bulk_Manifest.pdf' });
    return (
        <>
            <Button size={"sm"} variant={"webPageBtn"} onClick={() => toPDF()}>Download Manifest</Button>
            <div ref={targetRef} className="mx-auto w-full h-full flex flex-col gap-16 p-10  justify-center">
                {
                    orders.map((order, index) => (
                        <div key={order._id} className={` ${index % 2 === 1 ? 'mt-[410px]' : ''}`}>
                            <GenerateManifestTemplate order={order} />
                        </div>
                    ))
                }
            </div>
        </>
    );
};