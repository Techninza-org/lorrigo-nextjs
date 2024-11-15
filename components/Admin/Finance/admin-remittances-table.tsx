"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
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
import CsvDownloader from 'react-csv-downloader';
import { DatePickerWithRange } from "@/components/DatePickerWithRange"
import { DateRange } from "react-day-picker"
import { filterData, filterRemittanceData } from "@/lib/utils"
import { format, formatISO, parse } from "date-fns"


export function RemittancesTableAdmin({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
    const defaultToDate = new Date();
    const defaultFromDate = new Date(
        defaultToDate.getFullYear(),
        defaultToDate.getMonth() - 1,
    );
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: defaultFromDate,
        to: defaultToDate,
    })
    const [filtering, setFiltering] = React.useState<string>("")
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 20, //default page size
    });


    const [filteredData, setFilteredData] = React.useState<any[]>(data)
    const filteredDataMemo = React.useMemo(() => filterRemittanceData(filteredData, filtering), [filteredData, filtering]);


    const table = useReactTable({
        data: filteredDataMemo,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
            globalFilter: filtering
        },
        onGlobalFilterChange: setFiltering
    });

    React.useEffect(() => {
        if ((!date?.from || !date?.to) || (date.from === date.to)) return
        const a = data.filter((row) => {

            if (date?.from && date?.to) {
                return parse(row?.remittanceDate, 'yyyy-MM-dd', new Date()).toISOString() > new Date(date.from).toISOString() && parse(row?.remittanceDate, 'yyyy-MM-dd', new Date()).toISOString() < new Date(date.to).toISOString()
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
            displayName: "Client Name"
        },
        {
            id: "Remittance_no",
            displayName: "Remittance Number"
        },
        {
            id: "awbs",
            displayName: "AWBs"
        },
        {
            id: "date",
            displayName: "Date"
        },
        {
            id: "txnId",
            displayName: "Bank Transaction ID"
        },
        {
            id: "Status",
            displayName: "Status"
        },
        {
            id: "TAmt",
            displayName: "Total Remittance Amount"
        },
    ]

    const datas = filteredData?.map((row) => {
        return {
            client_name: row.sellerId.name,
            Remittance_no: row.remittanceId,
            awbs: row?.orders?.map((o: any) => o.awb).join("| "),
            date: row.remittanceDate,
            txnId: row.BankTransactionId,
            Status: row.remittanceStatus,
            TAmt: row.remittanceAmount,
        }
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex gap-3">

                    <Input
                        placeholder="Search by Remittance Number or Status"
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                        className="max-w-sm"
                    />
                    <DatePickerWithRange date={date} setDate={setDate} disabledDates={{ after: new Date() }} />
                    <CsvDownloader filename="view-shipment" datas={datas} columns={cols}>
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
