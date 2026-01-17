import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { motion } from 'motion/react';
import { Loader2, ShieldCheck } from 'lucide-react';

interface AuthenticationProps {
  onAuthenticated: (phone: string) => void;
}

export function Authentication({ onAuthenticated }: AuthenticationProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) return;
    
    setLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      onAuthenticated(phone);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-primary/30">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Medical Vault</CardTitle>
            <CardDescription className="text-base">
              {step === 'phone' 
                ? 'Secure your health records with cryptographic protection'
                : 'Enter the OTP sent to your phone'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 'phone' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10 digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="bg-input border-border focus:border-primary"
                  />
                </div>
                
                <Button
                  onClick={handleSendOTP}
                  disabled={phone.length !== 10 || loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Enter OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value: string) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="border-primary/50" />
                        <InputOTPSlot index={1} className="border-primary/50" />
                        <InputOTPSlot index={2} className="border-primary/50" />
                        <InputOTPSlot index={3} className="border-primary/50" />
                        <InputOTPSlot index={4} className="border-primary/50" />
                        <InputOTPSlot index={5} className="border-primary/50" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setStep('phone')}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Change Phone Number
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
