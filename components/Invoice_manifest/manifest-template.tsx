import { LorrigoLogo } from "@/components/Logos";
import { B2COrderType } from "@/types/types";
import { Square } from "lucide-react";
import Barcode from "react-barcode"

export default function GenerateManifestTemplate({ order }: { order?: B2COrderType }) {

    return (
        <div className="w-full p-4 border-black border-double border-2">
            <div>
                <LorrigoLogo height={140} width={140} className="fixed" />
                <div className="text-center w-full">
                    <div className="text-xl">
                        Lorrigo Manifest
                    </div>
                    <div className="text-xs text-gray-500">
                        Generated on: April 2, 2024, 5:45 pm
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <div>
                    <div className="max-w-72">
                        Seller: <span className="font-bold text-lg  text-wrap">DIAFORAISON SERVICES PRIVATE LIMITED</span>
                    </div>
                    <div>
                        <div className="max-w-72">
                            Courier: <span className="font-bold text-lg  text-wrap">Blue Dart Surface</span>
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
                <div>ORD-0001</div>
                <div><Square /></div>
                <div>AWB-0001</div>
                <div>Shoes</div>
                <div>
                    <Barcode value={`${order?.awb}`} renderer="svg" width={1.2} height={36} displayValue={false} />
                </div>
            </div>

            <div className="border-y-2 border-dashed font-bold text-xl p-1 pb-3 border-gray-500 text-center my-9">
                To Be Filled By Blue Dart Surface Logistics Executive
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
                <div>Number 3192, 7th Main Rd, near E.S.I. Hospital, Indiranagar, Bengaluru, Karnataka</div>
                <div>Bangalore,Karnataka-560038.</div>
                <div>Contact : <span className="font-bold">9999558553</span></div>
            </div>
            <div className="my-3 text-center">
            This is a system generated document
            </div>
        </div>
    )
}