"use client"
import { InvoiceBulk } from "@/components/Invoice_manifest";
import { useModal } from "@/hooks/use-model-store";
import { useRouter } from "next/navigation";

export default function InvoicePage() {
  const router = useRouter();

  const { onClose, type, data, isOpen } = useModal();
  const isModalOpen = isOpen && type === "downloadLabels";
  if(!data || !isModalOpen || !data.orders) router.back()
  return (
    <InvoiceBulk orders={data.orders || []} />
  );
}