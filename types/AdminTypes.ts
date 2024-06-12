interface CodCharge {
    hard: number;
    percent: number;
}

interface PriceDetails {
    basePrice: number;
    incrementPrice: number;
}

export interface ShippingRate {
    _id: string;
    name: string;
    weightSlab: number;
    weightUnit: string;
    incrementWeight: number;
    type: string;
    pickupTime: string;
    codCharge: CodCharge;
    withinCity: PriceDetails;
    withinZone: PriceDetails;
    withinMetro: PriceDetails;
    withinRoi: PriceDetails;
    northEast: PriceDetails;
    isActive: boolean;
    carrierID: number;
    vendor_channel_id?: string;
    nickname?: string;
    nameWithNickname?: string;
    nameWNickname?: string;
    createdAt?: string;
    updatedAt?: string;
    __v: number;
}
