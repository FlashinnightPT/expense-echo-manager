
import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";

// Auth Provider
import { RequireAuth, RequireEditor } from "@/hooks/auth";

// Layout component
import Header from "@/components/layout/Header";
import { LoadingPage } from "@/components/ui/loading-spinner";

// Main pages - Important: Import Login without lazy loading
import Index from "@/pages/Index";
import Login from "@/pages/Login"; // Direct import for faster loading

// Lazy loaded pages
const Painel = lazy(() => import("@/components/layout/Dashboard"));
const Monthly = lazy(() => import("@/pages/Monthly"));
const Yearly = lazy(() => import("@/pages/Yearly"));
const Categories = lazy(() => import("@/pages/Categories"));
const CategoryAnalysis = lazy(() => import("@/pages/CategoryAnalysis"));
const CategoryComparison = lazy(() => import("@/pages/CategoryComparison"));
const CategoryReport = lazy(() => import("@/pages/CategoryReport"));
const Settings = lazy(() => import("@/pages/settings"));
const Users = lazy(() => import("@/pages/Users"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Layout component that includes the Header
const WithHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Header />
    {children}
  </div>
);

function App() {
  const location = useLocation();
  
  useEffect(() => {
    console.log("App: Current location", location.pathname);
  }, [location]);
  
  return (
    <>
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
            path="/category-comparison" 
            element={
              <RequireAuth>
                <WithHeader>
                  <CategoryComparison />
                </WithHeader>
              </RequireAuth>
            } 
          />
          <Route 
            path="/category-report" 
            element={
              <RequireAuth>
                <WithHeader>
                  <CategoryReport />
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
    </>
  );
}

export default App;
