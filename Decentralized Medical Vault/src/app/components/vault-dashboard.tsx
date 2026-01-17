import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Progress } from '@/app/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { motion } from 'motion/react';
import {
  Upload,
  FileText,
  Search,
  Shield,
  Lock,
  Key,
  Activity,
  Calendar,
  Download,
  Eye,
  LogOut,
  Trash2,
  BarChart3,
  FileCheck,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface VaultDashboardProps {
  phone: string;
  onLogout: () => void;
}

interface MedicalRecord {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  verified: boolean;
  hash: string;
}

const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    name: 'Blood Test Results - Jan 2025',
    type: 'Lab Report',
    date: '2025-01-10',
    size: '2.4 MB',
    verified: true,
    hash: '0x8f7d9e2b...'
  },
  {
    id: '2',
    name: 'X-Ray Chest - Dec 2024',
    type: 'Imaging',
    date: '2024-12-15',
    size: '5.1 MB',
    verified: true,
    hash: '0x3a6c1f4e...'
  },
  {
    id: '3',
    name: 'Prescription - Dr. Sharma',
    type: 'Prescription',
    date: '2024-12-20',
    size: '856 KB',
    verified: true,
    hash: '0x7b2e8d9a...'
  },
  {
    id: '4',
    name: 'Vaccination Record',
    type: 'Immunization',
    date: '2024-11-05',
    size: '1.2 MB',
    verified: true,
    hash: '0x4f9c2a1b...'
  }
];

const activityData = [
  { month: 'Aug', uploads: 2, views: 5 },
  { month: 'Sep', uploads: 3, views: 8 },
  { month: 'Oct', uploads: 4, views: 12 },
  { month: 'Nov', uploads: 3, views: 7 },
  { month: 'Dec', uploads: 5, views: 15 },
  { month: 'Jan', uploads: 4, views: 10 },
];

const storageData = [
  { name: 'Lab Reports', value: 30 },
  { name: 'Imaging', value: 45 },
  { name: 'Prescriptions', value: 15 },
  { name: 'Others', value: 10 },
];

export function VaultDashboard({ phone, onLogout }: VaultDashboardProps) {
  const [records] = useState<MedicalRecord[]>(mockRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('records');

  const filteredRecords = records.filter(record =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-primary">Medical Vault</h1>
            <p className="text-muted-foreground mt-1">+91 {phone}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Record
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/30">
                <DialogHeader>
                  <DialogTitle className="text-primary">Upload Medical Record</DialogTitle>
                  <DialogDescription>
                    Your file will be encrypted and stored securely on blockchain
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary/70 transition-colors">
                    <Upload className="h-12 w-12 mx-auto text-primary/70 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">File Name</label>
                    <Input placeholder="Enter file name" className="bg-input border-border" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input placeholder="e.g., Lab Report, X-Ray" className="bg-input border-border" />
                  </div>
                  
                  <Button className="w-full bg-primary text-primary-foreground">
                    <Lock className="mr-2 h-4 w-4" />
                    Encrypt & Upload
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={onLogout} className="border-primary/30">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-3xl font-bold text-primary mt-1">{records.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary/70" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {records.filter(r => r.verified).length}
                  </p>
                </div>
                <FileCheck className="h-8 w-8 text-primary/70" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                  <p className="text-3xl font-bold text-primary mt-1">98%</p>
                </div>
                <Shield className="h-8 w-8 text-primary/70" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-3xl font-bold text-primary mt-1">9.5 MB</p>
                </div>
                <Activity className="h-8 w-8 text-primary/70" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="bg-secondary/50 border border-primary/20">
              <TabsTrigger value="records">
                <FileText className="mr-2 h-4 w-4" />
                My Records
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Records Tab */}
            <TabsContent value="records" className="space-y-6">
              <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle>Medical Records</CardTitle>
                      <CardDescription>
                        All your medical documents encrypted and stored on blockchain
                      </CardDescription>
                    </div>
                    
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-input border-border"
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {filteredRecords.map((record, index) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 border border-primary/20 rounded-lg hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{record.name}</h4>
                                {record.verified && (
                                  <Badge className="bg-primary/20 text-primary border-primary/30">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(record.date).toLocaleDateString()}
                                </span>
                                <span>{record.type}</span>
                                <span>{record.size}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-mono">
                                <Key className="h-3 w-3" />
                                <span>Hash: {record.hash}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" className="hover:bg-primary/20">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="hover:bg-primary/20">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="hover:bg-destructive/20">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
                  <CardHeader>
                    <CardTitle>Activity Trend</CardTitle>
                    <CardDescription>Upload and view activity over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#00ff8820" />
                        <XAxis dataKey="month" stroke="#00ff88" />
                        <YAxis stroke="#00ff88" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0a0a0a',
                            border: '1px solid #00ff8840',
                            borderRadius: '8px'
                          }}
                        />
                        <Line type="monotone" dataKey="uploads" stroke="#00ff88" strokeWidth={2} />
                        <Line type="monotone" dataKey="views" stroke="#00ccff" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
                  <CardHeader>
                    <CardTitle>Storage Distribution</CardTitle>
                    <CardDescription>Records by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={storageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#00ff8820" />
                        <XAxis dataKey="name" stroke="#00ff88" />
                        <YAxis stroke="#00ff88" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0a0a0a',
                            border: '1px solid #00ff8840',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="value" fill="#00ff88" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <CardTitle>Security Features</CardTitle>
                  <CardDescription>
                    Your vault is protected with multiple layers of security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Argon2id Encryption</p>
                          <p className="text-sm text-muted-foreground">Brute-force resistant key derivation</p>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">ChaCha20-Poly1305</p>
                          <p className="text-sm text-muted-foreground">Authenticated encryption</p>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Blockchain Notarization</p>
                          <p className="text-sm text-muted-foreground">Polygon network verification</p>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary">Active</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Overall Security Score</p>
                      <p className="text-2xl font-bold text-primary">98%</p>
                    </div>
                    <Progress value={98} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
