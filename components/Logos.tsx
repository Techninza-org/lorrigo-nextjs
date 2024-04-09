import Image from "next/image"
import LorrigoLogoSVG from "@/public/assets/lorrigologo.svg";


export const LorrigoLogo  = ({width=120, height=120}: {width?: number, height?: number}) =>{
    return (
        <Image src={LorrigoLogoSVG} width={width} height={height} alt="logo" />
    )
}