import ImageUpload from "@/components/file-upload";
import { useAdminProvider } from "@/components/providers/AdminProvider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-model-store";

export const ClientBillingUploadModal = () => {
    const { getClientNVendorBillingData } = useAdminProvider();
    const { isOpen, onClose, type } = useModal();

    const isModalOpen = isOpen && type === "ClientBillingUpload";

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-6">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Client Billing Upload
                    </DialogTitle>
                </DialogHeader>

                <ImageUpload
                    uploadUrl='/admin/billing/client-billing/upload-csv'
                    acceptFileTypes={{ "text/csv": [".csv"] }}
                    handleClose={() =>{
                        getClientNVendorBillingData()
                        handleClose();
                    }}
                />
            </DialogContent>
        </Dialog>
    )
};