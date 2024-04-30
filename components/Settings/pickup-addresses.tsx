'use client'
import React from 'react'
import { useSellerProvider } from '../providers/SellerProvider';
import { PickupAddressTable } from './pickup-address-table';
import { PickupAddressCol } from './pickup-address-col';

const PickupAddresses = () => {
  const { sellerFacilities } = useSellerProvider();

  return (
    <>
      <PickupAddressTable columns={PickupAddressCol} data={sellerFacilities} />
    </>
  )
}

export default PickupAddresses