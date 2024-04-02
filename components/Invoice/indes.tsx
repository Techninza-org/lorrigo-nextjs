import Image from "next/image";
import { Separator } from "../ui/separator";

export const InvoicePage = () => {
    return (
        <div className="border border-gray-400 rounded-sm p-3 w-[27rem]">
            <div className="flex justify-between">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Ship To:
                </h4>
                <Image src={"/assets/logogosog.png"} width={120} height={120} alt="logo" />
            </div>
            <div>
                <div>XYZ Person Name</div>
                <div>house no B - 279, Sector 16, Nandangar</div>
                <div>Gurgaon, Haryana</div>
                <div>414542</div>
                <div>Phone: 9514688756</div>
            </div>
            <Separator orientation="horizontal" className="my-3 bg-gray-400" />
            <div className="grid grid-cols-2">
                <div>
                    <div>Dimensions: 10x10x10</div>
                    <div>Weight: 10 KG</div>
                    <div>Payment: COD</div>
                    <div className="font-bold">(Collect Rs 2000)</div>
                    <div>Courier delivery</div>
                    <div>AWB: 545481531512212</div>
                    <div>SID: LS4585685124156</div>
                </div>
                <div className="row-span-7  justify-items-center">
                {/* <Barcode value="http://github.com/kciter" />, */}
                </div>
            </div>
            <Separator orientation="horizontal" className="my-3 bg-gray-400" />
        </div>
    );
}