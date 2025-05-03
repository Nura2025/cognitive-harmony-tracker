
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import PatientDetail from "./pages/PatientDetail";
import Patients from "./pages/Patients";
import Reports from "./pages/Reports";
import Sessions from "./pages/Sessions";
import Analysis from "./pages/Analysis";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import Settings from "./pages/Settings";
import PrivateRoute from "./utils/PrivateRoute";
import AuthService from "./services/auth";
import SessionTimeoutHandler from "./components/SessionTimeoutHandler";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {isAuthenticated && <SessionTimeoutHandler />}
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/patients" element={
                  <PrivateRoute>
                    <Layout>
                      <Patients />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/patients/:id" element={
                  <PrivateRoute>
                    <Layout>
                      <PatientDetail />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/analysis" element={
                  <PrivateRoute>
                    <Layout>
                      <Analysis />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/sessions" element={
                  <PrivateRoute>
                    <Layout>
                      <Sessions />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/reports" element={
                  <PrivateRoute>
                    <Layout>
                      <Reports />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/my-account" element={
                  <PrivateRoute>
                    <Layout>
                      <MyAccount />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </PrivateRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
