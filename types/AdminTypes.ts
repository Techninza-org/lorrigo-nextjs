interface CodCharge {
    hard: number;
    percent: number;
}

interface PriceDetails {
    basePrice: number;
    incrementPrice: number;
    isRTOSameAsFW: boolean;
    flatRTOCharge: number;

    rtoBasePrice: number;
    rtoIncrementPrice: number;
}

export interface ShippingRate {
    _id: string;
    name: string;
    weightSlab: number;
    weightUnit: string;
    incrementWeight: number;
    type: string;
    pickupTime: string;
    isFwdDeduct: boolean;
    isRtoDeduct: boolean;
    isCodDeduct: boolean;
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


interface ZoneMatrix {
    [zone: string]: {
        [destinationZone: string]: number;
    };
}

export interface ShippinB2BgRate {
    _id: string;
    name: string;
    baseFreight: number;
    fuelSurcharge: number;
    ODACharge: number;
    docketCharge: number;
    type: string;
    pickupTime: string;
    carrierID: number;
    isActive: boolean;
    isReversedCourier: boolean;
    zoneMatrix: ZoneMatrix;
    createdAt: string;
    updatedAt: string;
    greenTax: number;
    foPercentage: string;
    foValue: number;
    nameWithNickname?: string;
    __v: number;
}

