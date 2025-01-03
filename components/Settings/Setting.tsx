"use client";
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, ChevronRight, ReceiptText, ScrollText, Truck, Wallet, Workflow } from 'lucide-react';

interface LinkItem {
    href: string;
    label: string;
}

interface SettingsCardProps {
    title: string;
    links: LinkItem[];
    logo: any;
}

const SettingsCard = ({ title, links, logo: Icon }: SettingsCardProps) => {
    return (
        <Card className="drop-shadow-md p-2 sm:p-1 rounded-2xl">
            <CardContent className="pt-2 sm:pt-4 h-[187px]">
                <div className="flex">
                    <div className="mr-1 sm:mr-3">
                        <Icon alt="Settings Icon" className="text-red-500" strokeWidth={1.7} size={30} />
                    </div>
                    <div className="grid place-content-center">
                        <h3 className="font-medium text-lg">{title}</h3>
                    </div>
                </div>
                <div className="grid mx-4 sm:mx-12 gap-1 my-2 sm:my-3">
                    {links.map(({ href, label }, index) => (
                        <Link key={index} href={href}>
                            <div className="flex justify-between text-sm hover:text-gray-500">
                                <p>{label}</p>
                                <ChevronRight size={18} />
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};


const Settings = () => {
    const settingsData = [
        {
            title: 'Company',
            links: [
                { href: '/settings/company/company-profile', label: 'Company Profile' },
                { href: '/settings/company/kyc', label: 'KYC' },
                { href: '/settings/company/change-password', label: 'Change Password' },
            ],
            logo: Building2,
        },
        {
            title: 'COD Payments',
            links: [{ href: '/settings/cod-payments/bank-details', label: 'Bank Details' }],
            logo: Wallet,
        },
        {
            title: 'Billing',
            links: [
                { href: '/settings/billing/gstin-invoicing', label: 'GSTIN Invoicing' },
                { href: '/settings/billing/billing-address', label: 'Billing Address' },
            ],
            logo: ReceiptText,
        },
        {
            title: 'Pickup Address',
            links: [
                {
                    href: '/settings/pickup-address/manage-pickup-addresses',
                    label: 'Manage Pickup Addresses',
                },
            ],
            logo: Truck,
        },
        {
            title: 'Couriers Price',
            links: [{ href: '/settings/courier-price', label: 'Courier Price' }],
            logo: Workflow,
        },
        {
            title: 'Channels',
            links: [{ href: '/settings/manage-channels', label: 'Manage Channels' }],
            logo: Workflow,
        },
        {
            title: 'Policies',
            links: [
                { href: '/settings/policies/privacy', label: 'Privacy' },
                { href: '/settings/policies/refund', label: 'Refund' },
                { href: '/settings/policies/shipment-and-delivery', label: 'Shipment and Delivery' },
                { href: '/settings/policies/terms-and-conditions', label: 'Terms and Conditions' },
            ],
            logo: ScrollText,
        },
    ];

    return (
        <div>
            <h1 className="py-5 text-2xl font-semibold">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 pb-5">
                {settingsData.map((data, index) => (
                    <SettingsCard key={index} title={data.title} links={data.links} logo={data.logo} />
                ))}
            </div>
        </div>
    );
};

export default Settings;
