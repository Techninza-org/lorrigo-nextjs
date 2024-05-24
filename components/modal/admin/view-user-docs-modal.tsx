import { Alert, AlertTitle } from "@/components/ui/alert";
import { CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useModal } from "@/hooks/use-model-store";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const ViewUserDocsModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const { seller } = data;

    const isModalOpen = isOpen && type === "ViewUserDocsAdmin";

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:text-white text-black p-0 max-w-screen-xl">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        View User Documents
                    </DialogTitle>
                </DialogHeader>
                <CardContent>
                    <div className='p-3 flex gap-3'>
                        <div>
                            <Image src={`data:image/jpeg;base64,${seller?.kycDetails?.photoUrl || ""}`} alt="photo" className="rounded-md shadow-md" width={530} height={530} />
                        </div>
                        <div className='w-full'>
                            <div className='flex justify-between w-full px-3 py-4'>
                                <p className='space-x-2'><span className='text-gray-500'>KYC Status:</span> <span className={cn(seller?.kycDetails.verified ? "text-green-500" : "text-yellow-500")}>{seller?.kycDetails.verified ? "Verified" : "Pending"}</span></p>
                                <p className='space-x-2'><span className='text-gray-500'>Current business type:</span> <span className='capitalize'>{seller?.kycDetails.businessType}</span></p>
                            </div>
                            <Separator orientation='horizontal' />
                            <div className='flex w-full p-5'>
                                <div className='w-full space-y-3'>
                                    <div className='grid grid-cols-2'>
                                        <div>Document 1 Type:</div>
                                        <div className='capitalize'>{seller?.kycDetails.document1Type}</div>
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <div>Document 1 No:</div>
                                        <div className='capitalize'>{seller?.kycDetails.document1Feild || 1}</div>
                                    </div>
                                    <div className='space-y-3'>
                                        <div className="font-semibold">Document 1 Front Image:</div>
                                        <Image
                                            src={`data:image/jpeg;base64,${seller?.kycDetails?.document1Front || ""}`}
                                            alt="photo"
                                            className="rounded-md shadow-md"
                                            width={300} height={300}
                                        />
                                    </div>
                                    <div className='space-y-3'>
                                        <div className="font-semibold">Document 1 Back Image:</div>
                                        <Image
                                            src={`data:image/jpeg;base64,${seller?.kycDetails?.document1Back  || ""}`}
                                            alt="photo"
                                            className="rounded-md shadow-md"
                                            width={300} height={300}
                                        />
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <div className='grid grid-cols-2'>
                                        <div>Document 2 Type:</div>
                                        <div className='capitalize'>{seller?.kycDetails.document2Type || 2}</div>
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <div>Document 2 No:</div>
                                        <div className='capitalize'>{seller?.kycDetails.document2Feild || 2}</div>
                                    </div>
                                    <div className='space-y-3'>
                                        <div className="font-semibold">Document 2 Front Image:</div>
                                        <Image
                                            src={`data:image/jpeg;base64,${seller?.kycDetails?.document2Front  || ""}`}
                                            alt="photo"
                                            className="rounded-md shadow-md"
                                            width={300} height={300}
                                        />
                                    </div>
                                    <div className='space-y-3'>
                                        <div className="font-semibold">Document 2 Back Image:</div>
                                        <Image
                                            src={`data:image/jpeg;base64,${seller?.kycDetails?.document2Back  || ""}`}
                                            alt="photo"
                                            className="rounded-md shadow-md"
                                            width={300} height={300}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </CardContent>

            </DialogContent>
        </Dialog>
    )
};