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
import { usePaymentGateway } from "../providers/PaymentGatewayProvider";
import Link from "next/link";

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
    const { walletBalance } = usePaymentGateway();
    const { seller } = useSellerProvider();

    return (
        <div className="group flex flex-col gap-4 py-2">
            <nav className="flex flex-row justify-between items-center p-2 w-full">
                <div className="flex items-center cursor-pointer space-x-4">
                    <div className="w-20 sm:w-26 md:w-32">
                        <LorrigoLogo />
                    </div>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-3">
                    {/* Wallet Info (Prepaid Only) */}
                    {seller?.config?.isPrepaid && (
                        <div className="flex items-center space-x-1 sm:space-x-3">
                            <Link href="/wallet/txn">
                                <ActionTooltip side="bottom" align="center" label="wallet">
                                    <Button variant="ghost" size="icon">
                                        <Wallet size={20} />
                                    </Button>
                                </ActionTooltip>
                            </Link>
                            <span>{formatCurrencyForIndia(walletBalance || 0)}</span>
                            <Button variant="themeButton" size="sm" onClick={() => onOpen("wallet")}>
                                Recharge Wallet
                            </Button>
                        </div>
                    )}

                    {/* Separator */}
                    {seller?.config?.isPrepaid && (
                        <Separator orientation="vertical" className="w-[1px] bg-gray-400" />
                    )}

                    {/* User Avatar */}
                    <div className="flex items-center">
                        <UserAvatar />
                    </div>
                </div>
            </nav>
        </div>
    );
}

