import KycProvider from '@/components/providers/KycProvider'

export default function KycLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<h1 className='py-5 text-2xl font-semibold'>KYC</h1>
			<KycProvider>
				{children}
			</KycProvider>
		</div>
	)
}