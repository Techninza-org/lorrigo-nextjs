"use client"

import { useEffect, useState } from "react";
import { RechargeModal } from "../modal/recharge-modal";
import { AddCustomerModal } from "../modal/add-customer-modal";
import { AddSellerModal } from "../modal/add-seller-modal";
import { AddPickupLocationModal } from "../modal/add-pickup-location";
import { SchedulePickupModal } from "../modal/schedule-pickup-modal";
import { DownloadB2BLableModal, DownloadLableModal } from "../modal/download-label-modal";
import { DownloadB2BManifestModal, DownloadManifestModal } from "../modal/download-manifest-modal";
import { CancelOrderDialog } from "../Orders/cancel-order-dialog";
import { NDROrderDialog, NDRRTODialog } from "../Orders/ndr-order-dialog";
import { BulkHubUploadModal } from "../modal/bulk-hub-upload-modal";
import { BulkPincodeUploadModal } from "../modal/bulk-pincode-upload-modal";
import { BulkPickupUpdateModal } from "../modal/bulk-pickup-update-modal";
import { CancelBulkOrderDialog } from "../Orders/cancel-bulk-order-dialog";
import { BulkUpdateShopifyModal } from "../modal/bulk-update-shopify-modal";
import { ViewUserDocsModal } from "../modal/admin/view-user-docs-modal";
import { ClientBillingUploadModal } from "../modal/admin/upload-client-billing-modal";
import { AdminRemittanceUpdateModal } from "../modal/admin/remittance-manage-modal";
import { AddB2BCustomerModal } from "../Orders/b2b/b2b-customer-form";
import { AlertKycModal } from "../modal/alert-kyc-modal";
import { BulkShipNowModal } from "../modal/bulk-ship-now-modal";
import { B2BClientBillingUpload } from "../modal/admin/upload-b2b-client-billing-modal";
import { B2BShipNowModal } from "../modal/b2b-ship-now-modal";

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
      <AddPickupLocationModal />
      <SchedulePickupModal />
      <DownloadLableModal />
      <DownloadB2BLableModal />

      <DownloadManifestModal />
      <CancelOrderDialog />

      <NDROrderDialog />
      <NDRRTODialog />

      <BulkHubUploadModal />
      <BulkPincodeUploadModal />
      <BulkPickupUpdateModal/>
      <BulkShipNowModal/>
      <CancelBulkOrderDialog/>
      <BulkUpdateShopifyModal/>

      <ViewUserDocsModal/>
      <ClientBillingUploadModal/>
      <AdminRemittanceUpdateModal/>
      <AddB2BCustomerModal/>
      <AlertKycModal/>

      <DownloadB2BManifestModal />
      <B2BClientBillingUpload/>
      <B2BShipNowModal/>

    </>
  );
};
