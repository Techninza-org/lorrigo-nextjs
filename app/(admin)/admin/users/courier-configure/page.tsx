import { UserB2BCourierConfigure } from "@/components/Admin/User/user-b2b-courier-configure";
import { UserB2BCourierManager } from "@/components/Admin/User/user-b2b-courier-manager";
import { UserConfigure } from "@/components/Admin/User/user-config";
import { UserCourierConfigure } from "@/components/Admin/User/user-courier-configure";
import { UserCourierManager } from "@/components/Admin/User/user-courier-manager";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function CourierConfigurePage() {
    return (
        <>
            <div className="flex gap-3 my-6 w-full">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Manager seller configuration.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-6 items-center">
                        <UserConfigure />
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="b2c">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="b2c">B2C</TabsTrigger>
                    <TabsTrigger value="b2b">B2B</TabsTrigger>
                </TabsList>
                <TabsContent value="b2c">
                    <div className="flex gap-3 my-6 w-full">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Manage User&apos;s B2C Courier</CardTitle>
                                <CardDescription>Assign courier to seller.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserCourierManager />
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Configure User&apos;s B2C Courier</CardTitle>
                                <CardDescription>Manage courier price and toggle courier for user.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserCourierConfigure />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="b2b">
                    <div className="flex gap-3 w-full">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Manage User&apos;s B2B Courier</CardTitle>
                                <CardDescription>Assign courier to seller.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserB2BCourierManager />
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Configure User&apos;s B2B Courier</CardTitle>
                                <CardDescription>Manage courier price and toggle courier for user.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserB2BCourierConfigure />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}