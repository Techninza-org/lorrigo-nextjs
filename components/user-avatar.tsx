"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "./providers/AuthProvider";
import { UserRound } from "lucide-react";

export function UserAvatar() {
    const { user, handleSignOut } = useAuth();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="relative h-8 w-8 rounded-full ">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                           <Button size={"icon"} className="text-xl" variant={"ghost"}>
                            {user?.name?.split('')[0]}
                           </Button>
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/orders">
                        <DropdownMenuItem>
                            Your Orders
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
