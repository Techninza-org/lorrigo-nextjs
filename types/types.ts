export type SellerType = {
    id: string;
    name: string;
    email: string;
    walletBalance?: number;
    companyName?: string;
    entityType?: string;
    address?: string;
    gstno?: string;
    panno?: string;
    margin?: number;
    vendors?: string[];
    codPrice?: number;
    isVerified: boolean;
};

export type AuthType = {
    id: string;
    email: string;
    role?: string;
    isVerified?: boolean;
};


export interface HubType {
    id?: string;
    hub_id?: number;
    sellerId?: string;
    message?: string;
    code?: number;
    isSuccess?: boolean;
    hub_details?: {
        name: string;
        pincode: number;
        city: string;
        state: string;
        address1: string;
        address2?: string;
        phone: number;
        delivery_type_id?: number;
    };
}

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
    name: string;
    pincode: number;
    city: string;
    state: string;
    address1: string;
    address2?: string;
    phone: number;
    delivery_type_id?: number;
    hub_id?: number;
    __v?: number;
}


export interface B2COrderType {
    _id: string;
    awb?: string;
    carrierName?: string;
    sellerId: string;
    orderStage?: number;
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
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface OrderType {
    valid: boolean;
    orderDetails: B2COrderType;
    courierPartner: {
        name: string;
        minWeight: number;
        charge: number;
        type?: string;
        expectedPickup: string;
        orderWeight: number;
        smartship_carrier_id: number;
        order_zone: string;
    }[];
}