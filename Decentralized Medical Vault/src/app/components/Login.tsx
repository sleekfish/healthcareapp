import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Shield, Lock, Mail } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/app/components/ui/input-otp';
import { useLoginWithEmail } from '@privy-io/react-auth';

export function Login() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const { sendCode, loginWithCode, state } = useLoginWithEmail({
        onComplete: (user) => console.log('Logged in:', user),
        onError: (error) => alert('Error: ' + error.message),
    });

    const isLoading = state.status === 'sending-code' || state.status === 'submitting-code';

    const handleSendOTP = async () => {
        try {
            await sendCode({ email });
            setOtpSent(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await loginWithCode({ code: otp });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
            <Card className="w-full max-w-md shadow-xl bg-white/80 backdrop-blur-md border-white/20">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-blue-500 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Medical Vault</CardTitle>
                    <CardDescription>Your health records, secured by blockchain</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!otpSent ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSendOTP} disabled={isLoading} className="w-full">
                                {isLoading ? 'Sending...' : 'Continue with Email'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Label>Enter Verification Code</Label>
                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                <InputOTPGroup className="mx-auto">
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <Button onClick={handleVerifyOTP} disabled={isLoading} className="w-full">
                                {isLoading ? 'Verifying...' : 'Login'}
                            </Button>
                        </div>
                    )}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4 border-t">
                        <Lock className="h-3 w-3" />
                        <span>Protected by Triple-Lock Encryption</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}