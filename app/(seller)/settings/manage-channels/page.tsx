import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import ShopifyLogoPNG from '@/components/SVGs/shopify-logo.png';
import { ChannelIntegrationForm } from "@/components/Channel/channel-integration-form";

export default function ManageChannels() {
    return (
        <Card>
            <CardTitle className='px-7 py-5 font-semibold'>Connect with Shopify</CardTitle>
            <CardContent className='space-y-3 lg:grid grid-cols-3'>
                <div className="space-y-3">
                    <Image src={ShopifyLogoPNG} alt='Shopify' width={200} height={200} />
                    <p className="text-gray-500">Shopify Cart</p>
                    <p className="text-red-400 text-sm">Use the following instruction to integrate Shopify: </p>
                    <ul className="list-decimal pl-4 text-slate-600">
                        <li>Login to Shopify Admin Panel.</li>
                        <li>Go to Apps.</li>
                        <li>Click on Private Apps Button.</li>
                        <li>Click on Create a Private App.</li>
                        <li>Enter Title under the Description and click on save.</li>
                        <li>Click on Title, you enterned earlier.</li>
                        <li>Here you will find Shopiify API key, Password, Shared Secrete.</li>
                        <li>Copy the identifiers and integrate the channel.</li>
                    </ul>
                </div>
                <div className="space-y-3 col-span-2">
                    <ChannelIntegrationForm />
                </div>
            </CardContent>
        </Card>
    );
}