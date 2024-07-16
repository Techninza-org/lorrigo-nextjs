import { UserB2BCourierConfigure } from "@/components/Admin/User/user-b2b-courier-configure";
import { UserB2BCourierManager } from "@/components/Admin/User/user-b2b-courier-manager";
import { UserCourierConfigure } from "@/components/Admin/User/user-courier-configure";
import { UserCourierManager } from "@/components/Admin/User/user-courier-manager";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function CourierConfigurePage() {
    return (
        <>
            <div className="flex gap-3 my-6 w-full">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Manage User&apos;s Courier</CardTitle>
                        <CardDescription>Assign courier to seller.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserCourierManager />
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Configure User&apos;s Courier</CardTitle>
                        <CardDescription>Manage courier price and toggle courier for user.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserCourierConfigure />
                    </CardContent>
                </Card>
            </div>
            <div className="flex gap-3 w-full">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Manage User&apos;s Courier</CardTitle>
                        <CardDescription>Assign courier to seller.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserB2BCourierManager />
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Configure User&apos;s Courier</CardTitle>
                        <CardDescription>Manage courier price and toggle courier for user.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserB2BCourierConfigure />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}