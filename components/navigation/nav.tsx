"use client"

import React from "react"
import Link from "next/link"
import { ArrowDown, ArrowDownIcon, LucideIcon } from "lucide-react"

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
  }[]

}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const isActive = (href: string) => {
    return pathname === href ? "themeNavActiveBtn" : "themeNavBtn"

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
                    className={cn(
                      buttonVariants({ variant: isActive(link.href || ""), size: "icon" }),
                      "h-9 w-9",
                    )}
                  >
                    <link.icon className="h-4 w-full" />
                    <span className="sr-only">{link.title}</span>
                  </Button>
                )
              }
            </ActionTooltip>
          ) : (
            <React.Fragment key={index}>
              {link.title !== "Finance" ? (
                <Link
                  href={link.href || "/"}
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
                    <button
                      type="button"
                      className={cn(
                        buttonVariants({ variant: isActive(link.href || ""), size: "sm" }),
                        "w-full justify-start",
                      )}
                      onClick={() => { setIsDropdownOpen(!isDropdownOpen) }}
                    >
                      <link.icon className="mr-2 h-4 w-4" /> Finance
                      {/* <ArrowDownIcon className="h-4 w-4 ml-auto" /> */}
                    </button>
                  </div>
                  {
                   isDropdownOpen && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lgring-1 ring-black ring-opacity-5"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div className="py-1" role="none">
                          <Link
                            href="/finance/report"
                            className={cn(
                              buttonVariants({ variant: isActive(link.href || ""), size: "sm" }),
                              "justify-start w-full"
                            )}
                            role="menuitem"
                          >
                            Financial Report
                          </Link>
                          <Link
                            href="/finance/summary"
                            className={cn(
                              buttonVariants({ variant: isActive(link.href || ""), size: "sm" }),
                              "justify-start w-full"
                            )}
                            role="menuitem"
                          >
                            Financial Summary
                          </Link>
                          <Link
                            href="/finance/settings"
                            className={cn(
                              buttonVariants({ variant: isActive(link.href || ""), size: "sm" }),
                              "justify-start w-full"
                            )}
                            role="menuitem"
                          >
                            Finance Settings
                          </Link>
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


    // <div
    //   data-collapsed={isCollapsed}
    //   className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 w-full"
    // >
    //   <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
    //     {links.map((link, index) =>
    //       isCollapsed ? (
    //         <ActionTooltip
    //           key={index}
    //           side="right"
    //           align="start"
    //           label={link.title}
    //         >
    //           <Link
    //             href={link.href || "/"}
    //             className={cn(
    //               buttonVariants({ variant: isActive(link.href || ""), size: "icon" }),
    //               "h-9 w-9",
    //             )}
    //           >
    //             <link.icon className="h-4 w-4" />
    //             <span className="sr-only">{link.title}</span>
    //           </Link>
    //         </ActionTooltip>
    //       ) : (
    //         <Link
    //           key={index}
    //           href={link.href || "/"}
    //           className={cn(
    //             buttonVariants({ variant: isActive(link.href || ""), size: "sm" }),
    //             "justify-start"
    //           )}
    //         >
    //           <link.icon className="mr-2 h-4 w-4" />
    //           {link.title}
    //           {link.label && (
    //             <span
    //               className={cn(
    //                 "ml-auto",
    //               )}
    //             >
    //               {link.label}
    //             </span>
    //           )}
    //         </Link>
    //       )
    //     )}
    //   </nav>
    // </div>
  )
}