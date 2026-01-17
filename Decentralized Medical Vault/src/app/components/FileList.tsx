import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    FileText,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    Trash2,
    Download,
    Shield,
    Eye,
} from 'lucide-react';
import type { MedicalFile } from './Dashboard';
// Ensure the import path matches your project structure
import { formatBytes } from '../../lib/utils';
interface FileListProps {
    files: MedicalFile[];
    onVerify: (id: string) => void;
    onDelete: (id: string) => void;
}

export function FileList({ files, onVerify, onDelete }: FileListProps) {
    const getFileIcon = (type: string) => {
        if (type.toLowerCase().includes('pdf')) {
            return <FileText className="h-5 w-5 text-primary" />;
        }
        if (type.toLowerCase().includes('image')) {
            return <ImageIcon className="h-5 w-5 text-primary" />;
        }
        return <FileText className="h-5 w-5 text-primary" />;
    };

    const formatDate = (date: Date | string) => {
        // Safety check: convert to Date object if it's a string from an API
        const dateObj = date instanceof Date ? date : new Date(date);
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(dateObj);
    };

    if (files.length === 0) {
        return (
            <Card className="border-border bg-white shadow-md">
                <CardContent className="py-12 text-center">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-foreground font-medium">No files uploaded yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Upload your first medical record to get started
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border bg-white shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                    <span>Medical Records</span>
                    <Badge variant="secondary" className="bg-blue-100 text-primary border-blue-200">
                        {files.length} files
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className="p-4 rounded-xl border border-border bg-gradient-to-br from-blue-50/50 to-cyan-50/30 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                {getFileIcon(file.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-foreground truncate">
                                            {file.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatBytes(file.size)}
                      </span>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <span className="text-xs text-muted-foreground">
                        {formatDate(file.uploadDate)}
                      </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {file.verified ? (
                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Unverified
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Blockchain Info Section */}
                                <div className="mt-2 p-3 rounded-lg bg-white border border-blue-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Shield className="h-3 w-3 text-primary" />
                                        <span className="text-xs font-semibold text-foreground">
                      Blockchain Hash:
                    </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono truncate">
                                        {file.hash}
                                    </p>
                                </div>

                                {/* Actions Bar */}
                                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-blue-100">
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-blue-100">
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                    </Button>
                                    {!file.verified && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onVerify(file.id)}
                                            className="h-8 text-emerald-600 hover:bg-emerald-100"
                                        >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Verify
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onDelete(file.id)}
                                        className="h-8 text-destructive hover:bg-red-100"
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}