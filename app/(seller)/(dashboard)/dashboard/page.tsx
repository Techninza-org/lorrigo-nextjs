import { DataAnalysis } from "@/components/Dashboard/data-analysis"
import { Overview } from "@/components/Dashboard/overview"
import { axiosIWAuth } from "@/lib/axiosConfig"


export default async function DashboardPage() {
  return (
    <div className="space-y-5">
      <Overview />
      <DataAnalysis/>
    </div>
  )
}