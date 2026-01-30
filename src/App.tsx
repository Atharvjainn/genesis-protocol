import { toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import {Toaster} from 'react-hot-toast'
import SetTime from "./components/hackathon/Settime";
import { useGithubCommits } from "@/hooks/useGithubCommits";
import Page from "./pages/Leaderboardpage";

const queryClient = new QueryClient();

const App = () => {
  // 🔥 Hook runs throughout the entire app lifecycle
  useGithubCommits();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner
          position="top-right"
          toastOptions={{
            duration: 4500,
            className: `
              bg-black/90
              border border-hackathon-green/40
              text-white
              font-mono
              backdrop-blur
              shadow-[0_0_30px_rgba(34,197,94,0.45)]
            `,
            descriptionClassName: "text-hackathon-green/80",
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settime" element={<SetTime />} />
            <Route path="/leaderboard" element={<Page />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;