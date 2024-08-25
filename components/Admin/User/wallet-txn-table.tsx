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
import { ChevronDown, DownloadIcon } from "lucide-react"
import CsvDownloader from 'react-csv-downloader';

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
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/DatePickerWithRange"
import { format, formatDate } from "date-fns";
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { useAuth } from "@/components/providers/AuthProvider";

export function WalletTxnTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const { getAllWalletTxn } = useAdminProvider();
    const { userToken } = useAuth();

    const [filtering, setFiltering] = React.useState<string>("");
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const defaultToDate = new Date();
    const defaultFromDate = new Date();
    defaultFromDate.setDate(defaultToDate.getDate() - 2);

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: defaultFromDate,
        to: defaultToDate,
    });

    const table = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            columnFilters,
            pagination,
            rowSelection,
            globalFilter: filtering
        },
        onGlobalFilterChange: setFiltering,
    });

    const cols = [
        {
            id: 'dateTime',
            displayName: 'Date Time'
        },
        {
            id: 'txnId',
            displayName: 'Txn ID'
        },
        {
            id: 'clientName',
            displayName: 'Client'
        },
        {
            id: 'status',
            displayName: 'Status'
        },
        {
            id: 'amount',
            displayName: 'Amount'
        },
        {
            id: 'desc',
            displayName: 'Description'
        }
    ]

    const datas = data.map((row: any) => {
        const stage = row?.stage[row?.stage?.length - 1];
        const { dateTime } = stage;
        return {
            dateTime: format(new Date(dateTime), 'dd-MM-yyyy hh:mm:ss a'),
            txnId: row?.merchantTransactionId,
            clientName: row?.sellerId.name,
            status: row?.code,
            amount: row?.amount,
            desc: row?.desc,
        }
    })

    React.useEffect(() => {

        if (date?.from && date?.to) getAllWalletTxn({ fromDate: formatDate(date?.from.toString(), "MM/dd/yyyy"), toDate: formatDate(date?.to.toString(), "MM/dd/yyyy") })

    }, [userToken, date]);

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex gap-3">
                    <Input
                        placeholder="Filter by Txn ID, Payment Method, AWB"
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                        className="w-64"
                    />
                    <DatePickerWithRange date={date} setDate={setDate} disabledDates={{ after: new Date() }} />
                    <CsvDownloader filename="wallet-txn" datas={datas} columns={cols}>
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
