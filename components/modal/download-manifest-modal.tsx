import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-model-store";
import { GenerateB2BManifest, GenerateManifest } from "../Invoice_manifest";

export const DownloadManifestModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const { order } = data;

    const isModalOpen = isOpen && type === "downloadManifest";

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 max-w-screen-xl">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Download Manifest for Order #{order?.order_reference_id}
                    </DialogTitle>
                </DialogHeader>

                <GenerateManifest order={order} />

            </DialogContent>
        </Dialog>
    )
};

export const DownloadB2BManifestModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const { b2bOrder: order } = data;

    const isModalOpen = isOpen && type === "downloadB2BManifest";

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 max-w-screen-xl">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Download Manifest for Order #{order?.order_reference_id}
                    </DialogTitle>
                </DialogHeader>

                <GenerateB2BManifest order={order as any} />

            </DialogContent>
        </Dialog>
    )
};