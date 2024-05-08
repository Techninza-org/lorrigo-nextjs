import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from "../file-upload"

import { useModal } from "@/hooks/use-model-store";

export const BulkPincodeUploadModal = () => {
    const { isOpen, onClose, type } = useModal();

    const isModalOpen = isOpen && type === "BulkPincodeUpload";

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-6">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Bulk Pincode Upload
                    </DialogTitle>
                </DialogHeader>

                <ImageUpload maxFiles={1}  uploadUrl={'http://localhost:4000/api/admin/pincodes'}/>
            </DialogContent>
        </Dialog>
    )
};