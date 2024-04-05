"use client"

import { useEffect, useState } from "react";
import { EditOrderDrawer } from "../drawer/edit-order-drawer";
import { CloneOrderDrawer } from "../drawer/clone-order-drawer";


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
        
      </>
    );
  };
  