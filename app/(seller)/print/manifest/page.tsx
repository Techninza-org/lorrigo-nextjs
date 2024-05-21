"use client"
import { GenerateBulkManifest } from "@/components/Invoice_manifest";

import { useModal } from "@/hooks/use-model-store";
import { useRouter } from "next/navigation";

export default function GenerateManifestPage() {
  const router = useRouter();

  const { type, data, isOpen } = useModal();
  const isModalOpen = isOpen && type === "downloadManifests";
  if(!data || !isModalOpen || !data.orders) router.back()
  return (
    <GenerateBulkManifest  orders={data.orders || []}/>
  );
}