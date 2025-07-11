import { Link } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThreeDVideoTester from "@/components/3d-video-tester";

export default function ThreeDVideoTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="h-6 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h1 className="text-2xl font-bold text-slate-900">3D Video Testing</h1>
          </div>
        </div>
        
        <ThreeDVideoTester />
      </div>
    </div>
  );
}