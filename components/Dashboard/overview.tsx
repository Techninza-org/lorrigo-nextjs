"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calculator, MoveUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSellerProvider } from "../providers/SellerProvider"

export const Overview = () => {
  const { business } = useSellerProvider()
  return (
    <div className="lg:flex gap-3 flex-wrap">

      {
        business == "D2B" ? (
          <Card className="max-w-screen-lg flex-1 shadow-lg">
            <CardHeader>
              <CardTitle>B2B Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <Image src="/assets/b2c.png" width={50} height={50} alt="B2C" />
                <h4 className="scroll-m-20 text-base font-medium tracking-tight">
                  Bulk Order
                </h4>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button className={buttonVariants({ variant: "webPageBtn" })} disabled>Coming Soon...<MoveUpRight size={15} className="mx-1" /></Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="max-w-screen-lg flex-1 shadow-lg">
            <CardHeader>
              <CardTitle>D2C Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <Image src="/assets/b2c.png" width={50} height={50} alt="B2C" />
                <h4 className="scroll-m-20 text-base font-medium tracking-tight">
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
        )
      }
      <Card className="max-w-screen-lg flex-1 shadow-lg">
        <CardHeader>
          <CardTitle>Rate Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <Calculator size={50} strokeWidth={1.25} color="gray" />
            <h4 className="scroll-m-20 text-base font-medium tracking-tight">
              Rate Calculator
            </h4>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href={'/rate-calc'} className={buttonVariants({ variant: "webPageBtn" })}>Explore Now<MoveUpRight size={15} className="mx-1" /></Link>
        </CardFooter>
      </Card>
    </div>
  )
}