import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Documents from "@/pages/documents";
import NotFound from "@/pages/not-found";
import GammaPitchDemo from "@/pages/gamma-pitch-demo";
import ProfessionalShowcase from "@/pages/professional-showcase";
import Video3DDemo from "@/pages/3d-video-demo";
import ThreeDVideoTest from "@/pages/3d-video-test";
import AdminDashboard from "@/pages/admin-dashboard";
import Auth from "@/pages/auth";
import HackathonShowcase from "@/components/hackathon-showcase";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/documents" component={Documents} />
      <Route path="/gamma-demo" component={GammaPitchDemo} />
      <Route path="/showcase" component={ProfessionalShowcase} />
      <Route path="/3d-video" component={Video3DDemo} />
      <Route path="/3d-test" component={ThreeDVideoTest} />
      <Route path="/hackathon" component={HackathonShowcase} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
