// src/app/role/RoleGate.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

type Role = 'patient' | 'doctor';
type RoleContextValue = {
    role: Role | null;
    setRole: (r: Role) => void;
    loading: boolean;
    error?: string;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function useRole() {
    const ctx = useContext(RoleContext);
    if (!ctx) throw new Error('useRole must be used within RoleProvider');
    return ctx;
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
    const { user, authenticated } = usePrivy();
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        let cancelled = false;

        async function fetchRole() {
            if (!authenticated || !user) {
                setRole(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(undefined);

            try {
                // Recommended: ask your backend for the user’s role.
                // Backend should verify Privy token server-side and return role.
                // Example call; implement the endpoint to return { role: 'patient' | 'doctor' }.
                const res = await fetch('/api/me/role', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch role');
                const data = await res.json();
                if (!cancelled) {
                    setRole(data.role ?? null);
                    setLoading(false);
                }
            } catch (e: any) {
                // Optional fallback: localStorage (non-authoritative, dev only)
                const local = (typeof window !== 'undefined' && localStorage.getItem('app.role')) as Role | null;
                if (!cancelled) {
                    if (local) {
                        setRole(local);
                        setLoading(false);
                    } else {
                        setError(e?.message || 'Unable to load role');
                        setLoading(false);
                    }
                }
            }
        }

        fetchRole();
        return () => {
            cancelled = true;
        };
    }, [authenticated, user]);

    return (
        <RoleContext.Provider value={{ role, setRole, loading, error }}>
            {children}
        </RoleContext.Provider>
    );
}