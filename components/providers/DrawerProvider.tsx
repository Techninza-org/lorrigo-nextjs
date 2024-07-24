"use client"

import { useEffect, useState } from "react";
import { EditOrderDrawer } from "../drawer/edit-order-drawer";
import { CloneOrderDrawer } from "../drawer/clone-order-drawer";
import { EditB2BOrderDrawer } from "../drawer/b2b/edit-b2b-order-drawer";
import { CloneB2BOrderDrawer } from "../drawer/b2b/clone-b2b-order-drawer";


export const DrawerProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) return null;
  
    return (
      <>
        <EditOrderDrawer/>
        <CloneOrderDrawer/>

        <EditB2BOrderDrawer/>
        <CloneB2BOrderDrawer/>
        
      </>
    );
  };
  