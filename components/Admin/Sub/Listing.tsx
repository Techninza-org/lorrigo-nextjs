'use client'
import { useAuth } from "@/components/providers/AuthProvider";
import { useAxios } from "@/components/providers/AxiosProvider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { ListingTable } from "./ListingTable";
import { ListingCols } from "./ListingCols";
import { useAdminProvider } from "@/components/providers/AdminProvider";

const Listing = () => {
    const {subadmins} = useAdminProvider();

  return (
    <ListingTable columns={ListingCols} data={subadmins}/>
  )
}

export default Listing