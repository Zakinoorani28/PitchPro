import { Button } from "@/components/ui/button";
import { Sprout, Rocket, Users, Check, Clock, MapPin, Play } from "lucide-react";

export default function Hero() {
  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-hero py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sprout className="w-4 h-4 mr-2" />
              Empowering African Innovation
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold font-lora text-slate-900 mb-6 leading-tight">
              Build Your{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">Business Dream</span>{" "}
              Pitch
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              From agritech innovations to fintech solutions, create compelling pitch decks with deep African market insights. 
              Perfect for entrepreneurs across Africa and those targeting African opportunities.
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8 border border-orange-200">
              <div className="text-sm font-medium text-slate-800 mb-2">🌾 Featured Success Stories:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div>• FarmTech Kenya: Smart irrigation systems</div>
                <div>• AgroConnect Nigeria: Digital marketplace</div>
                <div>• SolarPower Ghana: Clean energy solutions</div>
                <div>• HealthTech Rwanda: Telemedicine platform</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={() => {
                  const element = document.getElementById('demo-showcase');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                size="lg"
                className="bg-primary text-white hover:bg-orange-700 flex items-center justify-center font-medium"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Complete Demo
              </Button>
              <Button
                onClick={scrollToGenerator}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Creating Now
              </Button>
            </div>
            
            <div className="flex items-center flex-wrap gap-6 text-sm text-slate-500">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-accent mr-2" />
                Free watermarked version
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                5-minute generation
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Global reach, Africa-focused
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1586094843725-9c26e3b4e0a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="African entrepreneur presenting business pitch with tablet"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            <div className="absolute -top-4 -right-4 bg-gradient-sunset text-white rounded-xl shadow-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">AI Creating Magic...</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-orange-200">
              <div className="text-xs font-medium text-slate-800">🚀 AgriTech Pitch</div>
              <div className="text-xs text-slate-600">Smart farming solutions for smallholder farmers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
