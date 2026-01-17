import React, { useMemo } from 'react';
// Changed to relative path to resolve TS2307
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler // Added to support 'fill: true' in Line charts
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Shield, FileCheck, Clock, TrendingUp } from 'lucide-react';
import type { MedicalFile } from './Dashboard';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler
);

interface AnalyticsProps {
    files: MedicalFile[];
}

export function Analytics({ files = [] }: AnalyticsProps) {
    // Memoizing stats to prevent expensive recalculations on every render
    const stats = useMemo(() => {
        const verifiedCount = files.filter((f) => f.verified).length;
        const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
        const trustScore = files.length > 0 ? Math.round((verifiedCount / files.length) * 100) : 0;

        // File Type Distribution
        const fileTypes = files.reduce((acc, file) => {
            const type = file.type?.includes('pdf') ? 'PDF' : file.type?.includes('image') ? 'Image' : 'Other';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Upload Timeline - Fixed redundant 'instanceof' warning
        const uploadsByMonth = files.reduce((acc, file) => {
            // Direct call because TS knows file.uploadDate is a Date
            const month = file.uploadDate.toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return { verifiedCount, totalSize, trustScore, fileTypes, uploadsByMonth };
    }, [files]);

    const typeData = {
        labels: Object.keys(stats.fileTypes),
        datasets: [{
            data: Object.values(stats.fileTypes),
            backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };

    const timelineData = {
        labels: Object.keys(stats.uploadsByMonth),
        datasets: [{
            label: 'Files Uploaded',
            data: Object.values(stats.uploadsByMonth),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
        }],
    };

    const verificationData = {
        labels: ['Verified', 'Unverified'],
        datasets: [{
            data: [stats.verifiedCount, files.length - stats.verifiedCount],
            backgroundColor: ['#10b981', '#cbd5e1'],
            borderWidth: 0,
        }],
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { padding: 20, usePointStyle: true }
            },
        },
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                <StatCard title="Total Files" value={files.length} icon={<FileCheck className="h-6 w-6 text-blue-600" />} color="bg-blue-100" />
                <StatCard title="Verified" value={stats.verifiedCount} icon={<Shield className="h-6 w-6 text-emerald-600" />} color="bg-emerald-100" />
                <StatCard title="Storage Used" value={formatBytes(stats.totalSize)} icon={<TrendingUp className="h-6 w-6 text-purple-600" />} color="bg-purple-100" />
                <StatCard title="Trust Score" value={`${stats.trustScore}%`} icon={<Clock className="h-6 w-6 text-amber-600" />} color="bg-amber-100" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>File Type Distribution</CardTitle>
                        <CardDescription>Breakdown by document type</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <Doughnut data={typeData} options={commonOptions} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Verification Status</CardTitle>
                        <CardDescription>Blockchain verification progress</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <Doughnut data={verificationData} options={commonOptions} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Timeline</CardTitle>
                    <CardDescription>Monthly upload activity</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                    <Line data={timelineData} options={{...commonOptions, scales: { y: { beginAtZero: true }}}} />
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
    return (
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center`}>
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}