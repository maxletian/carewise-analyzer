
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { HealthProvider } from "@/contexts/HealthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import HealthForm from "./pages/HealthForm";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <HealthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/health-form" element={<HealthForm />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </TooltipProvider>
          </HealthProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
