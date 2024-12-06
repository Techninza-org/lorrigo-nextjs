"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CsvDownloader from 'react-csv-downloader';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DownloadIcon, Upload } from "lucide-react"
import { useModal } from "@/hooks/use-model-store"

export function DisputeTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
    const [filtering, setFiltering] = React.useState<string>("")
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 20, //default page size
    });

    const table = useReactTable({
        data: data,
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

    const cols = [
        {
            id: "awb",
            displayName: "AWB"
        },
        {
            id: "chargedWeight",
            displayName: "Charged Weight"
        },
        {
            id: "clientWeight",
            displayName: "Client Weight"
        },
        {
            id: "length",
            displayName: "Length"
        },
        {
            id: "width",
            displayName: "Width"
        },
        {
            id: "height",
            displayName: "Height"
        },
        {
            id: "billingMonth",
            displayName: "Billing Month"
        },
    ]

    const datas = data.map((row) => {
        return {
            awb: row.awb,
            chargedWeight: row.chargedWeight,
            clientWeight: row.orderWeight,
            length: row.orderBoxLength,
            width: row.orderBoxWidth,
            height: row.orderBoxHeight,
            billingMonth: row.billingMonth,
        }
    })

    const { onOpen } = useModal()

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-between">
                <div className="flex gap-2">
                    <Input
                        placeholder="Filter by AWB"
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                        className="max-w-sm"
                    />
                    {/* <CsvDownloader filename="Dispute Orders" datas={datas} columns={cols}>
                        <Button variant={'webPageBtn'} size={'icon'}><DownloadIcon size={18} /></Button>
                    </CsvDownloader> */}
                </div>
                {/* <Button
                    variant="webPageBtn"
                    size="icon"
                    onClick={() => onOpen("DisputeUpload")}
                    className="flex items-center justify-center"
                > <Upload size={18} />
                </Button> */}
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
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
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