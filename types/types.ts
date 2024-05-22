export type AuthType = {
  token: string;
  isVerified?: boolean;
  id: string;
  name: string;
  email: string;
  role?: "admin" | "seller";
};

export type SellerType = {
  id: string;
  name: string;
  email: string;
  walletBalance?: number;
  companyProfile: {
    companyName?: string;
    companyEmail?: string;
    companyId?: string;
    website?: string;
    companyLogo?: string;
  };
  address?: string;
  // below feild need to remove
  gst?: string;
  pan?: string;
  aadhar?: string;

  prefix?: string;
  margin?: number;
  vendors?: string[];
  codPrice?: number;
  isVerified: boolean;
  isActive: boolean;
  bankDetails: {
    accHolderName?: string;
    accType?: string;
    accNumber?: string;
    ifscNumber?: string;
  };
  gstInvoice: {
    gstin?: string;
    deductTDS?: string;
    tan?: string;
  };
  kycDetails: {
    businessType?: string;
    photoUrl?: string;
    pan?: string;
    adhaar?: string;

    document1Type?: string;
    document1Feild?: string;
    document1Front?: string;
    document1Back?: string;

    document2Type?: string;
    document2Feild?: string;
    document2Front?: string;
    document2Back?: string;

    submitted?: boolean;
    verified?: boolean;
  };
  billingAddress: {
    address_line_1: string;
    address_line_2: string;
    pincode: string;
    city: string;
    state: string;
    phone: string;
  },
  channelPartners: [
    {
      _id: string;
      channelName: string;
      isOrderSync: boolean;
      storeUrl: string;
      apiKey: string;
      apiSk: string;
      sharedSecret: string;
    }
  ];
};

export interface ProductDetailsType {
  _id: string;
  name: string;
  category: string;
  hsn_code: string;
  quantity: string;
  tax_rate: string;
  taxable_value: string;
  __v?: number;
}

export interface CustomerDetailsType {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode: number;
}

export interface pickupAddressType {
  _id: string;
  sellerId: string;
  isPrimary: boolean;
  isActive: boolean
  name: string;
  pincode: number;
  email: string;
  contactPersonName: string;
  city: string;
  state: string;
  address1: string;
  address2?: string;
  isRTOAddressSame?: boolean;
  rtoAddress?: string;
  rtoCity?: string;
  rtoState?: string;
  rtoPincode?: number;
  phone: number;
  delivery_type_id?: number;
  hub_id?: number;
  __v?: number;
}

export interface SellerDetailsType {
  sellerName: string;
  sellerGSTIN?: string;
  sellerAddress?: string;
  isSellerAddressAdded?: boolean;
  sellerPincode?: string;
  sellerCity?: string;
  sellerState?: string;
  sellerPhone?: number;
}

export interface B2COrderType {
  _id: string;
  awb?: string;
  channelName: string;
  carrierName?: string;
  sellerId: string;
  bucket?: number;
  orderStages?: {
    stage: number;
    stageDateTime: string;
    action: string;
    _id?: string;
  }[];
  pickupAddress: pickupAddressType;
  productId?: ProductDetailsType;
  order_reference_id?: string;
  payment_mode?: number;
  order_invoice_date?: string;
  order_invoice_number?: string;
  isContainFragileItem?: boolean;
  numberOfBoxes?: number;
  orderBoxHeight?: number;
  orderBoxWidth?: number;
  orderBoxLength?: number;
  orderSizeUnit?: string;
  orderWeight?: number;
  orderWeightUnit?: string;
  amount2Collect?: number;
  ewaybill?: number;
  customerDetails?: CustomerDetailsType;
  sellerDetails?: SellerDetailsType;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Order Response
export interface OrderType {
  valid: boolean;
  orderDetails: B2COrderType;
  courierPartner: {
    name: string;
    nickName: string;
    minWeight: number;
    charge: number;
    type?: string;
    expectedPickup: string;
    orderWeight: number;
    carrierID: number;
    order_zone: string;
  }[];
}

export interface RemittanceType {
  _id: string;
  remittanceId: string;
  remittanceDate: string;
  remittanceAmount: number;
  remittanceStatus: string;
  orders: B2COrderType[];
  BankTransactionId: string;
  sellerId: SellerType;
}


// Admin Types Started
export interface AdminType {
  partner?: string;
  upload_sheet?: string;
  name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  phone?: string;
  company?: string;
  prefix?: string;
  pan?: string;
  aadhar?: string;
  gstin?: string;
}

// export interface RemittanceTypeAdmin {
//   _id: string;
//   remittanceId: string;
//   remittanceDate: string;
//   remittanceAmount: number;
//   remittanceStatus: string;
//   orders: B2COrderType[];
//   BankTransactionId: string;
//   sellerId: SellerType;
// }
