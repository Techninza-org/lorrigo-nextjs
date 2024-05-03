import { B2COrderType, CustomerDetailsType, SellerType, pickupAddressType } from "@/types/types";
import { create } from "zustand";


export type ModalType = "wallet" | "addPickupLocation" | "addSeller" | "addCustomer" | "schedulePickup" | "cancelOrder" | "cloneOrder" | "trackModal" | "editOrder" | "downloadLabel" | "downloadManifest" | "ndrOrder" | "ndrRTOrder";
interface ModalData {
  form?: any;
  customer?: CustomerDetailsType;
  order?: B2COrderType;
  seller?: SellerType;
  hub?: pickupAddressType;
  apiUrl?: string;
  query?: Record<string, any>;
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