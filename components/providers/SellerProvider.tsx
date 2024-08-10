"use client";

import { z } from "zod";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
import { usePaymentGateway } from "./PaymentGatewayProvider";
import { B2BOrderType } from "@/types/B2BTypes";
import { b2bformDataSchema } from "../Orders/b2b/b2b-form";
import { B2BrateCalcSchema } from "../RateCalc/b2b-rate-calc-form";
import { useModal } from "@/hooks/use-model-store";

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
  reverseOrders: B2COrderType[];
  getAllOrdersByStatus: (status: string) => Promise<any[]>;
  getCourierPartners: (orderId: string, type: string) => Promise<any>;
  getBulkCourierPartners: (orderIds:  string[] | undefined) => Promise<any>;
  courierPartners: OrderType | undefined;
  handleCreateD2CShipment: ({ orderId, carrierId, carrierNickName, charge, type }: { orderId: any, carrierNickName: string, carrierId: Number, charge: Number, type: string }) => boolean | Promise<boolean>;
  handleCancelOrder: (orderId: string[], type: string) => boolean | Promise<boolean>;
  manifestOrder: ({ orderId, scheduleDate }: { orderId: string, scheduleDate: string }) => boolean | Promise<boolean>;
  getCityStateFPincode: (pincode: string) => Promise<{ city: string, state: string }>;
  calcRate: (order: any) => Promise<any>;
  getSellerRemittanceDetails: (id: string) => Promise<RemittanceType | undefined>;
  sellerRemittance: RemittanceType[] | null;
  getOrderDetails: (awbNumber: string) => Promise<B2COrderType | undefined>;
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

  getB2BCustomers: () => Promise<void>;
  b2bCustomers: any[];
  handleCreateCustomer: (customer: any) => boolean | Promise<boolean>;

  sellerBilling: any; // Type should be updated

  handleCreateB2BOrder: (order: z.infer<typeof b2bformDataSchema>) => boolean | Promise<boolean>;
  getB2BOrders: () => Promise<void>;
  b2bOrders: B2BOrderType[];
  handleCreateB2BShipment: ({ orderId, carrierId, carrierNickName, charge }: { orderId: string, carrierNickName: string, carrierId: Number, charge: Number }) => boolean | Promise<boolean>;

  handleEditB2BOrder: (order: z.infer<typeof b2bformDataSchema>, orderId: string) => boolean | Promise<boolean>;
  B2BcalcRate: (values: z.infer<typeof B2BrateCalcSchema>) => Promise<OrderType>;
  getInvoices: () => Promise<any>;
  invoices: any;
  getCodPrice: () => Promise<any>;
  codprice: any;
  getSellerAssignedCourier: () => Promise<void>;
  assignedCouriers: any[];
  getInvoiceById: (id: any) => Promise<any>;
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
  const { axiosIWAuth, axiosIWAuth4Upload } = useAxios();
  const { onOpen } = useModal();
  const pathname = usePathname()

  const [seller, setSeller] = useState<SellerType | null>(null);
  const [sellerRemittance, setSellerRemittance] = useState<RemittanceType[] | null>(null);
  const [sellerDashboard, setSellerDashboard] = useState<any>(null);
  const [sellerFacilities, setSellerFacilities] = useState([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reverseOrders, setReverseOrders] = useState<any[]>([]);
  const [b2bOrders, setB2bOrders] = useState<any[]>([]);
  const [isOrderCreated, setIsOrderCreated] = useState<boolean>(false);
  const [courierPartners, setCourierPartners] = useState<OrderType>();
  const [b2bCustomers, setB2bCustomers] = useState<any[]>([]);
  const [sellerBilling, setSellerBilling] = useState<any>(null);  // Type should be updated
  const [invoices, setInvoices] = useState<any>(null);
  const [codprice, setCodprice] = useState<any>(0);
  const [assignedCouriers, setAssignedCouriers] = useState<any[]>([]);

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
  const { fetchWalletBalance } = usePaymentGateway();
  const router = useRouter()

  const status = useSearchParams().get("status");

  const getSellerAssignedCourier = async () => {
    try {
      const res = await axiosIWAuth.get(`/seller/couriers`);
      setAssignedCouriers(res.data.couriers)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const getB2BCustomers = async () => {
    try {
      const res = await axiosIWAuth.get('/customer');
      if (res.data?.valid) {
        setB2bCustomers(res.data.customers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleCreateCustomer = async (customer: any) => {
    try {
      const res = await axiosIWAuth.post('/customer', { customerDetails: customer });
      if (res.data?.valid) {
        getB2BCustomers();
        toast({
          variant: "default",
          title: "Customer Added",
          description: "Customer added successfully"
        });
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
        description: "An error occurred",
      });
      return false
    }
  }


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
        const orders = res.data.response.orders;
        const filteredOrders = orders.filter((order: any) => !order.isReverseOrder);
        const reverseOrders = orders.filter((order: any) => order.isReverseOrder);
        setOrders(filteredOrders);
        setReverseOrders(reverseOrders);
        return orders;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getCourierPartners = async (orderId: string, type: string) => {
    try {
      let url = type === "b2c" ? `/order/courier/${type}/SR/${orderId}` : `/order/courier/b2b/${orderId}`
      const res = await axiosIWAuth.get(url);
      if (res.data?.valid) {
        if (res?.data?.courierPartner[0]?.message?.includes("error: ")) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No courier partners available",
          });
          router.push(`/orders/${type === 'b2c' ? '' : 'b2b'}`);
        }
        setCourierPartners(res.data);
        return res.data;
      }


      if (type != "b2c" && (!res.data?.valid || res?.data?.message.includes("Zone not found for the given region"))) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No courier partners available",
        });
        router.push(`/orders/${type === 'b2c' ? '' : 'b2b'}`);
      }

    } catch (error: any) {
      if (error?.response?.data?.message?.includes("Zone not found for the given region")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Zone not Serviceable for the given pincode",
        });
        router.push(`/orders/${type === 'b2c' ? '' : 'b2b'}`);
      }
      console.error('Error fetching data:', error);
    }
  }

  const getBulkCourierPartners = async (orderIds: string[] | undefined) => {
    try {
      let url = `/order/courier/b2b/SR/`
      const res = await axiosIWAuth.post(url, {
        orderIds: orderIds
      });
      if (res.data?.valid) {
        if (res?.data?.courierPartner[0]?.message?.includes("error: ")) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No courier partners available",
          });
          router.push(`/orders`);
        }
        setCourierPartners(res.data);
        return res.data;
      }
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("Zone not found for the given region")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Zone not Serviceable for the given pincode",
        });
        router.push(`/orders`);
      }
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

      // For Ewaybill validation
      if (Number(order.productDetails.taxableValue) > 50000 && !order.ewaybill) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "E-way bill is required for order value greater than 50,000",
        });
        return false;
      }

      const payload = {
        ewaybill: order.ewaybill,
        order_reference_id: order.order_reference_id,
        client_order_reference_id: order.client_order_reference_id,
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
        sellerDetails: sellerDetailsPayload,
        isReverseOrder: order.isReverseOrder
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "An error occurred",
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

      if (order.ewaybill && Number(order.productDetails.taxableValue) > 50000) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "E-way bill is required for order value greater than 50,000",
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

  const handleCreateD2CShipment = useCallback(async ({ orderId, carrierId, carrierNickName, charge, type }: { orderId: any, carrierId: Number, carrierNickName: string, charge: Number, type: string }) => {
    const payload = {
      orderIds: orderId,
      carrierId: carrierId,
      carrierNickName,
      charge: charge,
      orderType: 0,
      type: type
    }
    try {
      const res = await axiosIWAuth.post('/shipment', payload);
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "Order created successfully",
          description: "Order has been created successfully",
        });
        getAllOrdersByStatus(status || "all")
        fetchWalletBalance();
        router.push('/orders')
        return true;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: res?.data?.message,
      });
      return false
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message ?? "Something went wrong",
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
        getB2BOrders();
        fetchWalletBalance();
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
        getB2BOrders();
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
      if (order.boxLength === '0' || order.boxWidth === '0' || order.boxHeight === '0' || order.weight === '0') {
        toast({
          variant: "destructive",
          title: "Invalid Input",
          description: "Weght and dimensions should be greater than 0",
        });
        return false;
      }
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
        const isAlertShown = localStorage.getItem("kyc-alert");
        console.log("isAlertShown", isAlertShown);
        const showKycAlert = !res.data?.seller?.kycDetails?.submitted && !isAlertShown && onOpen("alert-kyc");
        setSeller(res.data.seller)
        setInvoices(res.data.seller.invoices)
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

  const getOrderDetails = async (awbNumber: string) => {
    try {
      const res = await axiosIWAuth.get(`/order/${awbNumber}`);
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
        description: error?.response?.data?.message || "Something went wrong",
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
        description: error?.response?.data?.message || "Something wrong, Please try again!",
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
      const message = error?.response?.data?.message.includes("duplicate key error") ? "API Key must be Unique " : error?.response?.data?.message;
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
      const res = await axiosIWAuth.put(`${pathname.includes('/b2b') ? "/order/b2b/bulk-pickup" : "/order/b2c/bulk-pickup"}`, {
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
        getB2BOrders();
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

  const handleCreateB2BOrder = async (order: z.infer<typeof b2bformDataSchema>) => {
    const formData = new FormData();
    formData.append('order_reference_id', order.order_reference_id);
    formData.append('client_name', order.client_name);
    formData.append('pickupAddress', order.pickupAddress);
    formData.append('product_description', order.product_description);
    formData.append('total_weight', order.total_weight);
    formData.append('quantity', order.quantity);
    formData.append('ewaybill', order?.ewaybill || "");
    formData.append('amount', order.amount);
    formData.append('invoiceNumber', order.invoiceNumber);
    formData.append('customerDetails', order.customerDetails);
    formData.append('boxes', JSON.stringify(order.boxes));

    if (order?.invoice) {
      formData.append('invoice', order.invoice);
    }
    if (order?.supporting_document) {
      formData.append('supporting_document', order.supporting_document);
    }

    try {
      const res = await axiosIWAuth4Upload.post('/order/b2b', formData);
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "B2B order created successfully",
          description: "Order has been created successfully",
        });
        getB2BOrders();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.data.message,
        });
        return false;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "An error occurred",
      });
      return false;
    }
  }

  const handleEditB2BOrder = async (order: z.infer<typeof b2bformDataSchema>, orderId: string) => {
    try {
      const formData = new FormData();
      formData.append('orderId', orderId); // Append orderId to formData
      formData.append('order_reference_id', order.order_reference_id);
      formData.append('client_name', order.client_name);
      formData.append('pickupAddress', order.pickupAddress);
      formData.append('product_description', order.product_description);
      formData.append('total_weight', order.total_weight);
      formData.append('quantity', order.quantity);
      formData.append('ewaybill', order?.ewaybill || "");
      formData.append('amount', order.amount);
      formData.append('invoiceNumber', order.invoiceNumber);
      formData.append('customerDetails', order.customerDetails);
      formData.append('boxes', JSON.stringify(order.boxes));

      if (order?.invoice) {
        formData.append('invoice', order.invoice);
      }
      if (order?.supporting_document) {
        formData.append('supporting_document', order.supporting_document);
      }

      const res = await axiosIWAuth4Upload.patch(`/order/update/b2b`, formData);
      if (res.data?.valid) {
        toast({
          variant: "default",
          title: "B2B order updated successfully",
          description: "Order has been updated successfully",
        });
        getB2BOrders();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.data.message,
        });
        return false;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "An error occurred",
      });
      return false;
    }
  };


  const getB2BOrders = async () => {
    try {
      const res = await axiosIWAuth.get('/order/all/b2b');
      if (res.data?.valid) {
        setB2bOrders(res.data.response.orders);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const handleCreateB2BShipment = useCallback(async ({ orderId, carrierId, carrierNickName, charge }: { orderId: string, carrierId: Number, carrierNickName: string, charge: Number }) => {
    const payload = {
      orderId: orderId,
      carrierId: carrierId,
      carrierNickName,
      charge: charge,
      orderType: 0,
    }
    try {
      const res = await axiosIWAuth.post('/shipment/b2b', payload);
      if (res.data?.valid && res.data?.order.awb) {
        toast({
          variant: "default",
          title: "Order created successfully",
          description: "Order has been created successfully",
        });
        getB2BOrders();
        fetchWalletBalance();
        getAllOrdersByStatus(status || "all")
        router.push('/orders/b2b')
        return true;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: res?.data?.message || "Something went wrong",
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


  const getSellerBillingDetails = async () => {
    try {
      const res = await axiosIWAuth.get('/seller/billing');
      if (res.data?.valid) {
        setSellerBilling(res.data?.billing);
        return res.data.billing;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const B2BcalcRate = async (values: z.infer<typeof B2BrateCalcSchema>) => {
    try {
      const res = await axiosIWAuth.post('/ratecalculator/b2b', values);
      if (res.data?.valid) {
        return res.data.rates;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getInvoices = async () => {
    try {
      const res = await axiosIWAuth.get('/seller/invoice');
      setInvoices(res.data.invoices)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getInvoiceById = async (id: any) => {
    try {
      const res = await axiosIWAuth.get(`/seller/invoice/${id}`);
      return res.data.invoice;
      console.log(res.data.invoice);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getCodPrice = async () => {
    try {
      const res = await axiosIWAuth.get('/seller/cod-price');
      setCodprice(res.data.codPrice)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    if ((!!user || !!userToken) && user?.role === "seller") {
      getHub();
      getSeller();
      getB2BCustomers();
      getSellerDashboardDetails()
      getSellerRemittance();
      getSellerBillingDetails();
      getInvoices();
      getCodPrice();
      getSellerAssignedCourier()
    }
  }, [user, userToken])

  useEffect(() => {
    if ((!!user || !!userToken) && user?.role === "seller") {
      getAllOrdersByStatus(status || "all");
      getB2BOrders();
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
        reverseOrders,
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
        handleBulkUpdateShopifyOrders,

        sellerBilling,

        getB2BCustomers,
        b2bCustomers,
        handleCreateCustomer,

        handleCreateB2BOrder,
        getB2BOrders,
        b2bOrders,
        handleCreateB2BShipment,
        handleEditB2BOrder,

        B2BcalcRate,
        getInvoices,
        invoices,
        getCodPrice,
        codprice,
        assignedCouriers,
        getSellerAssignedCourier,
        getInvoiceById,

        getBulkCourierPartners

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
