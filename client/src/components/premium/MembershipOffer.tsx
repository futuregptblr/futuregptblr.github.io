import React, { useEffect, useMemo, useState } from 'react';
import { Crown, CheckCircle2, Clock } from 'lucide-react';
import PremiumMembershipCard from './PremiumMembershipCard';
import type { User } from '../../types';

function getOfferExpiry(): number {
	const key = 'membershipOfferStartAt';
	const startRaw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
	let startAt = startRaw ? Number(startRaw) : NaN;
	if (!startRaw || Number.isNaN(startAt)) {
		startAt = Date.now();
		try { localStorage.setItem(key, String(startAt)); } catch {}
	}
	const twentyFourHoursMs = 24 * 60 * 60 * 1000;
	return startAt + twentyFourHoursMs;
}

const benefits: string[] = [
	'Access to exclusive premium events',
	'Priority registration for workshops',
	'Direct networking with industry leaders',
	'Premium job board access',
	'Exclusive premium community channels',
	'Early access to new features',
	'Premium member badge',
	'Membership valid for 2 years',
];

interface MembershipOfferProps {
	user: User | null;
}

function formatTime(msRemaining: number): string {
	if (msRemaining <= 0) return '00:00:00';
	const totalSeconds = Math.floor(msRemaining / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	const two = (v: number) => String(v).padStart(2, '0');
	return `${two(hours)}:${two(minutes)}:${two(seconds)}`;
}

const MembershipOffer: React.FC<MembershipOfferProps> = ({ user: initialUser }) => {
	// Resolve user from prop or localStorage to ensure CTA is available after login
	const user: User | null = useMemo(() => {
		if (initialUser) return initialUser;
		try {
			const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
			return raw ? (JSON.parse(raw) as User) : null;
		} catch {
			return null;
		}
	}, [initialUser]);

	const expiryTs = useMemo(() => getOfferExpiry(), []);
	const [now, setNow] = useState(Date.now());
	const isDiscountActive = now < expiryTs;
	const remaining = Math.max(0, expiryTs - now);

	useEffect(() => {
		const id = window.setInterval(() => setNow(Date.now()), 1000);
		return () => window.clearInterval(id);
	}, []);

	if (user?.isPremium) {
		return (
			<div className="pt-20 bg-gradient-to-b from-yellow-50 to-white">
				<div className="max-w-4xl mx-auto px-4">
					<div className="bg-white rounded-2xl shadow-lg border border-yellow-200 overflow-hidden">
						<div className="p-6 md:p-8">
							<div className="flex items-center mb-3">
								<Crown className="h-8 w-8 text-yellow-600 mr-2" />
								<h2 className="text-2xl font-bold text-yellow-800">You're already Premium</h2>
							</div>
							<p className="text-yellow-700">Enjoy your benefits on the dashboard.</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="pt-16 md:pt-20 bg-gradient-to-b from-blue-50 via-white to-white">
			<div className="max-w-6xl mx-auto px-4">
				{/* Hero / Header */}
				<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
					<div className="absolute -top-24 -right-24 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
					<div className="absolute -bottom-24 -left-24 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
					<div className="relative p-6 md:p-10">
						<div className="flex items-center gap-2 mb-3">
							<Crown className="h-7 w-7" />
							<span className="text-sm md:text-base font-medium tracking-wide">Premium Membership</span>
						</div>
						<h1 className="text-2xl md:text-4xl font-extrabold leading-tight">Unlock everything for 2 years</h1>
						<p className="mt-2 md:mt-3 text-white/90 max-w-2xl">Exclusive events, priority workshops, premium job board, direct networking, and more.</p>

						<div className="mt-5 flex flex-col md:flex-row md:items-center gap-3">
							{isDiscountActive ? (
								<div className="inline-flex items-center gap-2 rounded-full bg-white text-blue-700 px-4 py-2 shadow">
									<Clock className="h-4 w-4" />
									<span className="text-sm font-semibold">50% OFF ends in {formatTime(remaining)}</span>
								</div>
							) : (
								<div className="inline-flex items-center gap-2 rounded-full bg-white/90 text-blue-900 px-4 py-2">
									<span className="text-sm font-semibold">Launch offer ended</span>
								</div>
							)}
							<div className="text-sm md:ml-2 text-white/90">Regular price <span className="line-through">₹9,999</span> · Today <span className="font-bold">₹4,999</span></div>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
					{/* Benefits */}
					<div className="lg:col-span-3">
						<div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Everything included</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{benefits.map((b) => (
									<div key={b} className="flex items-start text-sm text-gray-700">
										<CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
										<span>{b}</span>
									</div>
								))}
							</div>
							<div className="mt-4 rounded-lg bg-blue-50 text-blue-800 text-sm p-3">Membership validity: <strong>2 years</strong></div>

							{/* Value stats to enrich left column */}
							<div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
								<div className="rounded-lg border border-gray-200 p-4 text-center">
									<div className="text-xl font-extrabold text-gray-900">200+</div>
									<div className="text-xs text-gray-600">Premium events</div>
								</div>
								<div className="rounded-lg border border-gray-200 p-4 text-center">
									<div className="text-xl font-extrabold text-gray-900">1,000+</div>
									<div className="text-xs text-gray-600">Active members</div>
								</div>
								<div className="rounded-lg border border-gray-200 p-4 text-center">
									<div className="text-xl font-extrabold text-gray-900">2 years</div>
									<div className="text-xs text-gray-600">Full access period</div>
								</div>
							</div>

							{/* Testimonials to balance layout visually */}
							<div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
								<div className="rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-4">
									<p className="text-sm text-gray-700">“Premium helped me land two interviews through the job board and meet mentors I still talk to.”</p>
									<div className="mt-2 text-xs text-gray-500">— Ananya, Data Scientist</div>
								</div>
								<div className="rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-4">
									<p className="text-sm text-gray-700">“Workshops were top-notch and the community access is totally worth it.”</p>
									<div className="mt-2 text-xs text-gray-500">— Rohan, Product Engineer</div>
								</div>
							</div>
						</div>
					</div>

					{/* Pricing + CTA */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
							<div className="mb-4">
								<div className="text-sm text-gray-600">Price</div>
								<div className="flex items-end gap-3 mt-1">
									{isDiscountActive && (
										<span className="text-3xl font-extrabold text-blue-700">₹4,999</span>
									)}
									<span className={`${isDiscountActive ? 'line-through text-gray-400' : 'text-gray-900 font-extrabold text-3xl'}`}>₹9,999</span>
								</div>
								{isDiscountActive && (
									<div className="mt-1 inline-flex items-center text-xs font-semibold text-red-700 bg-red-50 px-2 py-1 rounded-full">Limited-time 50% OFF</div>
								)}
							</div>

							<div className="mt-2">
								{user ? (
									<PremiumMembershipCard user={user} onPurchaseSuccess={() => {}} />
								) : (
									<div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
										Please log in to purchase. Your 24-hour discount will be preserved on this device.
									</div>
								)}
							</div>

							<div className="mt-4 text-xs text-gray-500">Secured payment. Instant activation. No hidden fees.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MembershipOffer;


