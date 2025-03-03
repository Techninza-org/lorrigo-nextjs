import { LorrigoLogo } from "@/components/Logos";
import { B2COrderType } from "@/types/types";
import { format } from "date-fns";
import { Square } from "lucide-react";
import Barcode from "react-barcode"

export default function GenerateManifestTemplate({
    orders,
    courierName,
    sellerName,
    manifestId = "MANIFEST-0009"
}: {
    sellerName: string,
    courierName: string,
    orders?: B2COrderType[],
    manifestId?: string
}) {
    return (
        <div className="w-full p-2 sm:p-4 border-black border-double border-2 h-full">
            <div>
                <LorrigoLogo height={140} width={140} />
                <div className="text-center w-full">
                    <div className="text-xl">
                        Lorrigo Manifest
                    </div>
                    <div className="text-xs text-gray-500">
                        Generated on: {format(new Date(), "dd/MM/yyyy, HH:mm a")}
                    </div>
                </div>
            </div>
            <div className="flex justify-between text-sm">
                <div>
                    <div className="max-w-72">
                        Seller: <span className="font-bold text-sm sm:text-lg text-wrap">{sellerName}</span>
                    </div>
                    <div>
                        <div className="max-w-72">
                            Courier: <span className="font-bold text-sm sm:text-lg text-wrap">{courierName}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-col text-end h-full justify-end">
                    <div className="max-w-72">
                        Manifest ID: {manifestId}
                    </div>
                    <div>
                        <div className="max-w-72">
                            Total shipments to dispatch: {orders?.length}
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-y-2 pb-4 pt-2 px-3 my-3 border-gray-400 grid grid-cols-3 md:grid-cols-6 text-xs md:text-sm">
                <div>S.no.</div>
                <div>Order no</div>
                <div className="hidden md:block"></div> {/* Hidden on small screens */}
                <div>AWB no</div>
                <div>Contents</div>
                <div>Barcode</div>
            </div>

            {orders?.map((order, idx) => (
                <div key={order._id || idx} className="grid grid-cols-3 md:grid-cols-6 p-1 px-3 border-b-2 border-gray-300 text-xs md:text-sm">
                    <div>{idx + 1}</div>
                    <div>{order?.order_reference_id}</div>
                    <div className="hidden md:block">
                        <Square />
                    </div> {/* Hidden on small screens */}
                    <div>{order?.awb}</div>
                    <div>
                        {(order.productId?.name?.length ?? 0) > 50
                            ? order?.productId?.name.slice(0, 55).concat('...')
                            : order.productId?.name ?? 'No Name Available'}
                    </div>
                    <div>
                        <Barcode value={`${order?.awb || 'NOAWB'}`} renderer="svg" width={1} height={36} displayValue={false} />
                    </div>
                </div>
            ))}

            <div className="border-y-2 border-dashed font-bold text-xl p-1 pb-3 border-gray-500 text-center my-9">
                To Be Filled By {courierName} Executive
            </div>

            <div className="grid p-0 sm:grid-cols-2 container justify-items-center gap-5">
                <div className="flex items-end gap-2">
                    Pickup Time: <div className="w-40 h-[1.5px] bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    Total items picked: <div className="w-40 h-[1.5px] bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    FE Name: <div className="w-40 h-[1.5px] bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    Seller Name: <div className="w-40 h-[1.5px] bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    FE Signature: <div className="w-40 h-[1.5px] bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    Seller Signature: <div className="w-40 h-[1.5px] bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    FE Phone: <div className="w-40 h-[1.5px] bg-black" />
                </div>
            </div>
            <div className="my-3 text-center">
                This is a system generated document
            </div>
        </div>
    );
};