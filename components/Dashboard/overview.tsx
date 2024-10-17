"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building2, Calculator, MoveUpRight } from "lucide-react"
import Link from "next/link"
import { useSellerProvider } from "../providers/SellerProvider"

export const Overview = () => {
  const { business } = useSellerProvider()

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
      {
        business == "B2B" ? (
          <>
            <Card className="w-full lg:w-1/2 shadow-lg">
              <CardHeader>
                <CardTitle>B2B Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <Building2 size={50} color="#787878" />
                  <h4 className="scroll-m-20 text-base font-medium tracking-tight text-center">
                    Create B2B Shipment
                  </h4>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Link href="/new/b2b" className={buttonVariants({ variant: "webPageBtn" })}>
                  Create B2B Shipment
                  <MoveUpRight size={15} className="mx-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="w-full lg:w-1/2 shadow-lg">
              <CardHeader>
                <CardTitle>B2B Rate Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <Calculator size={50} color="#787878" />
                  <h4 className="scroll-m-20 text-base font-medium tracking-tight text-center">
                    B2B Rate Calculator
                  </h4>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Link href={'/rate-calc/b2b'} className={buttonVariants({ variant: "webPageBtn" })}>
                  Explore Now
                  <MoveUpRight size={15} className="mx-1" />
                </Link>
              </CardFooter>
            </Card>
          </>
        ) : (
          <>
            <Card className="w-full lg:w-1/2 shadow-lg">
              <CardHeader>
                <CardTitle>D2C Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <Building2 size={50} color="#787878" />
                  <h4 className="scroll-m-20 text-base font-medium tracking-tight text-center">
                    Create Forward Shipment
                  </h4>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Link href={'/new/b2c'} className={buttonVariants({ variant: "webPageBtn" })}>
                  Create Shipment
                </Link>
              </CardFooter>
            </Card>

            <Card className="w-full lg:w-1/2 shadow-lg">
              <CardHeader>
                <CardTitle>Rate Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <Calculator size={50} color="#787878" />
                  <h4 className="scroll-m-20 text-base font-medium tracking-tight text-center">
                    Rate Calculator
                  </h4>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Link href={'/rate-calc'} className={buttonVariants({ variant: "webPageBtn" })}>
                  Explore Now
                  <MoveUpRight size={15} className="mx-1" />
                </Link>
              </CardFooter>
            </Card>
          </>
        )
      }
    </div>


  )
}
