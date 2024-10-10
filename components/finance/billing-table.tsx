"use client"

import * as React from "react"
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

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
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "../DatePickerWithRange"
import { DownloadIcon } from "lucide-react"
import { format } from "date-fns"
import CsvDownloader from 'react-csv-downloader';

export function BillingTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [filtering, setFiltering] = React.useState<string>("")

    const [rowSelection, setRowSelection] = React.useState({})
    const [filteredData, setFilteredData] = React.useState<any[]>(data)

    console.log(data, "data")

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

    const table = useReactTable({
        data: filteredData,
        columns,
        // onSortingChange: setSorting,
        // onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        // onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        // enableSorting: false,
        onPaginationChange: setPagination,
        state: {
            // columnFilters,
            // columnVisibility,
            pagination,
            rowSelection,
            globalFilter: filtering
        },
        onGlobalFilterChange: setFiltering
    })


    const cols = [
        {
            id: "date",
            displayName: "Date"
        },
        {
            id: "orderRefId",
            displayName: "Order ID"
        },
        {
            id: "awb",
            displayName: "AWB number"
        },
        {
            id: "rtoAwb",
            displayName: "RTO AWB"
        },
        {
            id: "shipmentType",
            displayName: "Shipment Type"
        },
        {
            id: "recipientName",
            displayName: "Recipient Name"
        },
        {
            id: "toCity",
            displayName: "Origin City"
        },
        {
            id: "fromCity",
            displayName: "Destination City"
        },
        {
            id: "chargedWeight",
            displayName: "Charged Weight"
        },
        {
            id: "billingAmount",
            displayName: "Charged Amount"
        },
        {
            id: "zone",
            displayName: "Zone"
        },
        {
            id: "isForwardApplicable",
            displayName: "Forward Applicable"
        },
        {
            id: "isRTOApplicable",
            displayName: "RTO Applicable"
        },
    ]
    // const datas = filteredData.map((row) => {
    //     return {
    //         date: format(row.billingDate, "dd/MM/yyyy"),
    //         orderRefId: row.orderRefId,
    //         awb: row.awb,
    //         rtoAwb: row.rtoAwb,
    //         shipmentType: row.shipmentType ? "COD" : "Prepaid",
    //         recipientName: row.recipientName,
    //         toCity: row.toCity,
    //         fromCity: row.fromCity,
    //         chargedWeight: row.chargedWeight,
    //         billingAmount: row.billingAmount || 0,
    //         zone: row.zone,
    //         isForwardApplicable: row.isForwardApplicable === true ? "Yes" : "No",
    //         isRTOApplicable: row.isRTOApplicable === true ? "Yes" : "No",
    //     }
    // })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Filter by AWB or Order Reference ID"
                    value={filtering}
                    onChange={(e) => setFiltering(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="w-full border rounded-md">
                <div className="relative w-full overflow-auto">
                    <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                    <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
                    <Table className="min-w-[1200px]"> {/* Adjust this value based on your needs */}
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header, index) => (
                                        <TableHead
                                            key={header.id}
                                            className={`whitespace-nowrap ${index === 0 ? 'sticky left-0 z-20 bg-white' : ''}`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
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
                                        {row.getVisibleCells().map((cell, index) => (
                                            <TableCell
                                                key={cell.id}
                                                className={`whitespace-nowrap ${index === 0 ? 'sticky left-0 z-20 bg-white' : ''}`}
                                            >
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
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    <Button variant={'outline'}>
                        Page{' '}
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </Button>
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