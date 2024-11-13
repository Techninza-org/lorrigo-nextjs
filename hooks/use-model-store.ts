import { B2BOrderType } from "@/types/B2BTypes";
import { B2COrderType, CustomerDetailsType, RemittanceType, SellerType, pickupAddressType } from "@/types/types";
import { create } from "zustand";


export type ModalType = "wallet" | "addPickupLocation" | "addSeller" | "addCustomer" | "schedulePickup" | "cancelOrder" | "cloneOrder" | "trackModal" | "editOrder" | "downloadLabel" | "downloadManifest" | "ndrOrder" | "ndrRTOrder" | "BulkHubUpload" | "BulkPincodeUpload" | 'downloadLabels'  | "BulkPickupUpdate" | 'cancelBulkOrder' | "downloadManifests" | "updateShopifyOrders" | "ViewUserDocsAdmin" | "ClientBillingUpload" | "adminRemittanceManage" | "cloneB2BOrder" | "editB2BOrder" | "addB2BCustomer" | "completeKyc" | 'downloadB2BLabel' | 'alert-kyc' | "downloadB2BManifest" | "BulkShipNow" | "B2BClientBillingUpload" | "B2BShipNow" | "raiseDisputeManage" | "disputeDetails";

interface ModalData {
  form?: any;
  customer?: CustomerDetailsType;

  // B2COrderType
  order?: B2COrderType;
  orders?: B2COrderType[];

  // B2BOrderType
  b2bOrder?: B2BOrderType;
  b2bOrders?: B2BOrderType[];

  remittance?: RemittanceType;
  seller?: SellerType;
  hub?: pickupAddressType;
  apiUrl?: string;
  query?: Record<string, any>;
  awb?: string;
  details?: any;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false })
}));