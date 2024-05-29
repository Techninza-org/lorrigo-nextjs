import { Button, buttonVariants } from "../ui/button";
import { formatCurrencyForIndia } from "@/lib/utils";
import ActionTooltip from "../action-tooltip";
import { Menu, Wallet } from "lucide-react";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { useModal } from "@/hooks/use-model-store";
import { useAuth } from "../providers/AuthProvider";
import { LorrigoLogo } from "../Logos";
import { UserAvatar } from "../user-avatar";
import { useSellerProvider } from "../providers/SellerProvider";

interface NavProps {
    isCollapsed: boolean;
    links: {
        title: string;
        label?: string;
        icon: React.ComponentType;
        variant: "default" | "ghost";
    }[];
}

export function TopNav() {
    const { onOpen } = useModal();
    const { seller } = useSellerProvider();
    const walletBalance= seller?.walletBalance || 0;

    return (
        <div
            className="group flex flex-col gap-4 py-2 "
        >
            <nav className="flex justify-between gap-1 px-5 min-w-full p-2">
                <div className="flex space-x-4 cursor-pointer items-center">
                    <LorrigoLogo />

                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <ActionTooltip
                            side="bottom"
                            align="center"
                            label="wallet"
                        >
                            <Button variant={"ghost"} size={"icon"}><Wallet size={24} /></Button>
                        </ActionTooltip>
                        <span>{formatCurrencyForIndia(walletBalance)}</span>
                        <Button variant={"themeButton"} size={"sm"} onClick={() => onOpen("wallet")}>Recharge Wallet</Button>
                    </div>

                    <Separator orientation="vertical" className="w-[1px] bg-gray-400" />

                    <UserAvatar />
                </div>
            </nav>
        </div>
    );
}