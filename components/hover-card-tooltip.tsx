import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface HoverCardToolTipProps {
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    label?: string;
    children: React.ReactNode;
    className?: string;
    Icon?: React.ReactNode;
    triggerClassName?: string;
}
const HoverCardToolTip = ({
    side,
    align,
    label,
    children,
    className,
    Icon,
    triggerClassName,
}: HoverCardToolTipProps) => {
    return (
        <HoverCard openDelay={50}>
            <HoverCardTrigger
                className={cn("text-blue-900  cursor-pointer w-min text-nowrap capitalize",
                    !Icon && "border-dashed border-b border-blue-600 underline-offset-1",
                    triggerClassName
                )}
            >
                {label}{Icon}
            </HoverCardTrigger>
            <HoverCardContent side={side} align={align} className={className}>
                {children}
            </HoverCardContent>
        </HoverCard>
    );
};

export default HoverCardToolTip;
