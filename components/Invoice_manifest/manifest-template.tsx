import { LorrigoLogo } from "@/components/Logos";
import { B2COrderType } from "@/types/types";

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
        </div>
    )
}