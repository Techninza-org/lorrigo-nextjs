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
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

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
import { useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"

export function VendorBillngTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
    const [page, setPage] = React.useState(1)
    const table = useReactTable({
        data,
        columns,
        // onSortingChange: setSorting,
        // onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        // onColumnVisibilityChange: setColumnVisibility,
        // onRowSelectionChange: setRowSelection,
        enableSorting: false,
        // state: {
        //     columnFilters,
        //     columnVisibility,
        //     rowSelection,
        // },
    })
    const totalPages = 5
    function incrementPage() {
        setPage(prevPage => Math.min(prevPage + 1, totalPages));
    }
    function decrementPage() {
        setPage(prevPage => Math.max(prevPage - 1, 1));
    }
    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search by order AWB no."
                    className="max-w-sm"
                />
                <Button variant={"themeButton"} type="submit" className="ml-6">Search</Button>
            </div>
            <div className="rounded-md border mt-8">
                <Table>
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-center ">
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
                </Table>
            </div>
            <div className='flex mt-10'>
                <div className='flex align-center w-1/2'>
                    <p className='grid place-content-center'>Show </p>
                    <Select>
                        <SelectTrigger className='w-[70px] mx-4'>
                            <SelectValue
                                placeholder="15"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={'15'}>15</SelectItem>
                            <SelectItem value={'20'}>20</SelectItem>
                            <SelectItem value={'25'}>25</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className='grid place-content-center'> items per page</p>
                </div>

                <div className='flex gap-x-4 justify-center h-full -ml-36'>
                    <Button variant={'themeIconBtn'} size={'icon'} onClick={decrementPage}><ChevronLeft size={28} /></Button>
                    <p className='grid place-content-center'>{page} of {totalPages} pages</p>
                    <Button variant={'themeIconBtn'} size={'icon'} onClick={incrementPage}><ChevronRight size={28} /></Button>
                </div>
            </div>
        </div>
    )
}