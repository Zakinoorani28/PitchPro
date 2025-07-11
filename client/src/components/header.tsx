import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Sprout, FileText } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold font-lora text-slate-900">ProtoLab</h1>
            <span className="text-sm text-primary">AI Pitch Builder</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <button className={`text-slate-600 hover:text-primary transition-colors font-medium ${location === '/' ? 'text-primary font-semibold' : ''}`}>
                Home
              </button>
            </Link>
            <Link href="/documents">
              <button className={`flex items-center space-x-1 text-slate-600 hover:text-primary transition-colors font-medium ${location === '/documents' ? 'text-primary font-semibold' : ''}`}>
                <FileText className="w-4 h-4" />
                <span>Documents</span>
              </button>
            </Link>
            {location === '/' && (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-slate-600 hover:text-primary transition-colors font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-slate-600 hover:text-primary transition-colors font-medium"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('generator')}
                  className="text-slate-600 hover:text-primary transition-colors font-medium"
                >
                  Create Pitch
                </button>
              </>
            )}
            <Button
              onClick={() => location === '/' ? scrollToSection('generator') : window.location.href = '/#generator'}
              className="bg-primary text-white hover:bg-orange-700"
            >
              Start Building
            </Button>
          </nav>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
