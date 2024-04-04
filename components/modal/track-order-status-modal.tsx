import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-model-store";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

export const TrackOrderStatusModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const {order} = data;

    const isModalOpen = isOpen && type === "trackModal";

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Package status
                    </DialogTitle>
                    <DialogDescription>
                        Order ID: {order?.order_reference_id}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col md:grid grid-cols-12 text-gray-50 px-6 py-4">

                  {
                    order?.orderStages?.map((stage)=>{
                        return (
                            <div key={stage.stage} className="flex md:contents">
                            <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
                                <div className="h-full w-6 flex items-center justify-center">
                                    <div className={cn("h-full w-1 bg-green-500 pointer-events-none", stage.stage == -1 ? "bg-red-600" : "")}></div>
                                </div>
                                <div className={cn("w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-green-500 shadow text-center", stage.stage == -1 ? "bg-red-600" : "" )}>
                                </div>
                            </div>
                            <div className={cn("bg-green-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full", stage.stage == -1 ? "bg-red-600" : "")}>
                                <h3 className="font-medium mb-1">{stage.action}</h3>
                                <div className="text-xs leading-tight text-justify w-full">
                                   {formatDate(`${stage?.stageDateTime}`, 'dd-MM-yyyy | HH:mm a')}
                                </div>
                            </div>
                        </div>
    
                        )
                    })
                  }
                    
                </div>
            </DialogContent>
        </Dialog>
    )
};