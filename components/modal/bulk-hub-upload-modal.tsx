import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from "../file-upload"

import { useModal } from "@/hooks/use-model-store";

export const BulkHubUploadModal = () => {
    const { isOpen, onClose, type } = useModal();

    const isModalOpen = isOpen && type === "BulkHubUpload";

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-6">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Bulk Hub Upload
                    </DialogTitle>
                </DialogHeader>

                <ImageUpload
                    handleClose={handleClose}
                uploadUrl="/hub/bulk-hub-upload"
                acceptFileTypes={{ "text/csv": [".csv"] }}
                />
            </DialogContent>
        </Dialog>
    )
};