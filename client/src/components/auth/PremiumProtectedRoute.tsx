import React from 'react';
import { Navigate } from 'react-router-dom';

interface PremiumProtectedRouteProps {
	children: React.ReactNode;
}

export function PremiumProtectedRoute({ children }: PremiumProtectedRouteProps) {
	const token = localStorage.getItem('token');
	const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
	const user = userRaw ? JSON.parse(userRaw) as { isPremium?: boolean } : null;

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	if (!user?.isPremium) {
		return <Navigate to="/membership-offer" replace />;
	}

	return <>{children}</>;
}


