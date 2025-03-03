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
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useSellerProvider } from "../providers/SellerProvider";
import { format } from "date-fns";
import { PDFDocument } from "pdf-lib";
import { Progress } from "../ui/progress";
import { toast } from "../ui/use-toast";


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
    const LABELS_PER_PAGE = 4;
    const ORDERS_PER_PDF = 500;
    const BATCH_SIZE = 5; // Process 5 pages at a time
    
    const pdfContentRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentBatch, setCurrentBatch] = useState<B2COrderType[][]>([]);
    const [pdfBatchIndex, setPdfBatchIndex] = useState(0);
    const [batchIndex, setBatchIndex] = useState(0);
    const [processingMessage, setProcessingMessage] = useState("");
  
    // Split orders into PDFs of 500 orders each
    const splitOrdersIntoPdfBatches = (allOrders: B2COrderType[]) => {
      const pdfBatches = [];
      for (let i = 0; i < allOrders.length; i += ORDERS_PER_PDF) {
        pdfBatches.push(allOrders.slice(i, i + ORDERS_PER_PDF));
      }
      return pdfBatches;
    };
  
    // Split orders into chunks for pages
    const chunkArray = (array: B2COrderType[], size: number) => {
      const chunkedArray = [];
      for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
      }
      return chunkedArray;
    };
  
    // Get all PDF batches
    const pdfBatches = splitOrdersIntoPdfBatches(orders);
    
    // Get current PDF batch
    const getCurrentPdfBatch = () => {
      return pdfBatchIndex < pdfBatches.length ? pdfBatches[pdfBatchIndex] : [];
    };
    
    // Split the current PDF batch into pages
    const getCurrentPdfPages = () => {
      return chunkArray(getCurrentPdfBatch(), LABELS_PER_PAGE);
    };
    
    // Split the pages into processing batches
    const getProcessingBatches = () => {
      const allPages = getCurrentPdfPages();
      const batches = [];
      for (let i = 0; i < allPages.length; i += BATCH_SIZE) {
        batches.push(allPages.slice(i, i + BATCH_SIZE));
      }
      return batches;
    };
    
    const processingBatches = getProcessingBatches();
    
    // Set the current batch of orders to render
    useEffect(() => {
      if (isGenerating && batchIndex < processingBatches.length) {
        setCurrentBatch(processingBatches[batchIndex]);
      } else if (!isGenerating) {
        // Only show first few orders when not generating
        const previewOrders = orders.slice(0, LABELS_PER_PAGE);
        setCurrentBatch([previewOrders]);
      }
    }, [isGenerating, batchIndex, processingBatches, pdfBatchIndex, orders]);
  
    const generateSinglePDF = async () => {
      if (!pdfContentRef.current) return false;
      
      try {
        const currentBatchOrders = getCurrentPdfBatch();
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        let pageCount = 0;
        
        // Process each batch within the current PDF
        for (let batchIdx = 0; batchIdx < processingBatches.length; batchIdx++) {
          setBatchIndex(batchIdx);
          setCurrentBatch(processingBatches[batchIdx]);
          
          // Allow UI to update
          await new Promise(resolve => setTimeout(resolve, 10));
          
          // Process each page in the current batch
          for (let pageIdx = 0; pageIdx < processingBatches[batchIdx].length; pageIdx++) {
            const pageElement = document.getElementById(`page-${pageIdx}`);
            
            if (pageElement) {
              try {
                const canvas = await html2canvas(pageElement, {
                  scale: 1.5,
                  logging: false,
                  useCORS: true,
                  allowTaint: true,
                });
                
                const imgData = canvas.toDataURL('image/jpeg', 0.8);
                
                if (pageCount > 0) pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                
                pageCount++;
                
                // Free up memory
                canvas.remove();
              } catch (error) {
                console.error(`Error processing page ${pageCount}:`, error);
                // Continue with next page
              }
            }
          }
          
          // Update progress within current PDF
          const batchProgress = ((batchIdx + 1) / processingBatches.length) * 100;
          const pdfProgress = Math.round(
            ((pdfBatchIndex * 100) + batchProgress) / pdfBatches.length
          );
          setProgress(pdfProgress);
          
          // Allow GC to run between batches
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Save the current PDF
        const startIndex = pdfBatchIndex * ORDERS_PER_PDF;
        const endIndex = Math.min(startIndex + ORDERS_PER_PDF, orders.length);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        
        pdf.save(`Invoice_Batch_${pdfBatchIndex + 1}_Orders_${startIndex + 1}-${endIndex}_${timestamp}.pdf`);
        
        return true;
      } catch (error) {
        console.error('Error generating PDF batch:', error);
        return false;
      }
    };
  
    const generateAllPDFs = async () => {
      if (!pdfContentRef.current) return;
      
      try {
        setIsGenerating(true);
        setProgress(0);
        setPdfBatchIndex(0);
        setBatchIndex(0);
        
        const totalPDFs = pdfBatches.length;
        
        for (let pdfIdx = 0; pdfIdx < totalPDFs; pdfIdx++) {
          setPdfBatchIndex(pdfIdx);
          setBatchIndex(0);
          
          const startIndex = pdfIdx * ORDERS_PER_PDF;
          const endIndex = Math.min(startIndex + ORDERS_PER_PDF, orders.length);
          
          setProcessingMessage(
            `Processing PDF ${pdfIdx + 1} of ${totalPDFs} (Orders ${startIndex + 1}-${endIndex})`
          );
          
          // Allow UI to update
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const success = await generateSinglePDF();
          
          if (!success) {
            toast({
              variant: "destructive",
              title: "Error generating PDF",
              description: `Failed to generate PDF batch ${pdfIdx + 1}. Please try again.`,
            });
            break;
          }
          
          toast({
            title: "PDF Generated",
            description: `Batch ${pdfIdx + 1} of ${totalPDFs} completed (Orders ${startIndex + 1}-${endIndex})`,
          });
          
          // Give browser some time to recover between PDF generations
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        toast({
          title: "All PDFs Generated",
          description: `Successfully generated ${totalPDFs} PDF files with ${orders.length} orders`,
        });
      } catch (error) {
        console.error('Error in PDF generation process:', error);
        toast({
          variant: "destructive",
          title: "Process Error",
          description: "An error occurred during the PDF generation process.",
        });
      } finally {
        setIsGenerating(false);
        setProcessingMessage("");
        // Reset to show preview
        const previewOrders = orders.slice(0, LABELS_PER_PAGE);
        setCurrentBatch([previewOrders]);
      }
    };
  
    return (
      <div className="container mx-auto sm:p-4 p-1">
        <div className="flex flex-col gap-4 mb-4">
          <Button
            size="sm"
            variant="webPageBtn"
            onClick={generateAllPDFs}
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating 
              ? 'Generating PDFs...' 
              : `Download All Labels (${orders.length} orders in ${pdfBatches.length} PDFs)`}
          </Button>
          
          {isGenerating && (
            <div className="w-full space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-center">
                {processingMessage} - {progress}% overall
              </p>
              <p className="text-xs text-center">
                Processing batch {batchIndex + 1} of {processingBatches.length}
              </p>
            </div>
          )}
          
          {orders.length > 500 && !isGenerating && (
            <p className="text-xs text-amber-600">
              Note: Your {orders.length} orders will be split into {pdfBatches.length} separate PDF files with 500 orders each.
            </p>
          )}
        </div>
        
        <div ref={pdfContentRef} className="pdf-content">
          {currentBatch.map((orderChunk, pageIndex) => (
            <div
              key={`batch-${batchIndex}-page-${pageIndex}`}
              id={`page-${pageIndex}`}
              className="p-1 sm:p-4 min-h-[500px] flex flex-col justify-start page-break-after-always"
            >
              <div className="grid sm:grid-cols-2 grid-rows-2 gap-9 h-full sm:p-5 p-2 place-items-start">
                {orderChunk.map((order: B2COrderType) => (
                  <div key={order._id} className="w-full p-1 sm:p-3 overflow-hidden text-sm">
                    <InvoiceTemplate order={order} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};


// Main component with optimized PDF generation
export const GenerateBulkManifest = ({ orders }: { orders: B2COrderType[] }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const pdfRef = useRef<HTMLDivElement>(null);

    // Group orders by courier
    const groupOrderByCourierName = useCallback((orders: B2COrderType[]) => {
        const groupedOrders: { [key: string]: B2COrderType[] } = {};

        orders.forEach(order => {
            if (!order?.carrierName) return;

            const key = order.carrierName;
            if (!groupedOrders[key]) {
                groupedOrders[key] = [];
            }
            groupedOrders[key].push(order);
        });

        return groupedOrders;
    }, []);

    // Function to generate PDF from an HTML element
    const generatePDFFromElement = async (element: HTMLElement): Promise<Uint8Array> => {
        // Create a canvas from the element
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        // Convert canvas to image
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // Create a new PDF with proper dimensions
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Calculate dimensions to fit the page
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add the image to the PDF
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

        // Convert to ArrayBuffer
        const pdfArrayBuffer = pdf.output('arraybuffer');

        // Return as Uint8Array for pdf-lib
        return new Uint8Array(pdfArrayBuffer);
    };

    // Function to merge multiple PDFs into one
    const mergePDFs = async (pdfDataArray: Uint8Array[]): Promise<Blob> => {
        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        // Loop through each PDF data and add pages to merged document
        for (let i = 0; i < pdfDataArray.length; i++) {
            try {
                // Load the PDF from Uint8Array
                const pdf = await PDFDocument.load(pdfDataArray[i]);

                // Copy all pages from the current PDF to the merged PDF
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            } catch (error) {
                console.error(`Error adding PDF at index ${i}:`, error);
                // Continue with the rest of the PDFs instead of failing completely
            }
        }

        // Save the merged PDF
        const mergedPdfBytes = await mergedPdf.save();

        // Return as Blob
        return new Blob([mergedPdfBytes], { type: 'application/pdf' });
    };

    // Generate PDF in chunks to prevent browser freezing
    const generatePDFInChunks = useCallback(async () => {
        if (!orders || orders.length === 0 || !pdfRef.current) return;

        setIsGenerating(true);
        setProgress(0);

        try {
            const groupedOrders = groupOrderByCourierName(orders);
            const courierNames = Object.keys(groupedOrders);
            const totalCouriers = courierNames.length;

            // Using a smaller chunk size for better performance
            const ORDERS_PER_PAGE = 50; // 50 orders per page for readability
            let totalChunks = 0;
            let processedChunks = 0;

            // First pass to calculate total number of chunks for progress tracking
            courierNames.forEach(courier => {
                const courierOrders = groupedOrders[courier] || [];
                const orderChunks = chunkArray(courierOrders, ORDERS_PER_PAGE);
                totalChunks += orderChunks.length;
            });

            // For each courier, generate PDFs in chunks
            const allPdfData: Uint8Array[] = [];

            for (const courier of courierNames) {
                const courierOrders = groupedOrders[courier] || [];
                if (courierOrders.length === 0) continue;

                const orderChunks = chunkArray(courierOrders, ORDERS_PER_PAGE);
                const sellerName = courierOrders[0]?.sellerDetails?.sellerName || '';

                for (let i = 0; i < orderChunks.length; i++) {
                    const chunk = orderChunks[i];
                    const manifestId = `MANIFEST-${courier}-${i + 1}`;

                    // Clear previous content
                    pdfRef.current.innerHTML = '';

                    // Create a new div for the manifest
                    const manifestElement = document.createElement('div');
                    manifestElement.className = 'manifest-container';
                    pdfRef.current.appendChild(manifestElement);

                    const root = createRoot(manifestElement);
                    root.render(
                        <GenerateManifestTemplate
                            orders={chunk}
                            sellerName={sellerName}
                            courierName={courier}
                            manifestId={manifestId}
                        />
                    );

                    // Wait for all images and barcodes to load
                    await new Promise(resolve => setTimeout(resolve, 200));

                    // Generate PDF for this chunk
                    const pdfData = await generatePDFFromElement(manifestElement);
                    allPdfData.push(pdfData);

                    // Update progress
                    processedChunks++;
                    setProgress(Math.floor((processedChunks / totalChunks) * 100));

                    // Give the browser a chance to breathe
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }

            // Merge all PDFs
            setProgress(95);
            const finalPdf = await mergePDFs(allPdfData);

            // Create a download link
            const pdfUrl = URL.createObjectURL(finalPdf);

            // Trigger download
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `bulk_manifest_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
            link.click();

            // Clean up the URL
            setTimeout(() => {
                URL.revokeObjectURL(pdfUrl);
            }, 100);

            setProgress(100);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('An error occurred while generating the PDF. Please try again with fewer orders.');
        } finally {
            setIsGenerating(false);
            // Clean up - remove all rendered elements
            if (pdfRef.current) {
                pdfRef.current.innerHTML = '';
            }
        }
    }, [orders, groupOrderByCourierName]);

    // Alternative lightweight viewer for large order sets
    const renderPreview = () => {
        const groupedOrders = groupOrderByCourierName(orders);
        const courierNames = Object.keys(groupedOrders);

        // Only show first 5 orders per courier in preview
        return courierNames.map((courier, idx) => {
            const previewOrders = groupedOrders[courier].slice(0, 5);
            const totalOrders = groupedOrders[courier].length;
            const sellerName = previewOrders[0]?.sellerDetails?.sellerName || '';

            return (
                <div key={idx} className="mb-8">
                    <div className="text-sm text-gray-500 mb-2">
                        Preview showing 5/{totalOrders} orders for {courier}
                    </div>
                    <GenerateManifestTemplate
                        orders={previewOrders}
                        sellerName={sellerName}
                        courierName={courier}
                        manifestId={`MANIFEST-${courier}-PREVIEW`}
                    />
                </div>
            );
        });
    };

    return (
        <div className="w-full">
            <div className="flex gap-4 mb-4">
                <Button
                    size="sm"
                    variant="webPageBtn"
                    onClick={generatePDFInChunks}
                    disabled={isGenerating}
                    className="hidden md:flex items-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <Loader className="animate-spin" size={16} />
                            Generating PDF ({progress}%)
                        </>
                    ) : (
                        'Download Manifest'
                    )}
                </Button>

                {orders.length > 1000 && !isGenerating && (
                    <div className="text-amber-600 text-sm">
                        Warning: Generating PDF for {orders.length.toLocaleString()} orders may take some time.
                    </div>
                )}
            </div>

            {/* Hidden div for PDF generation - positioned off-screen */}
            <div
                ref={pdfRef}
                className="fixed top-0 left-0 opacity-0 pointer-events-none"
                style={{ width: '210mm', height: '297mm', zIndex: -1000 }}
            ></div>

            {/* Preview section */}
            <div className="mx-auto w-full h-full flex flex-col gap-8 p-2 sm:p-10 justify-center">
                {!isGenerating && renderPreview()}

                {isGenerating && (
                    <div className="flex flex-col items-center justify-center p-10">
                        <Loader className="animate-spin mb-4" size={40} />
                        <div className="text-lg font-semibold">Generating PDF ({progress}%)</div>
                        <div className="text-sm text-gray-500 mt-2">
                            Please wait while we process {orders.length.toLocaleString()} orders...
                        </div>
                        <div className="w-full max-w-md h-2 bg-gray-200 rounded-full mt-4">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};