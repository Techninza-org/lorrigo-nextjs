"use client";

import { z } from "zod";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";

import { B2COrderType, OrderType, RemittanceType, SellerType, pickupAddressType } from "@/types/types";

import { useAuth } from "./AuthProvider";
import { cloneFormSchema } from "../drawer/clone-order-drawer";
import { EditFormSchema } from "../drawer/edit-order-drawer";
import { ReattemptOrderSchema } from "../Orders/ndr-order-dialog";
import { unstable_noStore } from "next/cache";
import { useAxios } from "./AxiosProvider";
import { BankDetailsSchema } from "../Settings/bank-details";
import { GstinFormSchema } from "../Settings/gstin-form";
import { BillingAddressSchema } from "../Settings/billing-address-form";
import { ChannelFormSchema } from "../Channel/channel-integration-form";
import { BulkUpdateShopifyOrdersSchema } from "../modal/bulk-update-shopify-modal";

interface SellerContextType {
  sellerDashboard: any; // type: "D2C" | "B2B";
  seller: SellerType | null;
  business: string;
  isOrderCreated: boolean;
  sellerFacilities: pickupAddressType[];
  handlebusinessDropdown: (value: string) => void;
  sellerCustomerForm: sellerCustomerFormType;
  setSellerCustomerForm: React.Dispatch<React.SetStateAction<sellerCustomerFormType>>;
  handleCreateOrder: (order: z.infer<typeof cloneFormSchema>) => boolean | Promise<boolean>;
  handleUpdateOrder: (order: z.infer<typeof EditFormSchema>) => boolean | Promise<boolean>;
  orders: B2COrderType[];
  getAllOrdersByStatus: (status: string) => Promise<any[]>;
  getCourierPartners: (orderId: string) => Promise<any>;
  courierPartners: OrderType | undefined;
  handleCreateD2CShipment: ({ orderId, carrierId, carrierNickName }: { orderId: string, carrierNickName: string, carrierId: Number }) => boolean | Promise<boolean>;
  handleCancelOrder: (orderId: string[], type: string) => boolean | Promise<boolean>;
  manifestOrder: ({ orderId, scheduleDate }: { orderId: string, scheduleDate: string }) => boolean | Promise<boolean>;
  getCityStateFPincode: (pincode: string) => Promise<{ city: string, state: string }>;
  calcRate: (order: any) => Promise<any>;
  getSellerRemittanceDetails: (id: string) => Promise<RemittanceType | undefined>;
  sellerRemittance: RemittanceType[] | null;
  getOrderDetails: (orderId: string) => Promise<B2COrderType | undefined>;
  getSeller: () => Promise<void>;
  handleOrderNDR: (orderId: string, type: string, ndrInfo: z.infer<typeof ReattemptOrderSchema>) => boolean | Promise<boolean>;
  getHub: (type?: string) => Promise<pickupAddressType[]> | void


  // Seller Bank Details
  updateBankDetails: (bankInfos: z.infer<typeof BankDetailsSchema>) => Promise<boolean>;
  uploadGstinInvoicing: (values: z.infer<typeof GstinFormSchema>) => boolean | Promise<boolean>;
  updateBillingAddress: (values: z.infer<typeof BillingAddressSchema>) => boolean | Promise<boolean>;
  createChannel: (values: z.infer<typeof ChannelFormSchema>) => boolean | Promise<boolean>;
  updateChannel: (id: string, isOrderSync: boolean) => boolean | Promise<boolean>;
  handleOrderSync: () => boolean | Promise<boolean>;

  handleBulkPickupChange: (orderIds: string[], pickupAddress: string) => boolean | Promise<boolean>;
  handleBulkUpdateShopifyOrders: ({ orderIds, values }: { orderIds: string[], values: z.infer<typeof BulkUpdateShopifyOrdersSchema> }) => boolean | Promise<boolean>;


}

interface sellerCustomerFormType {
  sellerForm: {
    sellerName: string;
    sellerGSTIN?: string | undefined;
    isSellerAddressAdded?: boolean | undefined;
    sellerCity?: string | undefined;
    sellerState?: string | undefined;
    sellerPhone?: string | undefined;
    sellerAddress?: string | undefined;
    sellerPincode?: string | undefined;
  }
  customerForm: {
    name: string;
    pincode: string;
    phone: string;
    address: string;
    address2?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    city?: string | undefined;
  };
}

const SellerContext = createContext<SellerContextType | null>(null);

function SellerProvider({ children }: { children: React.ReactNode }) {
  const { userToken, user } = useAuth();
  const { axiosIWAuth } = useAxios();

  const [seller, setSeller] = useState<SellerType | null>(null);
  const [sellerRemittance, setSellerRemittance] = useState<RemittanceType[] | null>(null);
  const [sellerDashboard, setSellerDashboard] = useState<any>(null);
  const [sellerFacilities, setSellerFacilities] = useState([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrderCreated, setIsOrderCreated] = useState<boolean>(false);
  const [courierPartners, setCourierPartners] = useState<OrderType>();


  const [sellerCustomerForm, setSellerCustomerForm] = useState<sellerCustomerFormType>({
    sellerForm: {
      sellerName: "",
      sellerGSTIN: "",
      isSellerAddressAdded: false,
      sellerCity: "",
      sellerState: "",
      sellerPhone: "",
      sellerAddress: "",
      sellerPincode: "",
    },
    customerForm: {
      name: "",
      phone: "",
      state: "",
      country: "",
      address: "",
      address2: "",
      city: "",
      pincode: "",
    }
  });

  const [business, setbusiness] = useState<string>("D2C");

  const { toast } = useToast();
  const router = useRouter()

  const status = useSearchParams().get("status");


  const getHub = async (type?: string) => {
    try {
      if (type) {
        const sellerAllFacilites = await axiosIWAuth.get(`/hub?type=${type}`)
        return sellerAllFacilites.data.hubs
      }
      const sellerFacilties = await axiosIWAuth.get(`/hub`)
      if (sellerFacilties.data.valid) setSellerFacilities(sellerFacilties.data.hubs)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getAllOrdersByStatus = async (status: string) => {
    let url = status === "all" ? `/order` : `/order?status=${status}`
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

      unstable_noStore()
      const res = await axiosIWAuth.get(`/order/courier/b2c/SR/${orderId}`);
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
      return res.data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handlebusinessDropdown = (value: string) => {
    setbusiness(value);
  }

  const handleCreateOrder = useCallback(async (order: z.infer<typeof cloneFormSchema>) => {
    try {
      const customerDetailsPayload = order.customerDetails && order.customerDetails.name.length > 0
        ? {
          name: order.customerDetails.name,
          phone: order.customerDetails.phone,
          address: order.customerDetails.address,
          pincode: Number(order.customerDetails.pincode),
          state: order.customerDetails.state,
          city: order.customerDetails.city,
        }
        : {
          name: sellerCustomerForm.customerForm.name,
          phone: sellerCustomerForm.customerForm.phone,
          address: sellerCustomerForm.customerForm.address,
          pincode: Number(sellerCustomerForm.customerForm.pincode),
          state: sellerCustomerForm.customerForm.state,
          city: sellerCustomerForm.customerForm.city,

        };

      const sellerDetailsPayload = order.sellerDetails && order.sellerDetails.sellerName.length > 0
        ? {
          sellerName: order.sellerDetails.sellerName,
          sellerGSTIN: order.sellerDetails.sellerGSTIN,
          isSellerAddressAdded: order.sellerDetails.isSellerAddressAdded,
          sellerCity: order.sellerDetails.sellerCity,
          sellerState: order.sellerDetails.sellerState,
          sellerPhone: order.sellerDetails.sellerPhone,
          sellerAddress: order.sellerDetails.sellerAddress,
          sellerPincode: Number(order.sellerDetails.sellerPincode),
        }
        : {
          sellerName: sellerCustomerForm.sellerForm.sellerName,
          sellerGSTIN: sellerCustomerForm.sellerForm.sellerGSTIN,
          isSellerAddressAdded: sellerCustomerForm.sellerForm.isSellerAddressAdded,
          sellerCity: sellerCustomerForm.sellerForm.sellerCity,
          sellerState: sellerCustomerForm.sellerForm.sellerState,
          sellerPhone: sellerCustomerForm.sellerForm.sellerPhone,
          sellerAddress: sellerCustomerForm.sellerForm.sellerAddress,
          sellerPincode: Number(sellerCustomerForm.sellerForm.sellerPincode),
        };

      if ((!sellerDetailsPayload.sellerName) || (!customerDetailsPayload.name || !customerDetailsPayload.phone || !customerDetailsPayload.address || !customerDetailsPayload.pincode)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Customer and Seller details are required",
        });
        return false;
      }
      if (!sellerDetailsPayload?.sellerName?.length) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Seller details are required",
        });
        return false;
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
        customerDetails: customerDetailsPayload,
        productDetails: {
          name: order.productDetails.name,
          category: order.productDetails.category,
          hsn_code: order.productDetails.hsn_code,
          quantity: Number(order.productDetails.quantity),
          taxRate: order.productDetails.taxRate,
          taxableValue: order.productDetails.taxableValue,
        },
        pickupAddress: order.pickupAddress,
        sellerDetails: sellerDetailsPayload
      }

      const res = await axiosIWAuth.post('/order/b2c', payload);
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Order created successfully",
          description: "Order has been created successfully",
        });
        setIsOrderCreated(!isOrderCreated);

        setSellerCustomerForm({
          sellerForm: {
            sellerName: "",
            sellerGSTIN: "",
            isSellerAddressAdded: false,
            sellerCity: "",
            sellerState: "",
            sellerPhone: "",
            sellerAddress: "",
            sellerPincode: "",
          },
          customerForm: {
            name: "",
            phone: "",
            state: "",
            country: "",
            address: "",
            address2: "",
            city: "",
            pincode: "",
          }
        })



        getSellerDashboardDetails();
        getAllOrdersByStatus("all");
        router.refresh();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.data.message,
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
      });
      return false;
    }
  }, [axiosIWAuth, router, sellerCustomerForm, toast]);

  const handleUpdateOrder = useCallback(async (order: z.infer<typeof EditFormSchema>) => {
    try {
      const customerDetailsPayload = order.customerDetails && order.customerDetails.name.length > 0
        ? {
          name: order.customerDetails.name,
          phone: order.customerDetails.phone,
          address: order.customerDetails.address,
          pincode: Number(order.customerDetails.pincode),
          state: order.customerDetails.state,
          city: order.customerDetails.city,
        }
        : {
          name: sellerCustomerForm.customerForm.name,
          phone: sellerCustomerForm.customerForm.phone,
          address: sellerCustomerForm.customerForm.address,
          pincode: Number(sellerCustomerForm.customerForm.pincode),
          state: order.customerDetails.state,
          city: order.customerDetails.city,
        };

      const sellerDetailsPayload = order.sellerDetails && order.sellerDetails.sellerName.length > 0
        ? {
          sellerName: order.sellerDetails.sellerName,
          sellerGSTIN: order.sellerDetails.sellerGSTIN,
          isSellerAddressAdded: order.sellerDetails.isSellerAddressAdded,
          sellerCity: order.sellerDetails.sellerCity,
          sellerState: order.sellerDetails.sellerState,
          sellerPhone: order.sellerDetails.sellerPhone,
          sellerAddress: order.sellerDetails.sellerAddress,
          sellerPincode: Number(order.sellerDetails.sellerPincode),
        }
        : {
          sellerName: sellerCustomerForm.sellerForm.sellerName,
          sellerGSTIN: sellerCustomerForm.sellerForm.sellerGSTIN,
          isSellerAddressAdded: sellerCustomerForm.sellerForm.isSellerAddressAdded,
          sellerCity: sellerCustomerForm.sellerForm.sellerCity,
          sellerState: sellerCustomerForm.sellerForm.sellerState,
          sellerPhone: sellerCustomerForm.sellerForm.sellerPhone,
          sellerAddress: sellerCustomerForm.sellerForm.sellerAddress,
          sellerPincode: Number(sellerCustomerForm.sellerForm.sellerPincode),
        };

      if ((!sellerDetailsPayload.sellerName) || (!customerDetailsPayload.name || !customerDetailsPayload.phone || !customerDetailsPayload.address || !customerDetailsPayload.pincode)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Customer and Seller details are required",
        });
        return false;
      }
      if (!sellerDetailsPayload?.sellerName?.length) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Seller details are required",
        });
        return false;
      }

      const payload = {
        orderId: order.orderId,
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
        customerDetails: customerDetailsPayload,
        productDetails: {
          _id: order.productId,
          name: order.productDetails.name,
          category: order.productDetails.category,
          hsn_code: order.productDetails.hsn_code,
          quantity: Number(order.productDetails.quantity),
          taxRate: order.productDetails.taxRate,
          taxableValue: order.productDetails.taxableValue,
        },
        pickupAddress: order.pickupAddress,
        sellerDetails: sellerDetailsPayload
      }

      const res = await axiosIWAuth.patch('/order/update/b2c', payload);
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Order",
          description: "Order updated successfully",
        });
        getSellerDashboardDetails();
        getAllOrdersByStatus(status || "all");
        router.refresh();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.data.message,
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
      });
      return false;
    }
  }, [axiosIWAuth, router, sellerCustomerForm, toast]);

  const handleCreateD2CShipment = useCallback(async ({ orderId, carrierId, carrierNickName }: { orderId: string, carrierId: Number, carrierNickName: string }) => {

    const payload = {
      orderId: orderId,
      carrierId: carrierId,
      carrierNickName,
      orderType: 0,
    }
    try {
      const res = await axiosIWAuth.post('/shipment', payload);
      if (res.data?.valid && res.data?.order.awb) {
        toast({
          variant: "default",
          title: "Order created successfully",
          description: "Order has been created successfully",
        });
        getAllOrdersByStatus(status || "all")
        router.push('/orders')
        return true;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: res.data.message,
      });
      return false
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message ?? "Something went wrong",
      });
      return false

    }
  }, [axiosIWAuth, router, toast])

  const handleCancelOrder = async (orderId: string[], type: string) => {
    try {
      const res = await axiosIWAuth.post(`/shipment/cancel`, {
        orderIds: orderId,
        type: type
      });
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Order",
          description: "Order cancellation request generated",
        });
        getAllOrdersByStatus(status || "all")
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
        getAllOrdersByStatus(status || "all")
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

  const calcRate = async (order: any) => {
    try {
      const res = await axiosIWAuth.post('/ratecalculator', order);
      if (res.data?.valid) {
        return res.data.rates;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getSeller = async () => {
    try {
      const res = await axiosIWAuth.get('/seller');
      if (res.data.valid) {
        setSeller(res.data.seller)
      }
    } catch (error) {
      console.error('Error fetching seller:', error);
    }
  }

  const getSellerRemittance = async () => {
    try {
      const res = await axiosIWAuth.get('/seller/remittance');
      if (res.data?.valid) {
        setSellerRemittance(res.data.remittanceOrders);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getSellerRemittanceDetails = async (id: string) => {
    try {
      const res = await axiosIWAuth.get(`/seller/remittance/${id}`);
      if (res.data?.valid) {
        return res.data.remittanceOrder;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getOrderDetails = async (orderId: string) => {
    try {
      const res = await axiosIWAuth.get(`/order/${orderId}`);
      if (res.data?.valid) {
        return res.data.order;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const handleOrderNDR = async (orderId: string, type: string, ndrInfo: z.infer<typeof ReattemptOrderSchema>) => {
    try {
      const res = await axiosIWAuth.post('/shipment/order-reattempt', {
        orderId,
        type,
        ndrInfo
      });
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Order",
          description: "NDR request generated",
        });
        getAllOrdersByStatus(status || "all")
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


  const updateBankDetails = async (bankInfos: z.infer<typeof BankDetailsSchema>) => {
    try {

      const userRes = await axiosIWAuth.put("/seller", { bankDetails: { ...bankInfos } });
      if (userRes?.data?.valid) {
        setSeller(userRes.data.seller);
        toast({
          title: "Success",
          description: "Bank Details submitted successfully.",
        });
        return true;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sorry! Something went wrong. Please try again.",
      });
      return false
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sorry! Something went wrong. Please try again.",
      });
      return false;
    }
  }

  const uploadGstinInvoicing = async (values: z.infer<typeof GstinFormSchema>) => {
    try {

      const userRes = await axiosIWAuth.put("/seller", { gstInvoice: { ...values } });
      if (userRes?.data?.valid) {
        toast({
          title: "Success",
          description: "GSTIN Details updated successfully.",
        });

        return true;
      }
      return false

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message || "Something went wrong",
      });
      return false;
    }
  }

  const updateBillingAddress = async (values: z.infer<typeof BillingAddressSchema>) => {
    try {
      const userRes = await axiosIWAuth.put("/seller", { billingAddress: { ...values } });
      if (userRes?.data?.valid) {
        toast({
          title: "Success",
          description: "Billing Address updated successfully.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message || "Something wrong, Please try again!",
      });
      return false
    }
  }

  const createChannel = async (values: z.infer<typeof ChannelFormSchema>) => {
    try {
      const userRes = await axiosIWAuth.post("/seller/channels", { channel: { ...values } });
      if (userRes?.data?.valid) {
        toast({
          title: "Success",
          description: "Channel added successfully.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response.data.message.includes("duplicate key error") ? "API Key must be Unique " : error.response.data.message;
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Something wrong, Please try again!",
      });
      return false
    }
  }

  const updateChannel = async (id: string, isOrderSync: boolean) => {
    try {
      const userRes = await axiosIWAuth.put(`/seller/channels/${id}`, { channel: { isOrderSync } });
      if (userRes?.data?.valid) {
        toast({
          title: "Success",
          description: "Channel updated successfully.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Something wrong, Please try again!",
      });
      return false
    }
  }

  const handleOrderSync = async () => {
    try {
      const userRes = await axiosIWAuth.get(`/order/b2c/channels`);
console.log("asdfas")
      if (userRes?.data?.valid) {
        toast({
          title: "Success",
          description: "Order Sync successfully.",
        });
        getAllOrdersByStatus(status || "all")
        return true;
      }
      return false;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Something wrong, Please try again!",
      });
      return false
    }
  }

  const handleBulkPickupChange = async (orderIds: string[], pickupAddress: string) => {
    try {
      const res = await axiosIWAuth.put(`/order/b2c/bulk-pickup`, {
        orderIds,
        pickupAddress
      });
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Orders",
          description: "Orders pickup address updated",
        });
        getAllOrdersByStatus(status || "all")
        return true;
      }
      toast({
        variant: "destructive",
        title: "Orders",
        description: "Orders Already updated",
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

  const handleBulkUpdateShopifyOrders = async ({ orderIds, values }: { orderIds: string[], values: z.infer<typeof BulkUpdateShopifyOrdersSchema> }) => {
    try {
      const res = await axiosIWAuth.patch(`/order/update/b2c/shopify`, {
        orderIds: orderIds,
        pickupAddressId: values.pickupAddressId,
        orderSizeUnit: "cm",
        orderBoxHeight: values.orderBoxHeight,
        orderBoxWidth: values.orderBoxWidth,
        orderBoxLength: values.orderBoxLength,
        orderWeight: values.orderWeight,
      });
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Orders",
          description: "Orders updated Successfully",
        });
        getAllOrdersByStatus(status || "all")
        return true;
      }
      toast({
        variant: "destructive",
        title: "Orders",
        description: "Orders Already updated",
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
  useEffect(() => {
    if (!!user || !!userToken) {
      getHub();
      getSeller();
      getSellerDashboardDetails()
      getSellerRemittance();
    }
  }, [user, userToken])

  useEffect(() => {
    if (!!user || !!userToken) {
      getAllOrdersByStatus(status || "all")
    }

  }, [user, userToken, status]);

  return (
    <SellerContext.Provider
      value={{
        seller,
        isOrderCreated,
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
        handleCreateD2CShipment,
        handleCancelOrder,
        manifestOrder,
        getCityStateFPincode,
        sellerDashboard,
        handleUpdateOrder,
        calcRate,
        getSellerRemittanceDetails,
        sellerRemittance,
        getOrderDetails,
        getSeller,
        handleOrderNDR,

        updateBankDetails,
        uploadGstinInvoicing,
        updateBillingAddress,
        createChannel,
        updateChannel,
        handleOrderSync,

        handleBulkPickupChange,
        handleBulkUpdateShopifyOrders




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
