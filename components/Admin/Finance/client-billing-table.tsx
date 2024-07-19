"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import CsvDownloader from 'react-csv-downloader';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useModal } from "@/hooks/use-model-store"
import { filterData, handleFileDownload } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DownloadIcon } from "lucide-react";

export function ClientBillingTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
    const [filtering, setFiltering] = React.useState<string>("")
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 20, //default page size
    });

    const defaultToDate = new Date();
    const defaultFromDate = new Date(
        defaultToDate.getFullYear(),
        defaultToDate.getMonth() - 1,
    );
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: defaultFromDate,
        to: defaultToDate,
    })

    const [filteredData, setFilteredData] = React.useState<any[]>(data)
    // Memoize filtered data to avoid unnecessary re-renders
    const filteredDataMemo = React.useMemo(() => filterData(data, filtering), [data, filtering]);


    const table = useReactTable({
        data: filteredDataMemo,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            pagination,
            rowSelection,
            globalFilter: filtering
        },
        onGlobalFilterChange: setFiltering
    });

    React.useEffect(() => {
        if ((!date?.from || !date?.to) || (date.from === date.to)) return
        const a = data.filter((row) => {
            if (date?.from && date?.to) {
                return row.order_invoice_date > new Date(date.from).toISOString() && row.order_invoice_date < new Date(date.to).toISOString()
            }
            return false;
        });
        setFilteredData(a);
    }, [data, date]);

    React.useEffect(() => {
        setFilteredData(data)
    }, [data])

    const cols = [
        {
            id: "client_name",
            displayName: "Client name"
        },
        {
            id: "orderRefId",
            displayName: "Order Reference ID"
        },
        {
            id: "awb",
            displayName: "AWB"
        },
        {
            id: "rtoAwb",
            displayName: "RTO AWB"
        },
        {
            id: "shipmentStatus",
            displayName: "Shipment Status"
        },
        {
            id: "recipientName",
            displayName: "Recipient Name"
        },
        {
            id: "origin",
            displayName: "Origin"
        },
        {
            id: "destination",
            displayName: "Destination"
        },
        {
            id: "vendorNickName",
            displayName: "Vendor Nick Name"
        },
        {
            id: "zone",
            displayName: "Zone"
        },
        {
            id: "chargedWeight",
            displayName: "Charged Weight"
        }
    ]

    const datas = filteredData.map((row) => {
        return {
            client_name: row.sellerId.name,
            orderRefId: row.orderRefId,
            awb: row.awb,
            rtoAwb: row.rtoAwb,
            orderCreationDate: row.billingDate,
            shipmentStatus: row.shipmentType ? "COD" : "Prepaid",
            recipientName: row.recipientName,
            origin: row.fromCity,
            destination: row.toCity,
            vendorNickName: row.vendorNickName,
            zone: row.zone,
            chargedWeight: row.chargedWeight + "kg",
        }
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-between">
                <div className="flex gap-3">

                    <Input
                        placeholder="Filter by AWB or Order Reference ID"
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                        className="max-w-sm"
                    />
                    <DatePickerWithRange date={date} setDate={setDate} disabledDates={{ after: new Date() }} />
                    <CsvDownloader filename="client-billing" datas={datas} columns={cols}>
                        <Button variant={'webPageBtn'} size={'icon'}><DownloadIcon size={20} /></Button>
                    </CsvDownloader>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}