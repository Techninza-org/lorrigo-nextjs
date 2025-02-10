
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
import { ArrowUpDown, ChevronDown, DownloadIcon, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { DatePickerWithRange } from "../DatePickerWithRange"
import { DateRange } from "react-day-picker"
import CsvDownloader from 'react-csv-downloader';
import { format, formatDate, parse, parseISO } from "date-fns"



export function RemittancesTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 20,
      });
    
    const searchParams = useSearchParams()
    const isShipmentVisible = searchParams.get('status') !== 'new'
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        "Shipment Details": isShipmentVisible,
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

    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableSorting: false,
        state: {
            columnFilters,
            columnVisibility,
            pagination,
            rowSelection,
        },
    })

    // formatDate(parse(row.remittanceDate, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy'),

    React.useEffect(() => {
        if ((!date?.from || !date?.to) || (date.from === date.to)) return
        const a = data.filter((row) => {
            if (date?.from && date?.to) {
                return row.remittanceDate > formatDate(date.from, 'yyyy-MM-dd') && row.remittanceDate < format(date.to, 'yyyy-MM-dd')
            }
            return false;
        });
        setFilteredData(a);
    }, [data, date]);


    const cols = [
        {
            id: "remittanceId",
            displayName: "Remittance Number"
        },
        {
            id: "remittanceDate",
            displayName: "Date"
        },
        {
            id: "BankTransactionId",
            displayName: "Bank Transaction ID"
        },
        {
            id: "remittanceStatus",
            displayName: "Status"
        },
        {
            id: "remittanceAmount",
            displayName: "Total Remittance Amount"
        }
    ]
    const datas = filteredData.map((row) => {
        return {
            remittanceId: row.remittanceId,
            remittanceDate: format(new Date(row.remittanceDate), "yyyy-MM-dd"), //formatDate(parse(row.remittanceDate, 'yyyy-MM-dd', new Date()), 'dd MM yyyy'),
            BankTransactionId: row.BankTransactionId,
            remittanceStatus: row.remittanceStatus,
            remittanceAmount: row.remittanceAmount
        }
    })

    return (
        <div className="w-full">
            <div className="grid sm:flex items-center py-4">
                <div className="grid md:flex gap-3">
                    <Input
                        placeholder="Search by Remittance Number"
                        value={(table.getColumn("remittanceId")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("remittanceId")?.setFilterValue(event.target.value)
                        }
                        className="w-64"
                    />
                    <DatePickerWithRange date={date} setDate={setDate} />
                    <CsvDownloader filename="Remittance" datas={datas} columns={cols}>
                        <Button variant={'webPageBtn'} size={'icon'}><DownloadIcon size={20} /></Button>
                    </CsvDownloader>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
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
