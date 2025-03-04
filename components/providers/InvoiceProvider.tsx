"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { saveAs } from 'file-saver';
import { useSellerProvider } from './SellerProvider';

// Types for our context
type InvoiceContextType = {
   downloadInvoices: (orderIds?: string[]) => Promise<void>;
   isDownloading: boolean;
   downloadError: string | null;
   downloadSuccess: boolean;
   resetDownloadState: () => void;
};

// Create the context with a default value
const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// Provider props type
type InvoiceProviderProps = {
   children: ReactNode;
   //   generateBulkInvoices: (orderIds?: string[]) => Promise<any>;
};

// Provider component
export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({
   children,
   //   generateBulkInvoices 
}) => {
   const { generateBulkInvoices } = useSellerProvider()
   const [isDownloading, setIsDownloading] = useState(false);
   const [downloadError, setDownloadError] = useState<string | null>(null);
   const [downloadSuccess, setDownloadSuccess] = useState(false);

   const resetDownloadState = () => {
      setDownloadError(null);
      setDownloadSuccess(false);
   };

   const downloadInvoices = async (orderIds?: string[]) => {
      setIsDownloading(true);
      setDownloadError(null);
      setDownloadSuccess(false);

      try {
         // Call the function from your existing provider
         const result = await generateBulkInvoices(orderIds);

         if (!result.success) {
            throw new Error(result.error || 'Failed to generate invoices');
         }

         if (result.singlePdf) {
            // Download single PDF
            const blob = new Blob([result.pdfBuffer], { type: 'application/pdf' });
            saveAs(blob, result.filename);
         } else {
            // Download multiple PDFs
            if (!result.pdfs || result.pdfs.length === 0) {
               throw new Error('No invoices were generated');
            }

            // Use Promise.all with setTimeout to handle multiple downloads
            await Promise.all(
               result.pdfs.map((pdf: any, index: number) =>
                  new Promise<void>(resolve => {
                     setTimeout(() => {
                        const blob = new Blob([pdf.pdfBuffer], { type: 'application/pdf' });
                        saveAs(blob, pdf.filename);
                        resolve();
                     }, index * 800); // Slightly faster delay between downloads
                  })
               )
            );
         }

         setDownloadSuccess(true);
      } catch (error: any) {
         console.error('Download error:', error);
         setDownloadError(error.message || 'Failed to download invoices');
         setDownloadSuccess(false);
      } finally {
         setIsDownloading(false);
      }
   };

   const value = {
      downloadInvoices,
      isDownloading,
      downloadError,
      downloadSuccess,
      resetDownloadState
   };

   return (
      <InvoiceContext.Provider value={value}>
         {children}
      </InvoiceContext.Provider>
   );
};

// Custom hook to use the invoice context
export const useInvoices = () => {
   const context = useContext(InvoiceContext);
   if (context === undefined) {
      throw new Error('useInvoices must be used within an InvoiceProvider');
   }
   return context;
};