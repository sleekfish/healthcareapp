// src/app/components/RolePicker.tsx
import React from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useRole } from '@/app/role/RoleGate';

export function RolePicker() {
    const { setRole } = useRole();

    const choose = async (r: 'patient' | 'doctor') => {
        // Persist to your backend; then set local state.
        await fetch('/api/me/role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ role: r }),
        }).catch(() => {});
        // Dev fallback for quick testing:
        if (typeof window !== 'undefined') localStorage.setItem('app.role', r);
        setRole(r);
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Card className="p-8 max-w-md w-full text-center space-y-6">
                <h2 className="text-xl font-bold">Choose your role</h2>
                <p className="text-slate-500 text-sm">Select how you want to use Medical Vault.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button className="h-12 font-semibold" onClick={() => choose('patient')}>
                        I am a Patient
                    </Button>
                    <Button className="h-12 font-semibold" variant="secondary" onClick={() => choose('doctor')}>
                        I am a Doctor
                    </Button>
                </div>
                <p className="text-[11px] text-slate-400">
                    You can request a role change by contacting support.
                </p>
            </Card>
        </div>
    );
}