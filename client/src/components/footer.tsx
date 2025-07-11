import { Globe } from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">ProtoLab</h3>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              ProtoLab • African DNA, Global Reach. Empowering entrepreneurs worldwide with region-intelligent AI agents.
            </p>
            <div className="environment-pill text-xs text-slate-500 mb-6">
              Replit • Light Mode • <span id="perf-indicator">Production Ready</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaGithub className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-white transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">API</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Integrations</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400">© 2024 ProtoLab. All rights reserved.</p>
          <p className="text-slate-400 mt-4 md:mt-0">Made for African entrepreneurs 🌍</p>
        </div>
      </div>
    </footer>
  );
}
