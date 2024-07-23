import Image from "next/image";
import LorrigoLogo from "@/components/SVGs/lorrigologo.svg"
import { B2BOrderTrackInfo } from "@/components/Orders/b2b/b2border-track-info";

export default function TrackOrder() {
    return (
        <div className="container px-24 py-16">
            <Image src={LorrigoLogo} width={300} height={300} alt="Track Order" />
            <B2BOrderTrackInfo />
        </div>
    )
}