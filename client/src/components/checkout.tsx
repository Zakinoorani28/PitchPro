import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CreditCard, Shield, Check } from "lucide-react";

// Load Stripe with public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface CheckoutFormProps {
  requestId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ requestId, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Generating your premium pitch deck...",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Premium Upgrade</h3>
          <p className="text-slate-600 text-sm mb-4">
            Remove watermarks and get a professional presentation
          </p>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-slate-900">Premium Pitch Deck</span>
              <span className="text-xl font-bold text-slate-900">$5.00</span>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-accent mr-2" />
                Watermark-free PDF
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-accent mr-2" />
                Commercial use license
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-accent mr-2" />
                High-quality export
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 mb-4">
            <Shield className="w-4 h-4" />
            <span>Secured by Stripe</span>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isLoading}
              className="flex-1 bg-primary text-white hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay $5.00
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface CheckoutProps {
  requestId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function Checkout({ requestId, onSuccess, onCancel }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          requestId,
          amount: 5, // $5
        });
        const data = await response.json();
        
        if (data.success) {
          setClientSecret(data.clientSecret);
        } else {
          toast({
            title: "Payment Setup Failed",
            description: data.message || "Unable to initialize payment",
            variant: "destructive",
          });
          onCancel();
        }
      } catch (error) {
        toast({
          title: "Payment Setup Failed",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
        onCancel();
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [requestId, onCancel, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600">Unable to load payment form. Please try again.</p>
        <Button onClick={onCancel} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#3b82f6',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <CheckoutForm 
        requestId={requestId} 
        onSuccess={onSuccess} 
        onCancel={onCancel} 
      />
    </Elements>
  );
}