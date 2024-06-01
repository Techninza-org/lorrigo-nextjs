import { OrderTrackInfo } from "@/components/Orders/order-track-info";
import Image from "next/image";
import LorrigoLogo from "@/components/SVGs/lorrigologo.svg"

export default function TrackOrder() {
    return (
        <div className="container px-24 py-16">
            <Image src={LorrigoLogo} width={300} height={300} alt="Track Order" />
            <OrderTrackInfo />
        </div>
    )
}