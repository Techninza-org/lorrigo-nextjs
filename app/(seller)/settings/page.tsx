import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface LinkItem {
  href: string;
  label: string;
}

interface SettingsCardProps {
  title: string;
  links: LinkItem[];
  logo: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, links, logo }) => (
  <Card className="drop-shadow-md p-1 rounded-2xl">
    <CardContent className='pt-4 h-[187px]'>
      <div className='flex'>
        <div className="mr-3">
          <Image src={logo} alt="Settings Icon" width={30} height={30}/>
        </div>
        <div className='grid place-content-center'>
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
      </div>
      <div className="grid mx-12 gap-1 my-3">
        {links.map(({ href, label }, index) => (
          <Link key={index} href={href}>
            <div className='flex justify-between text-sm hover:text-gray-500'>
              <p>{label}</p>
              <ChevronRight size={18}/>
            </div>
          </Link>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Settings = () => {
  const settingsData = [
    {
      title: 'Company',
      links: [
        { href: '/settings/company/company-profile', label: 'Company Profile' },
        { href: '/settings/company/kyc', label: 'KYC' },
        { href: '/settings/company/change-password', label: 'Change Password' }
      ],
      logo: '/assets/clarity_building-line.png'
    },
    {
      title: 'COD Payments',
      links: [
        { href: '/settings/cod-payments/bank-details', label: 'Bank Details' },
        { href: '/settings/cod-payments/postpaid', label: 'Postpaid' }
      ],
      logo: '/assets/cod.png'
    },
    {
      title: 'Billing',
      links: [
        { href: '/settings/billing/gstin-invoicing', label: 'GSTIN Invoicing' },
        { href: '/settings/billing/billing-address', label: 'Billing Address' }
      ],
      logo: '/assets/billing.png'
    },
    {
      title: 'Pickup Address',
      links: [
        { href: '/settings/pickup-address/manage-pickup-addresses', label: 'Manage Pickup Addresses' }
      ],
      logo: '/assets/pickup.png'
    }
  ];

  return (
    <div>
      <h1 className='py-5 text-2xl font-semibold'>Settings</h1>
      <div className='grid grid-cols-3 gap-14 pb-5'>
        {settingsData.map((data, index) => (
          <SettingsCard key={index} title={data.title} links={data.links} logo={data.logo}/>
        ))}
      </div>
    </div>
  );
};

export default Settings;
