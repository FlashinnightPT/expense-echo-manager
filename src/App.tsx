
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";

// Layout component
import Header from "@/components/layout/Header";

// Páginas principais
import Index from "@/pages/Index";
const Dashboard = lazy(() => import("@/components/layout/Dashboard"));
const Monthly = lazy(() => import("@/pages/Monthly"));
const Yearly = lazy(() => import("@/pages/Yearly"));
const Categories = lazy(() => import("@/pages/Categories"));
const CategoryAnalysis = lazy(() => import("@/pages/CategoryAnalysis"));
const Settings = lazy(() => import("@/pages/Settings"));
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
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route 
            path="/monthly" 
            element={
              <WithHeader>
                <Monthly />
              </WithHeader>
            } 
          />
          <Route 
            path="/yearly" 
            element={
              <WithHeader>
                <Yearly />
              </WithHeader>
            } 
          />
          <Route 
            path="/categories" 
            element={
              <WithHeader>
                <Categories />
              </WithHeader>
            } 
          />
          <Route 
            path="/category-analysis" 
            element={
              <WithHeader>
                <CategoryAnalysis />
              </WithHeader>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <WithHeader>
                <Settings />
              </WithHeader>
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
    </BrowserRouter>
  );
}

export default App;
