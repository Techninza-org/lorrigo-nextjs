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
import GenerateB2BManifestTemplate from "./b2b-manifest-template";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useSellerProvider } from "../providers/SellerProvider";

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
    const printAllDocuments = async () => {
        const pdf = new jsPDF();
        const inputElements = Array.from(document.querySelectorAll(".divToPrint"));

        const itemsPerPage = 4;
        const margin = 10;
        const gap = 0;
        const pdfWidth = pdf.internal.pageSize.width;
        const pdfHeight = pdf.internal.pageSize.height;
        const itemWidth = (pdfWidth - 2 * margin - gap) / 2;
        const itemHeight = (pdfHeight - 2 * margin - gap) / 2;

        let pageItemCount = 0;
        let x = margin;
        let y = margin;

        for (const input of inputElements) {
            const canvas = await html2canvas(input as HTMLElement, {
                scale: 1
            });
            const imgData = canvas.toDataURL("image/png");

            if (pageItemCount === itemsPerPage) {
                pdf.addPage();
                x = margin;
                y = margin;
                pageItemCount = 0;
            }

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const scaleX = itemWidth / imgWidth;
            const scaleY = itemHeight / imgHeight;
            const scale = Math.min(scaleX, scaleY);

            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;

            pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);

            x += itemWidth + gap;
            if (x + itemWidth + gap > pdfWidth - margin) {
                x = margin;
                y += itemHeight + gap;
            }

            if (y + itemHeight > pdfHeight - margin) {
                x = margin;
                y = margin;
                pdf.addPage();
                pageItemCount = 0;
            }

            pageItemCount++;
        }

        pdf.save(`label_${order?.invoiceNumber}.pdf`);
        pdf.autoPrint();
    };

    if (!order) return null;

    const generateAwbs = () => {
        let currentAwb = order.awb;
        const labels = [];
        let labelCount = 1;

        for (const packageDetail of order.packageDetails ?? []) {
            const qty = Number(packageDetail.qty);
            for (let j = 0; j < qty; j++) {
                const awb = labelCount === 1
                    ? currentAwb
                    : `${currentAwb}${(labelCount).toString().padStart(4, '0')}`;
                labels.push({
                    awb,
                    index: labelCount - 1,
                    labelIndex: j
                });
                labelCount++;
            }
        }
        return labels;
    };

    const labels = generateAwbs();

    return (
        <>
            <Button size={"sm"} variant={"webPageBtn"} className="w-full" onClick={printAllDocuments}>
                Download All
            </Button>
            {labels.map((label, index) => {
                const boxNumber = `${Math.floor(index / (order?.packageDetails?.length ?? 0)) + 1} / ${order.packageDetails?.length ?? 0}`;
                return (
                    <div key={index}>
                        <div id={`divToPrint_${index}`} className="divToPrint mx-auto pb-3">
                            <B2BInvoiceTemplate
                                order={{ ...order, awb: label.awb }}
                                boxNumber={`${boxNumber}-${label.labelIndex + 1}`}
                            />
                        </div>
                        {(index + 1) % 4 === 0 && <div className="page-break" />}
                    </div>
                );
            })}
            <style jsx>
                {`
                    .page-break {
                        page-break-after: always;
                    }
                `}
            </style>
        </>
    );
};

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
                <GenerateManifestTemplate orders={(order && [order]) || []} sellerName={order?.sellerDetails?.sellerName ?? ""} courierName={order?.carrierName ?? ""} />
            </div>
        </>
    )
}

export const GenerateB2BManifest = ({ order }: { order?: B2BOrderType }) => {
    const printDocument = () => {
        const input = document.getElementById("divToPrint");
        html2canvas(input!)?.then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 3, 3, canvas.width * 0.155, canvas.height * 0.155);
            pdf.save(`label_${order?.order_reference_id}.pdf`);
            pdf.autoPrint();
        });
    };
    return (
        <>
            <Button size={"sm"} variant={"webPageBtn"} onClick={printDocument}>Download Manifest</Button>
            <div className="w-full p-4" id="divToPrint">
                <GenerateB2BManifestTemplate order={order} />
            </div>
        </>
    )
}

export const InvoiceBulk = ({ orders }: { orders: B2COrderType[] }) => {
    const LABELS_PER_PAGE = 4
    
    const pdfContentRef = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const chunkArray = (array: B2COrderType[], size: number) => {
        const chunkedArray = []
        for (let i = 0; i < array.length; i += size) {
            chunkedArray.push(array.slice(i, i + size))
        }
        return chunkedArray
    }

    const chunkedOrders = chunkArray(orders, LABELS_PER_PAGE)

    const generatePDF = async () => {
        if (!pdfContentRef.current) return
        setIsGenerating(true)

        try {
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()

            for (let i = 0; i < chunkedOrders.length; i++) {
                const pageElement = document.getElementById(`page-${i}`)
                if (pageElement) {
                    const canvas = await html2canvas(pageElement, {
                        scale: 2,
                        logging: false,
                        useCORS: true,
                        allowTaint: true
                    })
                    const imgData = canvas.toDataURL('image/jpeg', 1.0)

                    if (i > 0) pdf.addPage()

                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
                }
            }

            pdf.save(`bulk_label_${Date.now()}.pdf`)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('An error occurred while generating the PDF. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="container mx-auto sm:p-4 p-1">
            <Button
                size="sm"
                variant="webPageBtn"
                onClick={generatePDF}
                className="mb-4 w-full hidden md:block"
                disabled={isGenerating}
            >
                {isGenerating ? 'Generating PDF...' : 'Download All Labels'}
            </Button>
            <div ref={pdfContentRef}>
                {chunkedOrders.map((orderChunk, pageIndex) => (
                    <div key={pageIndex} id={`page-${pageIndex}`} className="p-1 sm:p-4">
                        <div className="grid sm:grid-cols-2 gap-9 h-full sm:p-5 p-2">
                            {orderChunk.map((order: B2COrderType) => (
                                <div key={order._id} className="w-full p-1 sm:p-3 overflow-hidden">
                                    <InvoiceTemplate order={order} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const GenerateBulkManifest = ({ orders }: { orders: B2COrderType[] }) => {
    const { toPDF, targetRef } = usePDF({ filename: 'bulk_Manifest.pdf' });
    const groupOrderByCourierName = (orders: B2COrderType[]) => {
        const groupedOrders: { [key: string]: B2COrderType[] } = {};
        orders.forEach(order => {
            if (!order?.carrierName) return null;
            if (!groupedOrders[order?.carrierName]) {
                groupedOrders[order?.carrierName] = [];
            }
            groupedOrders[order?.carrierName].push(order);
        });
        return groupedOrders;
    }

    const groupedOrders = groupOrderByCourierName(orders)
    return (
        <>
            <Button size={"sm"} variant={"webPageBtn"} onClick={() => toPDF()} className="hidden md:block">Download Manifest</Button>
            <div ref={targetRef} className="mx-auto w-full h-full flex flex-col gap-16 p-2 sm:p-10  justify-center">
                {
                    groupedOrders && Object?.keys(groupedOrders).map((courier, index) => (
                        <div key={index} className="w-full">
                            <GenerateManifestTemplate orders={groupedOrders[courier]} sellerName={groupedOrders[courier][0].sellerDetails?.sellerName || ''} courierName={courier} />
                        </div>
                    ))
                }
            </div>
        </>
    );
};