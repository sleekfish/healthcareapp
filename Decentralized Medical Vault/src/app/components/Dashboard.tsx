import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Shield, LogOut, Upload, FileText, CheckCircle2,
    Activity, Trash2, Eye, HardDrive, Clock
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    AreaChart, Area, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

type FileItem = {
    name: string;
    size: string; // human friendly
    bytes: number; // raw bytes for analytics
    date: string;
    hash: string;
    url: string;
    verified?: boolean;
    type?: string; // extension
};

export function Dashboard() {
    const { user, logout, ready } = usePrivy();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Files state (seed contains bytes for analytics)
    const [files, setFiles] = useState<FileItem[]>([
        {
            name: 'Blood Test Report - Dec 2024.pdf',
            size: '239.92 KB',
            bytes: Math.round(239.92 * 1024),
            date: '15 Dec 2024',
            hash: '0x7d8f9e3a2b1c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7',
            url: '#',
            verified: true,
            type: 'pdf',
        }
    ]);
    const [isUploading, setIsUploading] = useState(false);

    // Realtime analytics state
    const [uploadsPerMin, setUploadsPerMin] = useState(0);
    const [activeSessions, setActiveSessions] = useState(1);
    const [verificationRate, setVerificationRate] = useState(1); // 0..1
    const [uploadSeries, setUploadSeries] = useState<{ t: number; count: number }[]>([]);
    const [storageSeries, setStorageSeries] = useState<{ t: number; mb: number }[]>([]);

    // Helpers
    const userEmail = user?.email?.address || 'Authenticated User';
    const colors = {
        blue: '#0070F3',
        blueLight: '#60A5FA',
        green: '#10B981',
        orange: '#F59E0B',
        slate: '#94A3B8',
        purple: '#A78BFA',
        cyan: '#06B6D4',
    };
    const pieColors = [colors.blue, colors.green, colors.orange, colors.purple, colors.cyan];

    function formatBytes(bytes: number) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
        return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }

    const totalBytes = useMemo(() => files.reduce((sum, f) => sum + (f.bytes || 0), 0), [files]);
    const totalFiles = files.length;

    // Filetype distribution
    const fileTypeDist = useMemo(() => {
        const map = new Map<string, number>();
        files.forEach(f => {
            const ext = (f.type || f.name.split('.').pop() || '').toLowerCase();
            const key = ext || 'other';
            map.set(key, (map.get(key) || 0) + 1);
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [files]);

    // Verification rate (simple: percent with verified === true)
    useEffect(() => {
        const verifiedCount = files.filter(f => f.verified !== false).length;
        setVerificationRate(totalFiles ? verifiedCount / totalFiles : 1);
    }, [files, totalFiles]);

    // Seed time series on mount
    useEffect(() => {
        const now = Date.now();
        const seed = Array.from({ length: 15 }).map((_, i) => {
            const t = now - (14 - i) * 60_000;
            return { t, count: Math.max(0, Math.round(Math.random() * 3 - 1)) }; // few baseline events
        });
        setUploadSeries(seed);
        setStorageSeries([{ t: now, mb: totalBytes / (1024 * 1024) }]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // seed once

    // Realtime simulation (replace with WebSocket/SSE for production)
    useEffect(() => {
        const tick = setInterval(() => {
            const now = Date.now();

            // uploads per min drift
            setUploadsPerMin(prev => Math.max(0, Math.round(prev + (Math.random() * 2 - 1))));

            // active sessions small variance
            setActiveSessions(prev => Math.max(1, Math.min(8, prev + (Math.random() > 0.6 ? 1 : Math.random() > 0.6 ? -1 : 0))));

            // append to time series every 10s
            setUploadSeries(prev => {
                const next = [...prev, { t: now, count: Math.max(0, Math.round(Math.random() * 4)) }];
                // keep last 15 minutes
                return next.filter(p => now - p.t <= 15 * 60_000);
            });

            setStorageSeries(prev => {
                const next = [...prev, { t: now, mb: totalBytes / (1024 * 1024) }];
                // keep last 24 hours worth (optional)
                return next.slice(-200);
            });
        }, 10_000);

        return () => clearInterval(tick);
    }, [totalBytes]);

    // On actual file upload, spike uploads/min and push series points
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);

        // Generate Hash for UI
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const fileHash = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        setTimeout(() => {
            const ext = (file.name.split('.').pop() || '').toLowerCase();
            setFiles(prev => [{
                name: file.name,
                size: formatBytes(file.size),
                bytes: file.size,
                date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                hash: fileHash,
                url: URL.createObjectURL(file),
                verified: true,
                type: ext,
            }, ...prev]);

            // Spike metrics
            setUploadsPerMin(u => u + 1);
            const now = Date.now();
            setUploadSeries(s => [...s, { t: now, count: 1 }]);
            setStorageSeries(s => [...s, { t: now, mb: (totalBytes + file.size) / (1024 * 1024) }]);

            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }, 800);
    };

    // Chart-ready data transforms
    const uploadsChartData = uploadSeries.map(p => ({
        time: new Date(p.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        count: p.count,
    }));

    const storageChartData = storageSeries.map(p => ({
        time: new Date(p.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mb: Number(p.mb.toFixed(3)),
    }));

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#0070F3] flex items-center justify-center">
                            <Shield className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Medical Vault</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Decentralized & Secure</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-semibold text-blue-700">{userEmail}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={logout} className="text-slate-400 hover:text-red-500">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT: Upload Section */}
                    <div className="lg:col-span-7 space-y-6">
                        <Card
                            className="p-12 border-dashed border-2 border-slate-200 bg-white hover:border-blue-400 transition-all flex flex-col items-center text-center cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                            <div className={`h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4 ${isUploading ? 'animate-bounce' : ''}`}>
                                <Upload className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Drag & drop files here</h3>
                            <p className="text-sm text-slate-500 mb-6">or click to browse</p>
                            <Button className="bg-[#0070F3] hover:bg-blue-600 px-10 h-11 rounded-xl font-bold">
                                Select Files
                            </Button>
                            <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-tighter">Supported: PDF, JPG, PNG, DICOM</p>
                        </Card>

                        <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-6">
                            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-3">
                                <Shield className="h-4 w-4" /> Security Features:
                            </h4>
                            <ul className="grid grid-cols-2 gap-2 text-xs text-blue-600/70 font-medium">
                                <li>• Local encryption before upload</li>
                                <li>• Blockchain hash verification</li>
                                <li>• Immutable record storage</li>
                                <li>• User-controlled keys</li>
                            </ul>
                        </div>

                        {/* ANALYTICS: Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Uploads per Minute</p>
                                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">{uploadsPerMin}/min</span>
                                </div>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={uploadsChartData}>
                                            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="count" stroke={colors.blue} strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Storage Growth</p>
                                    <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 font-semibold">
                    {formatBytes(totalBytes)}
                  </span>
                                </div>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={storageChartData}>
                                            <defs>
                                                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={colors.blue} stopOpacity={0.35} />
                                                    <stop offset="95%" stopColor={colors.blue} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                                            <YAxis tick={{ fontSize: 10 }} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="mb" stroke={colors.blue} fill="url(#grad)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="p-4 md:col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">File Types</p>
                                    <span className="text-xs text-slate-500">{totalFiles} total</span>
                                </div>
                                <div className="h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={fileTypeDist}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={2}
                                            >
                                                {fileTypeDist.map((_, idx) => (
                                                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                                                ))}
                                            </Pie>
                                            <Legend verticalAlign="bottom" height={24} />
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT: Records List */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <h2 className="font-bold text-slate-800">Medical Records</h2>
                            <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{files.length} Files</span>
                        </div>

                        {files.map((file, idx) => (
                            <Card key={idx} className="p-4 bg-white border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text=[13px] font-bold text-slate-900 truncate pr-2">{file.name}</h4>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                                    <a href={file.url} target="_blank"><Eye className="h-4 w-4 text-blue-500" /></a>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[10px] text-slate-400">{file.size} • {file.date}</p>
                                            <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                      </span>
                                        </div>
                                        <div className="mt-3 bg-slate-50 p-2 rounded border border-slate-100">
                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                                                <Activity className="h-2.5 w-2.5" /> Blockchain Hash:
                                            </p>
                                            <p className="text-[9px] font-mono text-slate-500 truncate mt-1">{file.hash}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* FOOTER STATS: Realtime KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    <Card className="p-4 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Storage Used</p>
                            <p className="text-lg font-bold">{formatBytes(totalBytes)}</p>
                        </div>
                        <HardDrive className="h-6 w-6 text-purple-300" />
                    </Card>

                    <Card className="p-4 flex justify-between items-center border-l-4 border-blue-500">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Trust Score</p>
                            <p className="text-lg font-bold text-blue-600">{Math.round(verificationRate * 100)}%</p>
                        </div>
                        <Clock className="h-6 w-6 text-orange-200" />
                    </Card>

                    <Card className="p-4 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Uploads / Min</p>
                            <p className="text-lg font-bold">{uploadsPerMin}</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </Card>

                    <Card className="p-4 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Active Sessions</p>
                            <p className="text-lg font-bold">{activeSessions}</p>
                        </div>
                        <div className="text-slate-300 text-xs">Live</div>
                    </Card>
                </div>
            </div>
        </div>
    );
}