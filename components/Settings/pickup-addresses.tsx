'use client'
import React, { useEffect, useState } from 'react'
import { useSellerProvider } from '../providers/SellerProvider';
import { PickupAddressTable } from './pickup-address-table';
import { PickupAddressCol } from './pickup-address-col';
import { pickupAddressType } from '@/types/types';
import { useAuth } from '../providers/AuthProvider';

const PickupAddresses = () => {
  const { getHub } = useSellerProvider();
  const { userToken } = useAuth()
  const [sellerAllFacilites, setAllFacilities] = useState<pickupAddressType[]>([])

  useEffect(() => {
    async function getSellerAllFacilites() {
      const facilties = await getHub("all")
      setAllFacilities(facilties || [])
    }
    getSellerAllFacilites()
  }, [getHub, userToken])

  return (<PickupAddressTable columns={PickupAddressCol} data={sellerAllFacilites} />)
}

export default PickupAddresses