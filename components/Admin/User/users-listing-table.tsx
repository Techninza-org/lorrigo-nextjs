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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import CsvDownloader from 'react-csv-downloader';
import { SellerType } from "@/types/types"
import { DownloadIcon } from "lucide-react"

export function UsersListingTable({ data, columns }: { data: SellerType[], columns: ColumnDef<any, any>[] }) {
    const [filtering, setFiltering] = React.useState<string>("")
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
      )

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 20,
    });


  
    const table = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
          columnFilters,
          pagination,
          globalFilter: filtering
        },
        onGlobalFilterChange: setFiltering
      });


    const cols = [
        {
            id: "name",
            displayName: "Name"
        },
        {
            id: "email",
            displayName: "Email"
        },
        {
            id: "phone",
            displayName: "Phone"
        },
        {
            id: "companyName",
            displayName: "Company Name"
        },
        {
            id: "billingAddress",
            displayName: "Billing Address"
        },
    ]

    const datas = data.map((row) => {
        return {
            name: row.name,
            email: row.email,
            phone: row?.billingAddress?.phone,
            companyName: row?.companyProfile?.companyName,
            billingAddress: row.billingAddress?.address_line_1,
        }
    }) as any


    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Search by Name or Email"
                    value={filtering}
                    onChange={(e) => setFiltering(e.target.value)}
                    className="max-w-sm"
                />
                <CsvDownloader filename="view-shipment" datas={datas} columns={cols}>
                    <Button variant={'webPageBtn'} size={'icon'}><DownloadIcon size={20} /></Button>
                </CsvDownloader>
            </div>
            <div className="rounded-md border mt-8">
                <Table>
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} >
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
                                    data-state={row.getIsSelected()}
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