
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";

// Páginas principais
import Index from "@/pages/Index";
const Dashboard = lazy(() => import("@/components/layout/Dashboard"));
const Monthly = lazy(() => import("@/pages/Monthly"));
const Yearly = lazy(() => import("@/pages/Yearly"));
const Categories = lazy(() => import("@/pages/Categories"));
const CategoryAnalysis = lazy(() => import("@/pages/CategoryAnalysis"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monthly" element={<Monthly />} />
          <Route path="/yearly" element={<Yearly />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category-analysis" element={<CategoryAnalysis />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
