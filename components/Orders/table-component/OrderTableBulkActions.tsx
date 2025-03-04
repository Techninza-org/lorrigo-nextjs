import React, { useEffect } from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";
import { useSearchParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';

interface OrderTableBulkActionsProps<TData> {
  table: Table<TData>;
  selectedRows: any[];
  newOrders: any[];
  allPickupOrders: any[];
  onMultiLabelDownload: () => void;
  onMultiManifestDownload: () => void;
  onOpen: any;
  updateURL: any;
  pagination: any;
  date: DateRange | undefined
}

export function OrderTableBulkActions<TData>({
  table,
  selectedRows,
  newOrders,
  allPickupOrders,
  onMultiLabelDownload,
  onMultiManifestDownload,
  onOpen,
  updateURL,
  pagination,
  date
}: OrderTableBulkActionsProps<TData>) {
  const searchParams = useSearchParams();
  const isBulk = searchParams.get("b2c_order_bulk_action");

  const toggleBulk = () => {
    if (isBulk) {
      table.toggleAllRowsSelected(false);
      updateURL({
        b2c_order_bulk_action: false
      })
    } else {
      table.toggleAllRowsSelected(true);
      updateURL({
        b2c_order_bulk_action: true
      })
    }
  };

  useEffect(() => {
    if (isBulk === "true") {
      table.toggleAllRowsSelected(true);
    } else {
      table.toggleAllRowsSelected(false);
    }
  }, [isBulk, table])

  return (
    <div className="flex gap-2">
      <Button
        variant="webPageBtn"
        size="sm"
        onClick={toggleBulk}
      >
        {Boolean(isBulk) ? "Deselect All" : "Select All"} (
        {Boolean(isBulk) ? pagination.total : table.getSelectedRowModel().rows.length}/
        {pagination.total})
      </Button>

      {(Boolean(isBulk) || selectedRows.length > 0) && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn("mr-3", buttonVariants({
              variant: "webPageBtn",
              size: "sm"
            }))}
          >
            Bulk Actions
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => onOpen("updateShopifyOrders", {
                orders: (newOrders as unknown as B2COrderType[])
              })}
            >
              Update shopify orders
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onOpen("BulkPickupUpdate", { orders: selectedRows })}
            >
              Change pickup location
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("BulkShipNow", { orders: newOrders })}
            >
              Bulk Ship Now
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMultiLabelDownload}>
              Download Label
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMultiManifestDownload}>
              Download Manifest
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onOpen("bulkPickupSchedule", { orders: allPickupOrders })}
            >
              Bulk Pickup Schedule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onOpen("cancelBulkOrder", { orders: selectedRows })}
            >
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}