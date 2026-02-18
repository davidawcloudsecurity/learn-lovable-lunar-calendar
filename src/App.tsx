import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationManager } from "@/components/NotificationManager";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import AppPage from "./pages/App";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import EntrepreneursLanding from "./pages/EntrepreneursLanding";
import OverthinkerLanding from "./pages/OverthinkerLanding";
import WellnessLanding from "./pages/WellnessLanding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NotificationManager />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<AppPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/about" element={<Landing />} />
          <Route path="/entrepreneurs" element={<EntrepreneursLanding />} />
          <Route path="/overthinkers" element={<OverthinkerLanding />} />
          <Route path="/wellness" element={<WellnessLanding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
