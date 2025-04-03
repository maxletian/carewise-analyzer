
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { HealthProvider } from "@/contexts/HealthContext";
import { SchoolFeesProvider } from "@/contexts/SchoolFeesContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import HealthForm from "./pages/HealthForm";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";

// School Fees Pages
import SchoolFeesIndex from "./pages/SchoolFees/SchoolFeesIndex";
import SchoolFeesDashboard from "./pages/SchoolFees/Dashboard";
import StudentRegistration from "./pages/SchoolFees/StudentRegistration";
import StudentsList from "./pages/SchoolFees/StudentsList";
import StudentDetails from "./pages/SchoolFees/StudentDetails";
import FeesStructure from "./pages/SchoolFees/FeesStructure";
import RecordPayment from "./pages/SchoolFees/RecordPayment";
import Receipt from "./pages/SchoolFees/Receipt";
import Reports from "./pages/SchoolFees/Reports";

// Admin route guard component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();
  
  // Redirect to login if not logged in, or to dashboard if not an admin
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Add activity tracking to health context
const wrapWithActivityTracking = (Component: React.ComponentType, action: string) => {
  return (props: any) => {
    return (
      <Component {...props} activityAction={action} />
    );
  };
};

const queryClient = new QueryClient();

// Separate routes configuration to avoid auth context access issues
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/health-form" element={<HealthForm />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/admin" element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      } />
      
      {/* School Fees Management Routes */}
      <Route path="/school-fees" element={<SchoolFeesDashboard />} />
      <Route path="/school-fees/index" element={<SchoolFeesIndex />} />
      <Route path="/school-fees/students" element={<StudentsList />} />
      <Route path="/school-fees/students/register" element={<StudentRegistration />} />
      <Route path="/school-fees/students/:studentId" element={<StudentDetails />} />
      <Route path="/school-fees/fees" element={<FeesStructure />} />
      <Route path="/school-fees/payments/new/:studentId" element={<RecordPayment />} />
      <Route path="/school-fees/receipt/:paymentId" element={<Receipt />} />
      <Route path="/school-fees/reports" element={<Reports />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <HealthProvider>
            <SchoolFeesProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Layout>
                  <AppRoutes />
                </Layout>
              </TooltipProvider>
            </SchoolFeesProvider>
          </HealthProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
