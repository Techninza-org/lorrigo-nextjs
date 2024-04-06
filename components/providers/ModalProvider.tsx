"use client"

import { useEffect, useState } from "react";
import { RechargeModal } from "../modal/recharge-modal";
import { AddCustomerModal } from "../modal/add-customer-modal";
import { AddSellerModal } from "../modal/add-seller-modal";
import { AddPickupLocationModal } from "../modal/add-pickup-location";
import { SchedulePickupModal } from "../modal/schedule-pickup-modal";
import { TrackOrderStatusModal } from "../modal/track-order-status-modal";
import { DownloadLableModal } from "../modal/download-label-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) return null;
  
    return (
      <>
        <RechargeModal />
        <AddCustomerModal />
        <AddSellerModal />
        <AddPickupLocationModal/>
        <SchedulePickupModal />
        <TrackOrderStatusModal/>
        <DownloadLableModal/>
        
      </>
    );
  };
  