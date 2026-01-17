// src/app/App.tsx
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { MedicalBackground } from './components/MedicalBackground';
import { Login } from './components/Login';
import { DoctorDashboard } from './components/DoctorDashboard';
import { RoleProvider, useRole } from './role/RoleGate';
import { RolePicker } from './components/RolePicker';

function RoutedDashboards() {
    const { role, loading } = useRole();

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!role) return <RolePicker />;

    return role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />;
}

// Use a sub-component so we can use the usePrivy hook inside the provider
function AppContent() {
    const { authenticated, ready } = usePrivy();

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            <MedicalBackground />
            {!authenticated ? <Login /> : (
                <RoleProvider>
                    <RoutedDashboards />
                </RoleProvider>
            )}
        </div>
    );
}

export default function App() {
    return (
        <PrivyProvider
            appId="cmkgqfsnh000ljo0dh0z4tcab"
            config={{
                loginMethods: ['email'],
                appearance: { theme: 'light', accentColor: '#3B82F6' },
                embeddedWallets: { createOnLogin: 'users-without-wallets' },
            }}
        >
            <AppContent />
        </PrivyProvider>
    );
}