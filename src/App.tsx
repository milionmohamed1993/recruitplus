import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Pipeline from "./pages/Pipeline";
import CandidatePipeline from "./pages/CandidatePipeline";
import AddCandidate from "./pages/AddCandidate";
import CandidateDetail from "./pages/CandidateDetail";
import Companies from "./pages/Companies";
import AddCompany from "./pages/AddCompany";
import CompanyDetail from "./pages/CompanyDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/add" element={<AddCandidate />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/candidates/:id/pipeline" element={<CandidatePipeline />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/add" element={<AddCompany />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;