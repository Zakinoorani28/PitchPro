import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, CreditCard, Shield, DollarSign, Zap, Globe, Users } from "lucide-react";

export default function Pricing() {
  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        { text: "2 pitch decks per month", included: true },
        { text: "Basic templates", included: true },
        { text: "Standard export (HTML)", included: true },
        { text: "Community support", included: true },
        { text: "Basic analytics", included: true },
        { text: "Premium templates", included: false },
        { text: "3D video generation", included: false },
        { text: "Brand customization", included: false }
      ],
      overagePrice: "Upgrade for more",
      popular: false,
      cta: "Start Free",
      badge: null
    },
    {
      name: "Hustler+",
      price: "$19",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        { text: "20 pitch decks per month", included: true },
        { text: "Premium templates", included: true },
        { text: "All export formats (PDF, PPT)", included: true },
        { text: "Email support", included: true },
        { text: "Advanced analytics", included: true },
        { text: "2 3D videos included", included: true },
        { text: "Brand customization", included: true },
        { text: "API access", included: false }
      ],
      overagePrice: "$2 per extra deck",
      popular: true,
      cta: "Start Hustler+",
      badge: "Most Popular"
    },
    {
      name: "Founder",
      price: "$99",
      period: "/month",
      description: "For established businesses",
      features: [
        { text: "Unlimited pitch decks", included: true },
        { text: "All premium features", included: true },
        { text: "All export formats", included: true },
        { text: "Priority support", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Unlimited 3D videos", included: true },
        { text: "Full brand customization", included: true },
        { text: "API access", included: true }
      ],
      overagePrice: "No limits",
      popular: false,
      cta: "Start Founder",
      badge: "Enterprise"
    }
  ];

  const premiumAddons = [
    { name: "Priority Patent Check", price: "$4.99", description: "24hr WIPO search results" },
    { name: "Lawyer Matching", price: "15% fee", description: "Connect with IP lawyers" }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-savanna">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-lora text-slate-900 mb-4">Choose Your African Innovation Plan</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            From startup hustle to founder scale - find the perfect plan for your African business journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''} bg-white border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className={`px-3 py-1 text-xs font-medium ${plan.popular ? 'bg-primary text-white' : 'bg-accent text-white'}`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {plan.price}
                    <span className="text-lg font-normal text-slate-500">{plan.period}</span>
                  </div>
                  <p className="text-slate-600 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <Check className="w-4 h-4 mr-3 text-accent mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 mr-3 text-slate-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="bg-slate-50 rounded-lg p-3 mb-6">
                  <div className="text-xs font-medium text-slate-700 mb-1">Overages:</div>
                  <div className="text-xs text-slate-600">{plan.overagePrice}</div>
                </div>

                <Button
                  onClick={scrollToGenerator}
                  className={`w-full font-medium transition-all ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-orange-700'
                      : 'border border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Add-ons Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-orange-200 mb-8">
          <h3 className="text-xl font-bold font-lora text-slate-900 mb-6 text-center">Premium Add-ons</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {premiumAddons.map((addon, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{addon.name}</div>
                  <div className="text-sm text-slate-600">{addon.description}</div>
                </div>
                <div className="text-primary font-bold">{addon.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Psychology Hack */}
        <div className="bg-accent/10 rounded-xl p-6 mb-8 text-center">
          <div className="text-lg font-medium text-slate-900 mb-2">3 Decks = 3 Investor Meetings</div>
          <div className="text-slate-600">Perfect for accelerator applications and building investor momentum</div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-medium text-slate-900 mb-2">Lightning Fast</div>
              <div className="text-sm text-slate-600">Generate investor-ready decks in minutes, not weeks</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="font-medium text-slate-900 mb-2">African Expertise</div>
              <div className="text-sm text-slate-600">Deep knowledge of African markets and opportunities</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="font-medium text-slate-900 mb-2">Community Support</div>
              <div className="text-sm text-slate-600">Join thousands of African entrepreneurs</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
