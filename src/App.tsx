
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";

// Auth Provider
import { AuthProvider, RequireAuth, RequireEditor } from "@/hooks/useAuth";

// Layout component
import Header from "@/components/layout/Header";
import { LoadingPage } from "@/components/ui/loading-spinner";

// Páginas principais
import Index from "@/pages/Index";
const Painel = lazy(() => import("@/components/layout/Dashboard"));
const Monthly = lazy(() => import("@/pages/Monthly"));
const Yearly = lazy(() => import("@/pages/Yearly"));
const Categories = lazy(() => import("@/pages/Categories"));
const CategoryAnalysis = lazy(() => import("@/pages/CategoryAnalysis"));
const Settings = lazy(() => import("@/pages/Settings"));
const Users = lazy(() => import("@/pages/Users"));
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Layout component that includes the Header
const WithHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Header />
    {children}
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth>
                  <Painel />
                </RequireAuth>
              } 
            />
            <Route 
              path="/monthly" 
              element={
                <RequireAuth>
                  <WithHeader>
                    <Monthly />
                  </WithHeader>
                </RequireAuth>
              } 
            />
            <Route 
              path="/yearly" 
              element={
                <RequireAuth>
                  <WithHeader>
                    <Yearly />
                  </WithHeader>
                </RequireAuth>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <RequireAuth>
                  <WithHeader>
                    <Categories />
                  </WithHeader>
                </RequireAuth>
              } 
            />
            <Route 
              path="/category-analysis" 
              element={
                <RequireAuth>
                  <WithHeader>
                    <CategoryAnalysis />
                  </WithHeader>
                </RequireAuth>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <RequireAuth>
                  <WithHeader>
                    <Settings />
                  </WithHeader>
                </RequireAuth>
              } 
            />
            <Route 
              path="/users" 
              element={
                <RequireEditor>
                  <WithHeader>
                    <Users />
                  </WithHeader>
                </RequireEditor>
              } 
            />
            <Route 
              path="*" 
              element={
                <WithHeader>
                  <NotFound />
                </WithHeader>
              } 
            />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
