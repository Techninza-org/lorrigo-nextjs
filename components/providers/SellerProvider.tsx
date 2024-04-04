"use client";

import { z } from "zod";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosInstance } from "axios";
import { customerDetailsSchema } from "@/components/modal/add-customer-modal";
import { sellerSchema } from "@/components/modal/add-seller-modal";

import { useToast } from "@/components/ui/use-toast";

import { B2COrderType, HubType, OrderType, SellerType } from "@/types/types";
import { useAuth } from "./AuthProvider";
import { formDataSchema } from "../Shipment/b2c-form";

interface SellerContextType {
  sellerDashboard: any; // type: "D2C" | "B2B";
  seller: SellerType | null;
  business: string;
  sellerFacilities: HubType[];
  handlebusinessDropdown: (value: string) => void;
  sellerCustomerForm: sellerCustomerFormType;
  setSellerCustomerForm: React.Dispatch<React.SetStateAction<sellerCustomerFormType>>;
  getHub: () => void;
  handleCreateOrder: (order: z.infer<typeof formDataSchema>) => boolean | Promise<boolean>;
  orders: B2COrderType[];
  getAllOrdersByStatus: (status: string) => Promise<any[]>;
  getCourierPartners: (orderId: string) => Promise<any>;
  courierPartners: OrderType | undefined;
  handleCreateB2BShipment: ({ orderId, carrierId }: { orderId: string, carrierId: Number }) => boolean | Promise<boolean>;
  handleCancelOrder: (orderId: string) => boolean | Promise<boolean>;
  manifestOrder: ({ orderId, scheduleDate }: { orderId: string, scheduleDate: string }) => boolean | Promise<boolean>;
  getCityStateFPincode: (pincode: string) => Promise<{ city: string, state: string }>;
}

interface sellerCustomerFormType {
  sellerForm: z.infer<typeof sellerSchema>;
  customerForm: z.infer<typeof customerDetailsSchema>;
}

const SellerContext = createContext<SellerContextType | null>(null);

function SellerProvider({ children }: { children: React.ReactNode }) {
  const { userToken } = useAuth();

  const [seller, setSeller] = useState<SellerType | null>(null);
  const [sellerDashboard, setSellerDashboard] = useState<any>(null);
  const [sellerFacilities, setSellerFacilities] = useState([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [courierPartners, setCourierPartners] = useState<OrderType>();

  const [sellerCustomerForm, setSellerCustomerForm] = useState<sellerCustomerFormType>({
    sellerForm: {
      name: "",
      gstNo: "",
      isSellerAddressAdded: false,
      pincode: "",
      address: "",
      phone: "",
      city: "",
      state: "",
    },
    customerForm: {
      name: "",
      phone: "",
      state: "",
      country: "",
      address1: "",
      address2: "",
      city: "",
      pincode: "",
    }
  });
  const [business, setbusiness] = useState<string>("D2C");

  const { toast } = useToast();
  const router = useRouter()

  const axiosConfig = {
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
    },
  };

  const axiosIWAuth: AxiosInstance = axios.create(axiosConfig);

  const getHub = () => {
    axiosIWAuth.get('/hub')
      .then((res) => {
        if (res.data?.valid) {
          setSellerFacilities(res.data.hubs);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  }

  const getAllOrdersByStatus = async (status: string) => {
    console.log("status", status)
    let url = status === "all" ? `/order?limit=50&page=1` : `/order?limit=50&page=1&status=${status}`
    try {
      const res = await axiosIWAuth.get(url);
      if (res.data?.valid) {
        setOrders(res.data.response.orders);
        return res.data.response.orders
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getCourierPartners = async (orderId: string) => {
    try {
      const res = await axiosIWAuth.get(`/order/courier/b2c/${orderId}`);
      if (res.data?.valid) {
        setCourierPartners(res.data);
        return res.data
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getSellerDashboardDetails = async () => {
    try {
      const res = await axiosIWAuth.get(`/shipment/dashboard`);
      setSellerDashboard(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    getHub();
    getAllOrdersByStatus("all");
    getSellerDashboardDetails()
  }, [userToken]);

  const handlebusinessDropdown = (value: string) => {
    setbusiness(value);
  }

  const handleCreateOrder = useCallback(async (order: z.infer<typeof formDataSchema>) => {
    try {

      if (!sellerCustomerForm.customerForm.name.length) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Customer details are required",
        });
        return false
      }

      const payload = {
        order_reference_id: order.order_reference_id,
        payment_mode: order.payment_mode === "COD" ? 1 : 0,
        orderWeight: Number(order.orderWeight),
        orderWeightUnit: "kg",
        order_invoice_date: order.order_invoice_date,
        order_invoice_number: order.order_invoice_number,
        numberOfBoxes: Number(order.numberOfBoxes),
        orderSizeUnit: order.orderSizeUnit,
        orderBoxHeight: Number(order.orderBoxHeight),
        orderBoxWidth: Number(order.orderBoxWidth),
        orderBoxLength: Number(order.orderBoxLength),
        amount2Collect: Number(order.amount2Collect),
        customerDetails: {
          name: sellerCustomerForm.customerForm.name,
          phone: sellerCustomerForm.customerForm.phone,
          address: sellerCustomerForm.customerForm.address1,
          pincode: Number(sellerCustomerForm.customerForm.pincode),

        },
        productDetails: {
          name: order.productDetails.name,
          category: order.productDetails.category,
          hsn_code: order.productDetails.hsn_code,
          quantity: Number(order.productDetails.quantity),
          taxRate: order.productDetails.taxRate,
          taxableValue: order.productDetails.taxableValue,
        },
        pickupAddress: order.pickupAddress,
      }

      const res = await axiosIWAuth.post('/order/b2c', payload);
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Order created successfully",
          description: "Order has been created successfully",
        });
        getSellerDashboardDetails();
        router.refresh()
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.data.message,
        });
        return false
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "error.response.data.message",
      });
      return false

    }
  }, [axiosIWAuth, router, sellerCustomerForm, toast])

  const handleCreateB2BShipment = useCallback(async ({ orderId, carrierId }: { orderId: string, carrierId: Number }) => {

    const payload = {
      orderId: orderId,
      carrierId: carrierId,
      orderType: 0
    }
    try {
      const res = await axiosIWAuth.post('/shipment', payload);
      if (res.data.shipment.response.data.errors === null) {
        toast({
          variant: "default",
          title: "Order created successfully",
          description: "Order has been created successfully",
        });
        router.push('/orders')
        return true;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: res.data.message,
      });
      return false
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
      return false

    }
  }, [axiosIWAuth, router, toast])

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await axiosIWAuth.post(`/shipment/cancel`, {
        orderId: orderId
      });
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Order",
          description: "Order cancellation request generated",
        });
        getAllOrdersByStatus("all")
        router.refresh();
        return true;
      }
      toast({
        variant: "destructive",
        title: "Order",
        description: "Order Already cancelled",
      });
      return false
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
      return false
    }
  }

  const manifestOrder = async ({ orderId, scheduleDate }: { orderId: string, scheduleDate: string }) => {
    try {
      const res = await axiosIWAuth.post(`/shipment/manifest`, {
        orderId: orderId,
        pickupDate: scheduleDate
      });
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Order",
          description: "Order manifested successfully",
        });
        getAllOrdersByStatus("all")
        router.refresh();
        return true;
      }
      toast({
        variant: "destructive",
        title: "Order",
        description: res.data.message,
      });
      return false
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
      return false
    }
  }

  const getCityStateFPincode = async (pincode: string): Promise<{ city: string, state: string }> => {
    try {
      const res = await axiosIWAuth.post(`/hub/pincode`, {
        pincode: Number(pincode)
      });
      const { city, state, valid } = res.data
      if (!city || !state) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to fetch city and state for the given pincode",
        })
        return { city: "City", state: "State" }
      }
      return { city, state }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to fetch city and state for the given pincode",
      })
      return { city: "", state: "" }
    }
  };

  return (
    <SellerContext.Provider
      value={{
        seller,
        business,
        sellerFacilities,
        handlebusinessDropdown,
        sellerCustomerForm,
        setSellerCustomerForm,
        getHub,
        handleCreateOrder,
        orders,
        getAllOrdersByStatus,
        getCourierPartners,
        courierPartners,
        handleCreateB2BShipment,
        handleCancelOrder,
        manifestOrder,
        getCityStateFPincode,
        sellerDashboard

      }}
    >
      {children}
    </SellerContext.Provider>
  );
}

export default SellerProvider;

export function useSellerProvider() {
  const context = useContext(SellerContext);
  if (context == undefined) {
    throw new Error("component and page must be inside the provider");
  }
  return context;
}
