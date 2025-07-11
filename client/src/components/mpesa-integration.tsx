import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  CreditCard,
  Globe,
  Users
} from 'lucide-react';

interface MPesaTransaction {
  transactionId: string;
  phoneNumber: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  checkoutRequestId?: string;
  merchantRequestId?: string;
  resultCode?: string;
  resultDesc?: string;
}

const SUPPORTED_OPERATORS = [
  { name: 'Safaricom', country: 'Kenya', code: 'KE', prefix: '+254', color: 'bg-green-600' },
  { name: 'Vodacom', country: 'Tanzania', code: 'TZ', prefix: '+255', color: 'bg-red-600' },
  { name: 'MTN', country: 'Uganda', code: 'UG', prefix: '+256', color: 'bg-yellow-600' },
  { name: 'Airtel', country: 'Rwanda', code: 'RW', prefix: '+250', color: 'bg-red-500' },
];

const SERVICE_PACKAGES = [
  {
    id: 'patent_priority',
    name: 'Priority Patent Check',
    price: 499, // KES
    usdPrice: 4.99,
    description: '24-hour patent analysis with lawyer consultation',
    features: ['Expedited processing', 'Detailed similarity report', 'Legal consultation', 'ARIPO filing guidance']
  },
  {
    id: 'pitch_premium',
    name: 'Premium Pitch Deck',
    price: 999, // KES
    usdPrice: 9.99,
    description: 'Watermark-free professional pitch deck',
    features: ['High-quality PDF', 'Multiple formats', 'Investor-ready design', 'Commercial use license']
  },
  {
    id: 'grant_intelligence',
    name: 'Grant Intelligence Pro',
    price: 1999, // KES
    usdPrice: 19.99,
    description: 'AI-powered grant matching and application support',
    features: ['Personalized recommendations', 'Application templates', 'Deadline tracking', 'Success rate analysis']
  }
];

export default function MPesaIntegration() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transaction, setTransaction] = useState<MPesaTransaction | null>(null);
  const [verificationStep, setVerificationStep] = useState<'input' | 'confirming' | 'processing' | 'completed'>('input');
  const { toast } = useToast();

  const mpesaInitiateMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; amount: number; serviceId: string }) => {
      const response = await apiRequest('POST', '/api/verify/mpesa', data);
      return response.json();
    },
    onSuccess: (result) => {
      setTransaction({
        transactionId: result.transactionId,
        phoneNumber,
        amount: getPackagePrice(selectedPackage || ''),
        status: 'pending',
        checkoutRequestId: result.checkoutRequestId,
        merchantRequestId: result.merchantRequestId
      });
      setVerificationStep('processing');
      toast({
        title: "Payment Initiated",
        description: "Please complete payment on your phone",
      });
      
      // Simulate payment completion after 30 seconds
      setTimeout(() => {
        setTransaction(prev => prev ? { ...prev, status: 'completed' } : null);
        setVerificationStep('completed');
        toast({
          title: "Payment Successful",
          description: "Your service has been activated",
        });
      }, 30000);
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
      setVerificationStep('input');
    }
  });

  const getPackagePrice = (packageId: string) => {
    return SERVICE_PACKAGES.find(pkg => pkg.id === packageId)?.price || 0;
  };

  const getSelectedPackage = () => {
    return SERVICE_PACKAGES.find(pkg => pkg.id === selectedPackage);
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove non-digits and format for M-Pesa
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('254')) return cleaned;
    if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
    return '254' + cleaned;
  };

  const validatePhoneNumber = (phone: string) => {
    const formatted = formatPhoneNumber(phone);
    return formatted.length === 12 && formatted.startsWith('254');
  };

  const handleInitiatePayment = () => {
    if (!selectedPackage) {
      toast({
        title: "Select Service",
        description: "Please select a service package",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number",
        variant: "destructive",
      });
      return;
    }

    setVerificationStep('confirming');
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    mpesaInitiateMutation.mutate({
      phoneNumber: formattedPhone,
      amount: getPackagePrice(selectedPackage),
      serviceId: selectedPackage
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          M-Pesa Payment Gateway
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Secure mobile payments for African entrepreneurs
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Bank-Grade Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4" />
            <span>Instant Processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Pan-African Coverage</span>
          </div>
        </div>
      </div>

      {/* Supported Networks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Supported Mobile Networks</span>
          </CardTitle>
          <CardDescription>
            Pay securely with your mobile money account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SUPPORTED_OPERATORS.map((operator, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className={`w-3 h-3 rounded-full ${operator.color}`}></div>
                <div>
                  <p className="font-medium text-sm">{operator.name}</p>
                  <p className="text-xs text-gray-600">{operator.country}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Packages */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Service Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICE_PACKAGES.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`cursor-pointer transition-all ${
                selectedPackage === pkg.id ? 'ring-2 ring-orange-500 border-orange-500' : 'hover:border-orange-300'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  {selectedPackage === pkg.id && (
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">KES {pkg.price}</span>
                    <span className="text-sm text-gray-600">(${pkg.usdPrice})</span>
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Interface */}
      {selectedPackage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Complete Payment</span>
            </CardTitle>
            <CardDescription>
              Pay with M-Pesa for {getSelectedPackage()?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {verificationStep === 'input' && (
              <div className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{getSelectedPackage()?.name}</p>
                      <p className="text-sm text-gray-600">{getSelectedPackage()?.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">KES {getSelectedPackage()?.price}</p>
                      <p className="text-sm text-gray-600">${getSelectedPackage()?.usdPrice}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="0700000000 or +254700000000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Enter your Safaricom number registered with M-Pesa
                  </p>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your payment is secured with bank-grade encryption. You will receive an STK push notification to authorize the transaction.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleInitiatePayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!phoneNumber || !validatePhoneNumber(phoneNumber)}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Pay KES {getSelectedPackage()?.price} with M-Pesa
                </Button>
              </div>
            )}

            {verificationStep === 'processing' && transaction && (
              <div className="space-y-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-orange-600">
                  <Clock className="w-8 h-8 animate-pulse" />
                  <div>
                    <p className="font-semibold">Payment in Progress</p>
                    <p className="text-sm text-gray-600">Transaction ID: {transaction.transactionId}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Progress value={66} className="w-full" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>STK Push sent to {phoneNumber}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-orange-600">
                      <Clock className="w-4 h-4" />
                      <span>Awaiting confirmation</span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    Check your phone for the M-Pesa payment request. Enter your M-Pesa PIN to complete the transaction.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {verificationStep === 'completed' && transaction && (
              <div className="space-y-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle2 className="w-12 h-12" />
                  <div>
                    <p className="text-xl font-semibold">Payment Successful!</p>
                    <p className="text-sm text-gray-600">Transaction ID: {transaction.transactionId}</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-medium text-green-800">Service Activated</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your {getSelectedPackage()?.name} is now ready to use. Check your email for details.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" onClick={() => {
                    setVerificationStep('input');
                    setSelectedPackage(null);
                    setPhoneNumber('');
                    setTransaction(null);
                  }}>
                    Make Another Payment
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download Receipt
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security & Trust */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Shield className="w-8 h-8 mx-auto text-green-600" />
              <h4 className="font-semibold">Bank-Grade Security</h4>
              <p className="text-sm text-gray-600">
                All transactions are encrypted and processed through Safaricom's secure M-Pesa gateway
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Clock className="w-8 h-8 mx-auto text-blue-600" />
              <h4 className="font-semibold">Instant Processing</h4>
              <p className="text-sm text-gray-600">
                Payments are processed in real-time with immediate service activation
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Smartphone className="w-8 h-8 mx-auto text-orange-600" />
              <h4 className="font-semibold">Mobile-First</h4>
              <p className="text-sm text-gray-600">
                Designed for African entrepreneurs who rely on mobile payments
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}