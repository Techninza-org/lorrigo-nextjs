'use client'
import { useSellerProvider } from '@/components/providers/SellerProvider';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { AdminAwbTable } from './admin-awb-table';
import { AdminAwbCols } from './admin-awb-cols';
import { useAdminProvider } from '@/components/providers/AdminProvider';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import CsvDownloader from 'react-csv-downloader';

export default function AdminAwb() {
    const { id } = useParams<{ id: string }>();
    const { getInvoiceAwbTransactionsAdmin } = useAdminProvider();
    const [datas, setDatas] = useState([]);

    function getData(): ReturnType<() => void> {
        getInvoiceAwbTransactionsAdmin(id)
            .then((response: any) => {
                if (response) {
                    const formattedData = response.map((item: any) => ({
                        awb: item.awb,
                        forwardCharges: item.forwardCharges,
                        rtoCharges: item.rtoCharges,
                        codCharges: item.codCharges,
                        total: item.total,
                    }));
                    console.log(formattedData, 'formattedData');

                    setDatas(formattedData);
                } else {
                    console.error("Invalid response format:", response);
                }

            })
            .catch((error: any) => {
                console.error("Error fetching AWB transactions:", error);
            });
    };

    useEffect(() => {
        getData()
        return () => getData()
    }, [])
    return (
        <div>
            <div className='flex justify-end'>
                <DownloadCsv id={id} />
            </div>
            <AdminAwbTable data={datas} columns={AdminAwbCols} />
        </div>
    )
}


const DownloadCsv = ({ id }: { id: any }) => {
    const { getInvoiceAwbTransactionsAdmin } = useAdminProvider();
    const [datas, setDatas] = useState([]);
    const cols = [
        { id: "awb", displayName: "AWB" },
        { id: "forwardCharges", displayName: "Forward Charges" },
        { id: "rtoCharges", displayName: "RTO Charges" },
        { id: "codCharges", displayName: "COD Charges" },
        // { id: "excessCharges", displayName: "Excess Wt. Charges" },
        { id: "total", displayName: "Total" },
    ];

    function getData(): ReturnType<() => void> {
        getInvoiceAwbTransactionsAdmin(id)
            .then((response: any) => {
                if (response) {
                    const formattedData = response.map((item: any) => ({
                        awb: item.awb,
                        forwardCharges: item.forwardCharges,
                        rtoCharges: item.rtoCharges,
                        codCharges: item.codCharges,
                        // excessCharges: item.excessCharges,
                        total: item.total,
                    }));
                    console.log(formattedData, 'formattedData');

                    setDatas(formattedData);
                } else {
                    console.error("Invalid response format:", response);
                }

            })
            .catch((error: any) => {
                console.error("Error fetching AWB transactions:", error);
            });
    };

    useEffect(() => {
        getData()
        return () => getData()
    }, [])

    return (
        <CsvDownloader filename="AwbTransacs" datas={datas} columns={cols}>
            <Button variant={'themeButton'} onClick={getData}>
                <DownloadIcon size={18} />
            </Button>
        </CsvDownloader>
    );
};