"use client"

import React from "react"
import Link from "next/link"
import { ArrowDown, ArrowDownIcon, ChevronDown, ChevronUp, LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import ActionTooltip from "../action-tooltip"
import { usePathname } from "next/navigation"

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: LucideIcon

    href?: string
    subLinks?: {
      title: string
      href: string
    }[]
  }[]

}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  const DropDownToggleIcon = isDropdownOpen ? ChevronUp : ChevronDown
  const isActive = (href: string) => {
    return pathname.includes(href.toLowerCase()) ? "themeNavActiveBtn" : "themeNavBtn"

  }
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 w-full"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <ActionTooltip
              key={index}
              side="right"
              align="start"
              label={link.title}
            >
              {
                link.href ? (
                  <Link
                    href={link.href || "/"}
                    className={cn(
                      buttonVariants({ variant: isActive(link.href || ""), size: "icon" }),
                      "h-9 w-9",
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                ) : (
                  <Button
                    type="button"
                    variant={isActive(link.title)}
                    size={"icon"}
                    className={"h-9 w-9"}
                  >
                    <link.icon className="h-4" />
                    <span className="sr-only">{link.title}</span>
                  </Button>
                )
              }
            </ActionTooltip>
          ) : (
            <React.Fragment key={index}>
              {link.href ? (
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: isActive(link.href || ""), size: "sm" }),
                    "justify-start"
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                  {link.label && (
                    <span
                      className={cn(
                        "ml-auto",
                      )}
                    >
                      {link.label}
                    </span>
                  )}
                </Link>
              ) : (
                <div className="relative inline-block text-left">
                  <div>
                    <Button
                      type="button"
                      variant={isActive(link.title || "")}
                      size={"sm"}
                      className={"w-full justify-start"}
                      onClick={() => { setIsDropdownOpen(!isDropdownOpen) }}
                    >
                      <link.icon className="mr-2 h-4 w-4" /> {link.label || link.title}
                      <DropDownToggleIcon className="h-4 w-4 ml-auto transition-all" />
                    </Button>
                  </div>
                  {
                    isDropdownOpen && (
                      <div
                        className="w-56"
                      >
                        <div className="py-1" role="none">
                          {
                            link.subLinks?.map((subLink, index) => (
                              <Link
                                key={index}
                                href={subLink.href}
                                className={cn(
                                  buttonVariants({ variant: isActive(link.title || ""), size: "sm" }),
                                  "justify-start w-full bg-opacity-50"
                                )}
                              >
                                {subLink.title}
                              </Link>
                            ))
                          }

                        </div>
                      </div>
                    )
                  }
                </div>
              )}
            </React.Fragment>
          )
        )}
      </nav>
    </div>
  )
}