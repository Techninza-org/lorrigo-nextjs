"use client"

import * as React from "react"
import {
    LucideIcon,
    Filter,
    CircleXIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Status = {
    value: string
    label: string
    icon: LucideIcon
}

export function OrderStatusFilter({
    onChange,
    statuses,
    value,
}: {
    onChange: (status: Status | null) => void
    statuses: Status[]
    value: Status | null
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className={cn("flex items-center space-x-1")}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="webPageBtn"
                        className=" justify-start p-3 min-w-32"
                    >
                        {value ? (
                            <>
                                <value.icon className="mr-2 h-4 w-4 shrink-0" />
                                {value.label}
                            </>
                        ) : (
                            <><Filter className="h-4 w-4 mr-2" />Set status</>
                        )}
                    </Button>
                </PopoverTrigger>
                <>
                    {value?.label && <Button
                        variant="webPageBtn"
                        size={'icon'}
                        onClick={() => onChange(null)}
                    >
                        <CircleXIcon size={17}/>
                    </Button>}
                </>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Change status..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((status) => (
                                    <CommandItem
                                        key={status.value}
                                        value={status.value}
                                        onSelect={(value) => {
                                            onChange(
                                                statuses.find((priority) => priority.value === value) ||
                                                null
                                            )
                                            setOpen(false)
                                        }}
                                    >
                                        <status.icon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                status.value === value?.value
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                            )}
                                        />
                                        <span>{status.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
