import React from 'react';
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

interface OrderTableBulkActionsProps<TData> {
  table: Table<TData>;
  selectedRows: any[];
  newOrders: any[];
  allPickupOrders: any[];
  onMultiLabelDownload: () => void;
  onMultiManifestDownload: () => void;
  onOpen: any;
}

export function OrderTableBulkActions<TData>({
  table,
  selectedRows,
  newOrders,
  allPickupOrders,
  onMultiLabelDownload,
  onMultiManifestDownload,
  onOpen
}: OrderTableBulkActionsProps<TData>) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="webPageBtn" 
        size="sm" 
        onClick={() => table.toggleAllRowsSelected()}
      >
        {table.getIsAllRowsSelected() ? "Deselect All" : "Select All"} (
        {table.getSelectedRowModel().rows.length}/
        {table.getRowModel().rows.length})
      </Button>
      
      {selectedRows.length > 0 && (
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
              Update shopify orders ({newOrders.length})
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
              Bulk Ship Now ({newOrders.length})
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
              Bulk Pickup Schedule ({allPickupOrders.length})
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