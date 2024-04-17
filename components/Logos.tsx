import Image from "next/image"
import LorrigoLogoSVG from "@/public/assets/lorrigologo.svg";


export const LorrigoLogo  = ({width=120, height=120, className}: {width?: number, height?: number, className?: string}) =>{
    return (
        <Image src={LorrigoLogoSVG} width={width} height={height} alt="logo" className={className} />
    )
}