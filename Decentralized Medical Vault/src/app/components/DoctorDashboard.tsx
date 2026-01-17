// src/app/components/dashboards/DoctorDashboard.tsx
import React, { useMemo, useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Search, UserCircle2, FileText, CheckCircle2, Eye } from 'lucide-react';

type Patient = {
    id: string;
    name: string;
    lastSeen: string;
    records: { id: string; name: string; date: string; verified: boolean; url?: string }[];
};

const MOCK_PATIENTS: Patient[] = [
    {
        id: 'p1',
        name: 'Ava Patel',
        lastSeen: '12 Jan 2026',
        records: [
            { id: 'r1', name: 'MRI Brain - Nov 2025.dcm', date: '05 Nov 2025', verified: true, url: '#' },
            { id: 'r2', name: 'CBC Panel.pdf', date: '21 Oct 2025', verified: true, url: '#' },
        ],
    },
    {
        id: 'p2',
        name: 'Liam Nguyen',
        lastSeen: '03 Jan 2026',
        records: [
            { id: 'r3', name: 'X-Ray Chest.png', date: '28 Dec 2025', verified: true, url: '#' },
        ],
    },
];

export function DoctorDashboard() {
    const [q, setQ] = useState('');
    const patients = useMemo(() => {
        if (!q) return MOCK_PATIENTS;
        return MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    }, [q]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                        <UserCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Doctor Console</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Patient Access & Clinical Tools
                        </p>
                    </div>
                </div>
            </div>

            {/* Search + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="p-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search patients by name..."
                                    className="w-full h-11 px-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                />
                                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            <Button className="h-11">Search</Button>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        {patients.map((p) => (
                            <Card key={p.id} className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold">{p.name}</h3>
                                        <p className="text-xs text-slate-500">Last seen: {p.lastSeen}</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {p.records.map((r) => (
                                        <div key={r.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{r.name}</p>
                                                    <p className="text-[11px] text-slate-500">{r.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {r.verified && (
                                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </span>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <a href={r.url} target="_blank" rel="noreferrer">
                                                        <Eye className="h-4 w-4 text-emerald-500" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                    <Card className="p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Approvals</p>
                        <div className="mt-3 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Pending access requests</span>
                                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">2</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">New records this week</span>
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">7</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Shortcuts</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Button variant="secondary" className="h-10">Request Access</Button>
                            <Button variant="secondary" className="h-10">Add Note</Button>
                            <Button variant="secondary" className="h-10">Share Report</Button>
                            <Button variant="secondary" className="h-10">Export</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}