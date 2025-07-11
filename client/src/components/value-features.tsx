import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Users, MessageSquare, Globe, Zap } from "lucide-react";

export default function ValueFeatures() {
  const valueFeatures = [
    {
      icon: Search,
      title: "AI Patent Intelligence",
      description: "WIPO patent searches with novelty scoring",
      tiers: ["Basic: 1/month", "Pro: 5/month", "Founder: Unlimited"],
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: FileText,
      title: "Grant Intelligence Engine",
      description: "African Development Bank, Green Climate Fund access",
      tiers: ["SA only", "5 African grants", "Global + AI rewrite"],
      color: "text-accent bg-accent/10"
    },
    {
      icon: Users,
      title: "Investor Hotlist Matching",
      description: "Connect with VCs focused on African markets",
      tiers: ["Community", "Priority matching", "Direct introductions"],
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Grant Alerts",
      description: "Real-time notifications for new funding opportunities",
      tiers: ["Email only", "Weekly digest", "Instant WhatsApp"],
      color: "text-green-600 bg-green-100"
    },
    {
      icon: Globe,
      title: "ARIPO Filing Support",
      description: "African Regional Intellectual Property assistance",
      tiers: ["Basic info", "Guidance", "Full filing support"],
      color: "text-orange-600 bg-orange-100"
    },
    {
      icon: Zap,
      title: "3D Pitch Demos",
      description: "Interactive Spline-powered prototypes",
      tiers: ["Static only", "Basic 3D", "Custom demos"],
      color: "text-primary bg-primary/10"
    }
  ];

  const successMetrics = [
    { metric: "60%", description: "Faster funding access" },
    { metric: "4X", description: "Higher patent success rates" },
    { metric: "$2B+", description: "Unlocked startup funding" },
    { metric: "5X", description: "Improved investor meetings" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-lora text-slate-900 mb-4">
            Beyond Pitch Decks: Complete Innovation Ecosystem
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            From patent protection to grant discovery, we provide the complete toolkit 
            for African entrepreneurs to build, protect, and fund their innovations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {valueFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border border-slate-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-lg mb-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.tiers.map((tier, tierIndex) => (
                      <div key={tierIndex} className="text-xs text-slate-500">
                        {tierIndex === 0 && "Hustler: "}{tierIndex === 1 && "Hustler+: "}{tierIndex === 2 && "Founder: "}
                        {tier}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Transformation Impact */}
        <div className="bg-gradient-sunset text-white rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-lora mb-4">Transforming African Innovation</h3>
            <p className="text-orange-100 max-w-2xl mx-auto">
              Join the movement that's reshaping how African entrepreneurs build, protect, and scale their innovations
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {successMetrics.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold mb-2">{item.metric}</div>
                <div className="text-orange-100 text-sm">{item.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-slate-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold font-lora text-slate-900 mb-4">Coming Soon</h3>
            <p className="text-slate-600">Next-generation features in development</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Badge className="bg-blue-100 text-blue-800 mb-3">Q2 2025</Badge>
              <div className="font-medium text-slate-900">University Challenges</div>
              <div className="text-sm text-slate-600">Student innovation leaderboards</div>
            </div>
            <div className="text-center">
              <Badge className="bg-purple-100 text-purple-800 mb-3">Q3 2025</Badge>
              <div className="font-medium text-slate-900">Corporate White-labeling</div>
              <div className="text-sm text-slate-600">Accelerator-branded platforms</div>
            </div>
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800 mb-3">Q4 2025</Badge>
              <div className="font-medium text-slate-900">Government Dashboards</div>
              <div className="text-sm text-slate-600">Real-time innovation heatmaps</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}