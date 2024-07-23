import { LorrigoLogo } from "@/components/Logos";
import { B2BOrderType } from "@/types/B2BTypes";
import { format } from "date-fns";
import { Square } from "lucide-react";
import Barcode from "react-barcode"

export default function GenerateB2BManifestTemplate({ order }: { order?: B2BOrderType }) {
    return (
        <div className="w-full p-4 border-black border-double border-2 h-full">
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
            <div className="flex justify-between">
                <div>
                    {/* <div className="max-w-72">
                        Seller: <span className="font-bold text-lg  text-wrap">{order?.}</span>
                    </div> */}
                    <div>
                        <div className="max-w-72">
                            Courier: <span className="font-bold text-lg  text-wrap">{order?.carrierName}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-col text-end h-full justify-end">
                    <div className="max-w-72">
                        Manifest ID: MANIFEST-0009
                    </div>
                    <div>
                        <div className="max-w-72">
                            Total shipments to dispatch : 1
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-y-2 pb-4 pt-2 px-3 my-3 border-gray-400 grid grid-cols-6">
                <div>S.no.</div>
                <div>Order no</div>
                <div></div>
                <div>AWB no</div>
                <div>Contents</div>
                <div>Barcode</div>

            </div>

            <div className="grid grid-cols-6 p-1 px-3 border-b-2 border-gray-300">
                <div>1</div>
                <div>{order?.order_reference_id}</div>
                <div><Square /></div>
                <div>{order?.awb}</div>
                <div>Shoes</div>
                <div>
                    <Barcode value={`${order?.awb}`} renderer="svg" width={1.2} height={36} displayValue={false} />
                </div>
            </div>

            <div className="border-y-2 border-dashed font-bold text-xl p-1 pb-3 border-gray-500 text-center my-9">
                To Be Filled By {order?.carrierName} Executive
            </div>

            <div className="grid  grid-cols-2 container  justify-items-center gap-5">
                <div className="flex items-end gap-2">
                    Pickup Time: <div className="w-40 h-[1.5px]  bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    Total items picked: <div className="w-40 h-[1.5px]  bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    FE Name: <div className="w-40 h-[1.5px]  bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    Seller Name: <div className="w-40 h-[1.5px]  bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    FE Signature: <div className="w-40 h-[1.5px]  bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    Seller Signature: <div className="w-40 h-[1.5px]  bg-black" />
                </div>
                <div className="flex items-end gap-2">
                    FE Phone: <div className="w-40 h-[1.5px]  bg-black" />
                </div>

            </div>
            <div className="text-center my-3">
                <div className="capitalize">{order?.pickupAddress?.address1.toLowerCase()}, {order?.pickupAddress?.city.toLowerCase()}, {order?.pickupAddress?.state.toLowerCase()}</div>
                <div>{order?.pickupAddress?.city.toLowerCase()}, {order?.pickupAddress?.state?.toLowerCase()}-{order?.pickupAddress?.pincode}.</div>
                <div>Contact : <span className="font-bold">+{order?.pickupAddress?.phone}</span></div>
            </div>
            <div className="my-3 text-center">
                This is a system generated document
            </div>
        </div>
    )
}